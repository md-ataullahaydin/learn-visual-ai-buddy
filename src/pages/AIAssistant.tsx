
import React, { useState, useRef, useEffect } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Bot, User, RefreshCw } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface Message {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: Date;
}

const AIAssistant = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { profile } = useAuth();

  useEffect(() => {
    // Add a welcome message when the component mounts
    if (messages.length === 0) {
      setMessages([
        {
          id: "welcome",
          role: "assistant",
          content: 
            `👋 Hello${profile?.full_name ? ` ${profile.full_name}` : ''}! I'm your AI learning assistant. 
            How can I help you with your studies today?`,
          timestamp: new Date(),
        },
      ]);
    }
  }, [profile]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim()) return;
    
    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    
    try {
      // Prepare message history for the API - limited to last 10 messages for context
      const messageHistory = [...messages.slice(-10), userMessage]
        .filter(msg => msg.role !== "system")
        .map(msg => ({
          role: msg.role,
          content: msg.content,
        }));
      
      // Create user profile data to send
      const userProfileData = profile ? {
        full_name: profile.full_name,
        metadata: profile.metadata
      } : null;

      // Call the edge function
      const { data, error } = await supabase.functions.invoke("ai-chat", {
        body: { 
          messages: messageHistory,
          userProfile: userProfileData
        },
      });
      
      if (error) {
        throw new Error(error.message);
      }
      
      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: data.response,
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to get a response",
        variant: "destructive",
      });
      
      // Add error message
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: "I'm sorry, I couldn't process your request. Please try again later.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearConversation = () => {
    setMessages([
      {
        id: "welcome",
        role: "assistant",
        content: 
          `👋 Hello${profile?.full_name ? ` ${profile.full_name}` : ''}! I'm your AI learning assistant. 
          How can I help you with your studies today?`,
        timestamp: new Date(),
      },
    ]);
  };

  return (
    <div className="container max-w-4xl mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">AI Learning Assistant</h1>
        <Button 
          variant="outline" 
          onClick={clearConversation}
          className="flex items-center"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          New Conversation
        </Button>
      </div>
      
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Your Personalized Learning Assistant</CardTitle>
          <CardDescription>
            Ask questions, get explanations, or request help with any subject.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col space-y-4">
          <div className="bg-muted p-4 rounded-lg mb-4 text-sm">
            <p className="font-medium mb-2">Try asking:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Explain the concept of photosynthesis</li>
              <li>Help me understand quadratic equations</li>
              <li>What are the key events of World War II?</li>
              <li>Give me a study plan for my upcoming exams</li>
            </ul>
          </div>
        </CardContent>
      </Card>
      
      <Card className="flex flex-col h-[600px]">
        <CardHeader className="py-3 px-4 border-b">
          <CardTitle className="text-lg flex items-center">
            <Bot className="h-5 w-5 mr-2 text-primary" />
            Chat
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-grow overflow-y-auto p-4">
          <div className="flex flex-col space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.role === "assistant" ? "justify-start" : "justify-end"
                }`}
              >
                <div
                  className={`flex max-w-[80%] ${
                    message.role === "assistant"
                      ? "bg-secondary text-secondary-foreground"
                      : "bg-primary text-primary-foreground"
                  } rounded-lg p-3`}
                >
                  <div className="shrink-0 mr-2">
                    {message.role === "assistant" ? (
                      <Bot className="h-5 w-5" />
                    ) : (
                      <User className="h-5 w-5" />
                    )}
                  </div>
                  <div>
                    <div className="whitespace-pre-wrap">{message.content}</div>
                    <div className="text-xs opacity-70 mt-1">
                      {message.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </CardContent>
        <CardFooter className="border-t p-3">
          <form onSubmit={handleSendMessage} className="flex w-full space-x-2">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 min-h-[50px] max-h-[150px]"
              disabled={isLoading}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage(e);
                }
              }}
            />
            <Button type="submit" disabled={isLoading || !input.trim()}>
              {isLoading ? (
                <RefreshCw className="h-5 w-5 animate-spin" />
              ) : (
                <Send className="h-5 w-5" />
              )}
            </Button>
          </form>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AIAssistant;
