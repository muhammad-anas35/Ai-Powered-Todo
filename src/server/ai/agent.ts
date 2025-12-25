import {
    Agent,
    tool,
    setDefaultOpenAIClient,
    setDefaultOpenAIKey,
    setTracingDisabled,
} from "@openai/agents";
import { z } from "zod";
import OpenAI from "openai";
import { toolsImplementation } from "./tools";

/* Global configuration */

setTracingDisabled(true);
setDefaultOpenAIKey(process.env.GOOGLE_API_KEY!);

if (!process.env.GOOGLE_API_KEY) {
    throw new Error("Missing GOOGLE_API_KEY");
}

const geminiClient = new OpenAI({
    apiKey: process.env.GOOGLE_API_KEY,
    baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
});

setDefaultOpenAIClient(geminiClient);

/* Agent factory */

export function createAgent(userId: string) {
    const tools = toolsImplementation(userId);

    const createTodoTool = tool({
        name: "createTodo",
        description: "Create a new todo task.",
        parameters: z.object({
            content: z.string().describe("The content of the task"),
            priority: z.enum(["low", "medium", "high"]).optional(),
        }),
        execute: tools.createTodo,
    });

    const deleteTodoTool = tool({
        name: "deleteTodo",
        description: "Delete a todo item by its ID.",
        parameters: z.object({
            id: z.string().describe("The UUID of the todo"),
        }),
        execute: tools.deleteTodo,
    });

    const updateTodoTool = tool({
        name: "updateTodo",
        description: "Update the completion status of a todo item.",
        parameters: z.object({
            id: z.string(),
            isCompleted: z.boolean(),
        }),
        execute: tools.updateTodo,
    });

    const getTodosTool = tool({
        name: "getTodos",
        description: "Get the user's current todo list.",
        parameters: z.object({}),
        execute: tools.getTodos,
    });

    return new Agent({
        name: "Todo Assistant",
        model: "gemini-2.5-flash",
        instructions: `
You are a helpful and efficient Todo Assistant.

RULES:
1. Always call getTodos when the user asks about their tasks.
2. Default priority to "low" when creating a task if not specified.
3. Ensure the correct ID when updating or deleting a task.
4. Be concise and friendly.
        `.trim(),
        tools: [
            createTodoTool,
            deleteTodoTool,
            updateTodoTool,
            getTodosTool,
        ],
    });
}
