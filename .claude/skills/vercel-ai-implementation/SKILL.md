---
name: openai-agents-implementation
version: 1.0.0
description: Implementation guide for the official @openai/agents SDK.
constitution_alignment: v1.0
---

# Purpose
Implement autonomous agents using the official `@openai/agents` SDK.

# Implementation

## 1. Setup
-   **Package**: `npm install @openai/agents`
-   **File**: `src/server/ai/agent.ts`
-   **Config**:
    ```typescript
    import { Agent } from '@openai/agents';
    
    export const todoAgent = new Agent({
      name: 'Todo Assistant',
      model: 'gpt-4o',
      instructions: 'You are a helpful assistant that manages todos.',
      tools: [
        // Define specific tools here
      ],
    });
    ```

## 2. Execution (Server Action)
-   **File**: `src/server/actions/chat.ts`
-   **Purpose**: Run the agent loop on the server.
    ```typescript
    'use server'
    import { todoAgent } from '@/server/ai/agent';
    
    export async function sendMessage(history: any[], message: string) {
       // Run the agent and return the stream/result
    }
    ```

## 3. Client
-   **Interface**: Standard Chat UI interacting with the Server Action.
