import { createAgent } from "@/server/ai/agent";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { run } from "@openai/agents";

export const runtime = "nodejs";

export async function POST(req: Request) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session?.user) {
        return new Response("Unauthorized - Please login first", { status: 401 });
    }

    try {
        const { messages } = await req.json();
        const lastMessage = messages[messages.length - 1];

        const agent = createAgent(session.user.id);

        // Run the agent with the user's message
        const result = await run(agent, lastMessage.content);

        // Return the final output
        return new Response(result.finalOutput, {
            status: 200,
            headers: {
                "Content-Type": "text/plain; charset=utf-8",
            },
        });
    } catch (error: any) {
        console.error("Agent Error:", error);
        return new Response(`Error: ${error.message || "An error occurred"}`, {
            status: 500,
        });
    }
}
