---
name: vercel-ai-implementation
version: 1.1.0
description: Implementation guide for OpenAI Agents orchestrated by Vercel AI SDK.
constitution_alignment: v1.0
---

# Purpose
Orchestrate "OpenAI Agents" using Vercel AI SDK to perform autonomous, multi-step tasks.

# Implementation

## 1. The Orchestrator (Route)
-   **File**: `src/app/api/chat/route.ts`
-   **Role**: Binds the OpenAI Model to the Server Action Tools.
-   **Config**:
    ```typescript
    import { openai } from '@ai-sdk/openai';
    import { streamText } from 'ai';
    import { z } from 'zod';
    import { tools } from '@/server/ai/tools'; // The Stack Binding

    export async function POST(req: Request) {
        const session = await auth.api.getSession({ headers: req.headers });
        if (!session) return new Response('Unauthorized', { status: 401 });

        const { messages } = await req.json();
        
        // The Orchestration Loop
        const result = streamText({
            model: openai('gpt-4o'),
            messages,
            tools: tools(session.user.id), // Bind Session Context
            maxSteps: 5, // Enable Autonomy (Multi-step)
        });
        
        return result.toDataStreamResponse();
    }
    ```

## 2. The Stack Binding (Tools)
-   **File**: `src/server/ai/tools.ts`
-   **Purpose**: Expose Server Actions as typed Tools.
    ```typescript
    export const tools = (userId: string) => ({
      createTodo: tool({
        description: 'Create a new todo task',
        parameters: z.object({ content: z.string() }),
        execute: async ({ content }) => {
          // Logic...
        },
      }),
    });
    ```
