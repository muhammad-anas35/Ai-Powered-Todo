
import { createAuthClient } from "better-auth/react"

export const authClient = createAuthClient({
    baseURL: "https://ai-focus-todo.vercel.app/"
})

export const { useSession } = authClient;
