
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";
import { anthropic } from '@/lib/anthropic';
import { toast } from 'sonner';

interface DualAIResponseProps {
  // If you have an existing AI, you can pass its function here
  getPrimaryAIResponse?: (question: string) => Promise<string>;
}

const DualAIResponse: React.FC<DualAIResponseProps> = ({ getPrimaryAIResponse }) => {
  const [question, setQuestion] = useState('');
  const [primaryResponse, setPrimaryResponse] = useState('');
  const [claudeResponse, setClaudeResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('primary');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!question.trim()) {
      toast.error('Please enter a question');
      return;
    }

    setIsLoading(true);
    setPrimaryResponse('');
    setClaudeResponse('');

    try {
      // Get responses from both AIs in parallel
      const responses = await Promise.allSettled([
        // If there's a primary AI function provided, use it, otherwise use a placeholder
        getPrimaryAIResponse 
          ? getPrimaryAIResponse(question) 
          : Promise.resolve('Primary AI response would appear here.'),
        anthropic.getResponse(question)
      ]);

      // Handle the primary AI response
      if (responses[0].status === 'fulfilled') {
        setPrimaryResponse(responses[0].value);
      } else {
        setPrimaryResponse('Sorry, there was an error with the primary AI assistant.');
        console.error('Primary AI error:', responses[0].reason);
      }

      // Handle the Claude response
      if (responses[1].status === 'fulfilled') {
        setClaudeResponse(responses[1].value);
      } else {
        setClaudeResponse('Sorry, there was an error with the Claude AI assistant.');
        console.error('Claude error:', responses[1].reason);
      }
    } catch (error) {
      console.error('Error fetching AI responses:', error);
      toast.error('There was an error getting AI responses');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Ask Your Question</CardTitle>
          <CardDescription>
            Get answers from two different AI assistants
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent>
            <Textarea
              placeholder="Type your question here..."
              className="min-h-24"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              disabled={isLoading}
            />
          </CardContent>
          <CardFooter>
            <Button 
              type="submit" 
              disabled={isLoading || !question.trim()}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Getting Responses...
                </>
              ) : 'Get AI Responses'}
            </Button>
          </CardFooter>
        </form>
      </Card>

      {(primaryResponse || claudeResponse) && (
        <Card>
          <CardHeader>
            <CardTitle>AI Responses</CardTitle>
            <CardDescription>
              Compare answers from different AI assistants
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="primary">Primary AI</TabsTrigger>
                <TabsTrigger value="claude">Claude AI</TabsTrigger>
              </TabsList>
              <TabsContent value="primary" className="mt-4">
                <div className="p-4 rounded-md bg-muted/50">
                  {primaryResponse ? (
                    <div className="whitespace-pre-wrap">{primaryResponse}</div>
                  ) : (
                    <div className="text-muted-foreground italic">No response yet</div>
                  )}
                </div>
              </TabsContent>
              <TabsContent value="claude" className="mt-4">
                <div className="p-4 rounded-md bg-muted/50">
                  {claudeResponse ? (
                    <div className="whitespace-pre-wrap">{claudeResponse}</div>
                  ) : (
                    <div className="text-muted-foreground italic">No response yet</div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DualAIResponse;
