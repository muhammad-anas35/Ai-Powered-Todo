'use client';

import { useState, useCallback } from 'react';

export type Message = {
    id: string;
    role: 'user' | 'assistant';
    content: string;
};

export function useAgent({ api }: { api: string }) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInput(e.target.value);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: input,
        };

        setMessages((prev) => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const response = await fetch(api, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    messages: [...messages, userMessage],
                }),
                credentials: 'include', // Ensure cookies are sent for authentication
            });

            if (!response.ok) throw new Error(response.statusText);

            // Stream handling
            const reader = response.body?.getReader();
            if (!reader) throw new Error('No reader available');

            const assistantMessageId = (Date.now() + 1).toString();
            setMessages((prev) => [
                ...prev,
                { id: assistantMessageId, role: 'assistant', content: '' },
            ]);

            const decoder = new TextDecoder();
            let done = false;

            while (!done) {
                const { value, done: doneReading } = await reader.read();
                done = doneReading;
                const chunkValue = decoder.decode(value, { stream: true });

                setMessages((prev) =>
                    prev.map((msg) =>
                        msg.id === assistantMessageId
                            ? { ...msg, content: msg.content + chunkValue }
                            : msg
                    )
                );
            }
        } catch (error) {
            console.error('Chat Error:', error);
            // Optional: Add error message to chat
        } finally {
            setIsLoading(false);
        }
    };

    return {
        messages,
        input,
        handleInputChange,
        handleSubmit,
        isLoading,
    };
}
