
import React, { useState, useRef, useEffect } from "react";
import { 
  ArrowRight, 
  Eraser, 
  FileUp, 
  Image, 
  Info, 
  Loader2, 
  MessageSquare, 
  Mic, 
  PanelLeftClose, 
  PanelLeftOpen, 
  Plus, 
  Send, 
  Settings, 
  ThumbsUp,
  ThumbsDown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

// Sample chat history
const initialMessages = [
  {
    id: 1,
    role: "assistant",
    content: "Hello! I'm your AI learning assistant. How can I help you today?",
    timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
  },
  {
    id: 2,
    role: "user",
    content: "Can you help me understand quadratic equations?",
    timestamp: new Date(Date.now() - 1000 * 60 * 4).toISOString(),
  },
  {
    id: 3,
    role: "assistant",
    content: 
      "Absolutely! A quadratic equation is a second-degree polynomial equation of the form ax² + bx + c = 0, where a, b, and c are constants and a ≠ 0.\n\n" +
      "Here are some key points:\n\n" +
      "1. The standard form is ax² + bx + c = 0\n" +
      "2. You can solve them using factoring, completing the square, or the quadratic formula\n" +
      "3. The quadratic formula is x = (-b ± √(b² - 4ac)) / 2a\n" +
      "4. The discriminant (b² - 4ac) tells you how many solutions exist\n\n" +
      "Would you like me to generate a visual representation of a quadratic function or explain a specific aspect in more detail?",
    timestamp: new Date(Date.now() - 1000 * 60 * 3).toISOString(),
    hasImage: true,
    imageDescription: "Parabola graph showing key features of a quadratic function: vertex, axis of symmetry, y-intercept, and roots."
  },
  {
    id: 4,
    role: "user",
    content: "Can you show me how to solve a specific example?",
    timestamp: new Date(Date.now() - 1000 * 60 * 2).toISOString(),
  },
  {
    id: 5,
    role: "assistant",
    content: 
      "Let's solve the quadratic equation: 2x² - 5x - 3 = 0\n\n" +
      "Step 1: Identify the values of a, b, and c.\n" +
      "a = 2, b = -5, c = -3\n\n" +
      "Step 2: We can try to factor this equation.\n" +
      "2x² - 5x - 3 = 0\n" +
      "We need to find two numbers that multiply to give 2 × (-3) = -6 and add up to -5.\n" +
      "These numbers are -6 and 1, since (-6) × 1 = -6 and (-6) + 1 = -5.\n\n" +
      "Step 3: Rewrite the middle term.\n" +
      "2x² - 6x + 1x - 3 = 0\n" +
      "2x(x - 3) + 1(x - 3) = 0\n" +
      "(2x + 1)(x - 3) = 0\n\n" +
      "Step 4: Set each factor equal to zero and solve.\n" +
      "2x + 1 = 0 or x - 3 = 0\n" +
      "x = -1/2 or x = 3\n\n" +
      "Therefore, the solutions to 2x² - 5x - 3 = 0 are x = -1/2 and x = 3.\n\n" +
      "Would you like me to verify these solutions by substituting them back into the original equation?",
    timestamp: new Date(Date.now() - 1000 * 60).toISOString(),
  },
];

// Sample suggestion prompts
const suggestionPrompts = [
  "Create a diagram of photosynthesis",
  "Explain Newton's laws of motion",
  "Generate flashcards for biology",
  "Help me understand stoichiometry",
  "Create a quiz on world history",
  "Show me the steps to solve this equation",
];

// Sample conversations
const conversations = [
  { id: 1, title: "Quadratic Equations Help", date: "Today" },
  { id: 2, title: "Cell Biology Concepts", date: "Yesterday" },
  { id: 3, title: "Chemistry Homework Questions", date: "Apr 8, 2025" },
  { id: 4, title: "World History Timeline", date: "Apr 5, 2025" },
];

const AIAssistant = () => {
  const [messages, setMessages] = useState(initialMessages);
  const [inputValue, setInputValue] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const [newChatTitle, setNewChatTitle] = useState("");
  const [isCreatingChat, setIsCreatingChat] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    
    const userMessage = {
      id: messages.length + 1,
      role: "user",
      content: inputValue,
      timestamp: new Date().toISOString(),
    };
    
    setMessages([...messages, userMessage]);
    setInputValue("");
    setIsProcessing(true);
    
    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        id: messages.length + 2,
        role: "assistant",
        content: "I'm simulating an AI response to your question. In a real implementation, this would be generated by an actual AI model based on your input: " + inputValue,
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsProcessing(false);
    }, 1500);
  };

  const handleFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      toast.success(`File uploaded: ${files[0].name}`);
      // Handle file upload logic here
    }
  };

  const handleStartNewChat = () => {
    setIsCreatingChat(true);
  };

  const handleCreateChat = () => {
    if (newChatTitle.trim()) {
      toast.success(`New chat created: ${newChatTitle}`);
      setNewChatTitle("");
      setIsCreatingChat(false);
      // Reset messages to just a welcome message
      setMessages([{
        id: 1,
        role: "assistant",
        content: "Hello! I'm your AI learning assistant. How can I help you today?",
        timestamp: new Date().toISOString(),
      }]);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
  };

  const handleClearChat = () => {
    setMessages([{
      id: 1,
      role: "assistant",
      content: "Hello! I'm your AI learning assistant. How can I help you today?",
      timestamp: new Date().toISOString(),
    }]);
  };

  return (
    <div className="h-[calc(100vh-theme(spacing.16))] md:h-[calc(100vh-theme(spacing.32))] flex flex-col md:flex-row animate-fade-in">
      {/* Sidebar */}
      {showSidebar && (
        <div className="w-full md:w-80 border-r flex flex-col">
          <div className="p-4 border-b">
            <Button
              onClick={handleStartNewChat}
              className="w-full justify-start"
            >
              <Plus className="mr-2 h-4 w-4" />
              New Chat
            </Button>
          </div>
          
          {isCreatingChat ? (
            <div className="p-4 border-b">
              <div className="space-y-2">
                <Label htmlFor="chat-title">Chat Title</Label>
                <Input 
                  id="chat-title"
                  placeholder="Enter a title for your chat"
                  value={newChatTitle}
                  onChange={(e) => setNewChatTitle(e.target.value)}
                />
                <div className="flex gap-2">
                  <Button
                    variant="outline" 
                    className="w-full"
                    onClick={() => setIsCreatingChat(false)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    className="w-full"
                    onClick={handleCreateChat}
                  >
                    Create
                  </Button>
                </div>
              </div>
            </div>
          ) : null}
          
          <ScrollArea className="flex-1">
            <div className="p-4">
              <h3 className="text-sm font-medium mb-2">Recent Conversations</h3>
              <div className="space-y-2">
                {conversations.map((conversation) => (
                  <Button
                    key={conversation.id}
                    variant="ghost"
                    className="w-full justify-start text-left h-auto py-2"
                  >
                    <div className="flex flex-col items-start">
                      <span className="font-medium">{conversation.title}</span>
                      <span className="text-xs text-muted-foreground">
                        {conversation.date}
                      </span>
                    </div>
                  </Button>
                ))}
              </div>
            </div>
          </ScrollArea>
          
          <div className="p-4 border-t space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="image-generation" className="text-sm">Image Generation</Label>
              <Switch id="image-generation" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="voice-response" className="text-sm">Voice Responses</Label>
              <Switch id="voice-response" />
            </div>
            <Button variant="ghost" size="sm" className="w-full justify-start">
              <Settings className="mr-2 h-4 w-4" />
              Assistant Settings
            </Button>
          </div>
        </div>
      )}
      
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-background">
        <div className="flex items-center p-4 border-b">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowSidebar(!showSidebar)}
            className="mr-2"
          >
            {showSidebar ? <PanelLeftClose className="h-4 w-4" /> : <PanelLeftOpen className="h-4 w-4" />}
          </Button>
          <h1 className="text-lg font-semibold">AI Learning Assistant</h1>
          <div className="ml-auto flex items-center gap-1">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" onClick={handleClearChat}>
                    <Eraser className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Clear chat</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Info className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>AI assistant info</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
        
        {/* Messages Area */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-6">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`flex gap-3 max-w-3xl ${
                    message.role === "user" ? "flex-row-reverse" : ""
                  }`}
                >
                  <Avatar className="h-8 w-8">
                    {message.role === "assistant" ? (
                      <AvatarImage src="/placeholder.svg" alt="AI" />
                    ) : null}
                    <AvatarFallback className={message.role === "assistant" ? "bg-primary text-primary-foreground" : ""}>
                      {message.role === "assistant" ? "AI" : "You"}
                    </AvatarFallback>
                  </Avatar>
                  <div className={`space-y-2 ${message.role === "user" ? "text-right" : ""}`}>
                    <div
                      className={`inline-block rounded-lg p-4 ${
                        message.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      }`}
                    >
                      <div className="whitespace-pre-line">{message.content}</div>
                    </div>
                    
                    {message.hasImage && (
                      <div
                        className={`inline-block rounded-lg overflow-hidden border ${
                          message.role === "user" ? "ml-auto" : ""
                        }`}
                      >
                        <div className="aspect-video w-80 bg-secondary flex items-center justify-center">
                          <Image className="h-12 w-12 text-muted-foreground" />
                        </div>
                        <div className="p-2 text-xs text-muted-foreground">
                          {message.imageDescription}
                        </div>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>
                        {new Date(message.timestamp).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                      
                      {message.role === "assistant" && (
                        <>
                          <Separator orientation="vertical" className="h-3" />
                          <div className="flex items-center gap-1">
                            <Button variant="ghost" size="icon" className="h-6 w-6">
                              <ThumbsUp className="h-3 w-3" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-6 w-6">
                              <ThumbsDown className="h-3 w-3" />
                            </Button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {isProcessing && (
              <div className="flex justify-start">
                <div className="flex gap-3 max-w-3xl">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder.svg" alt="AI" />
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      AI
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-2">
                    <div className="inline-block rounded-lg p-4 bg-muted">
                      <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
        
        {/* Prompt Suggestions */}
        {messages.length <= 2 && (
          <div className="px-4 py-3 border-t">
            <h3 className="text-sm font-medium mb-2">Suggested prompts</h3>
            <div className="flex flex-wrap gap-2">
              {suggestionPrompts.map((prompt, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="text-sm h-auto py-1.5"
                  onClick={() => handleSuggestionClick(prompt)}
                >
                  {prompt}
                </Button>
              ))}
            </div>
          </div>
        )}
        
        {/* Input Area */}
        <div className="p-4 border-t">
          <form onSubmit={handleSubmit} className="flex flex-col gap-2">
            <div className="relative">
              <Textarea
                placeholder="Ask me anything about your studies..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="min-h-[80px] resize-none pr-12"
              />
              <div className="absolute right-2 bottom-2 flex items-center gap-1">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileSelected}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={handleFileUpload}
                  className="h-8 w-8"
                >
                  <FileUp className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                >
                  <Mic className="h-4 w-4" />
                </Button>
                <Button
                  type="submit"
                  size="icon"
                  className="h-8 w-8"
                  disabled={!inputValue.trim() || isProcessing}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              AI responses are generated based on your questions. For the best results, be specific in your queries.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;
