'use client';

import { useAgent } from '@/lib/use-agent';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageCircle, X, Send } from 'lucide-react';
import { cn } from '@/lib/utils';

export function ChatWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const { messages, input, handleInputChange, handleSubmit, isLoading } = useAgent({
        api: '/api/chat',
    });

    return (
        <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-2">
            {isOpen && (
                <Card className="w-80 sm:w-96 shadow-xl border-border/50 backdrop-blur-md bg-background/95">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Todo Assistant</CardTitle>
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => setIsOpen(false)}>
                            <X className="h-4 w-4" />
                        </Button>
                    </CardHeader>
                    <CardContent className="h-64 sm:h-80 overflow-y-auto p-4 space-y-4">
                        {messages.length === 0 && (
                            <div className="text-center text-muted-foreground text-sm mt-8">
                                How can I help you today?
                            </div>
                        )}
                        {messages.map((m) => (
                            <div
                                key={m.id}
                                className={cn(
                                    "flex w-max max-w-[80%] flex-col gap-2 rounded-lg px-3 py-2 text-sm",
                                    m.role === 'user'
                                        ? "ml-auto bg-primary text-primary-foreground"
                                        : "bg-muted"
                                )}
                            >
                                {m.content}
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex w-max max-w-[80%] flex-col gap-2 rounded-lg px-3 py-2 text-sm bg-muted text-muted-foreground animate-pulse">
                                Typing...
                            </div>
                        )}
                    </CardContent>
                    <CardFooter className="p-3 pt-0">
                        <form onSubmit={handleSubmit} className="flex w-full items-center gap-2">
                            <Input
                                value={input}
                                onChange={handleInputChange}
                                placeholder="Type a message..."
                                className="flex-1"
                            />
                            <Button type="submit" size="sm" disabled={isLoading} className="px-3">
                                <Send className="h-4 w-4" />
                            </Button>
                        </form>
                    </CardFooter>
                </Card>
            )}

            <Button
                onClick={() => setIsOpen(!isOpen)}
                size="lg"
                className="rounded-full shadow-lg h-12 w-12 p-0 flex items-center justify-center"
            >
                <MessageCircle className="h-6 w-6" />
            </Button>
        </div>
    );
}
