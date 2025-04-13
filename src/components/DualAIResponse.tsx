
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
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!question.trim()) {
      toast.error('Please enter a question');
      return;
    }

    setIsLoading(true);
    setError(null);
    setPrimaryResponse('');
    setClaudeResponse('');

    try {
      // Get Claude response
      const claudeResult = await anthropic.getResponse(question);
      setClaudeResponse(claudeResult);
      
      // If there's a primary AI function provided, use it
      if (getPrimaryAIResponse) {
        try {
          const primaryResult = await getPrimaryAIResponse(question);
          setPrimaryResponse(primaryResult);
        } catch (primaryError) {
          console.error('Primary AI error:', primaryError);
          setPrimaryResponse('Sorry, there was an error with the primary AI assistant.');
        }
      } else {
        // Default message if no primary AI is provided
        setPrimaryResponse('This is a placeholder for the primary AI response. Connect your own AI to replace this.');
      }
    } catch (error) {
      console.error('Error fetching AI responses:', error);
      setError('There was an error getting AI responses. Please try again later.');
      toast.error('Failed to get AI responses');
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
            Get an answer from our AI assistant
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
                  Getting Response...
                </>
              ) : 'Get AI Response'}
            </Button>
          </CardFooter>
        </form>
      </Card>

      {error && (
        <Card className="mb-6 border-red-300">
          <CardContent className="pt-6">
            <p className="text-red-500">{error}</p>
          </CardContent>
        </Card>
      )}

      {(primaryResponse || claudeResponse) && (
        <Card>
          <CardHeader>
            <CardTitle>AI Response</CardTitle>
            <CardDescription>
              {getPrimaryAIResponse ? 'Compare answers from different AI assistants' : 'Response from our AI assistant'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {getPrimaryAIResponse ? (
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
            ) : (
              <div className="p-4 rounded-md bg-muted/50">
                {claudeResponse ? (
                  <div className="whitespace-pre-wrap">{claudeResponse}</div>
                ) : (
                  <div className="text-muted-foreground italic">No response yet</div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DualAIResponse;
