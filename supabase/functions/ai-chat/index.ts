
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not found');
    }

    const { messages, userProfile } = await req.json();

    // Format messages for OpenAI
    const formattedMessages = messages.map((msg: any) => ({
      role: msg.role,
      content: msg.content
    }));

    // Create personalized system message based on user profile
    let systemMessage = 'You are a helpful AI learning assistant specialized in education. Provide concise, accurate, and educational responses. Always aim to explain concepts clearly and help with learning tasks.';
    
    if (userProfile) {
      const { 
        full_name, 
        metadata 
      } = userProfile;
      
      if (metadata) {
        const { 
          grade, 
          preferred_subjects, 
          learning_style, 
          country, 
          state, 
          school 
        } = metadata;

        // Build personalized system message
        systemMessage = `You are a helpful AI learning assistant specialized in education. 
You are tutoring ${full_name || 'a student'}${grade ? ` in ${grade}` : ''}${school ? ` at ${school}` : ''}.
${preferred_subjects && preferred_subjects.length > 0 ? `They are particularly interested in: ${preferred_subjects.join(', ')}.` : ''}
${learning_style ? `Their preferred learning style is ${learning_style}. Adapt your explanations to be ${getLearningstyleDescription(learning_style)}.` : ''}
${country ? `They are from ${country}${state ? `, ${state}` : ''}.` : ''}

Provide concise, accurate, and educational responses tailored to their background and interests. 
Always aim to explain concepts clearly and help with their learning journey.
If they ask questions in subjects they're interested in, provide more detailed responses.`;
      }
    }

    // Add system message if not present
    if (!formattedMessages.find((msg: any) => msg.role === 'system')) {
      formattedMessages.unshift({
        role: 'system',
        content: systemMessage
      });
    }

    // Call OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: formattedMessages,
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('OpenAI API error:', error);
      throw new Error(error.error?.message || 'Failed to get response from OpenAI');
    }

    const data = await response.json();
    return new Response(
      JSON.stringify({
        response: data.choices[0].message.content,
        usage: data.usage
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in AI chat function:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'An error occurred' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

function getLearningstyleDescription(style: string): string {
  switch (style) {
    case 'visual':
      return 'more visual, using diagrams, charts, and images when appropriate';
    case 'auditory':
      return 'focused on clear verbal explanations, using analogies and stories';
    case 'kinesthetic':
      return 'practical and hands-on, providing examples of activities they can try';
    case 'reading':
      return 'text-based and structured, providing resources they can read';
    default:
      return 'balanced and accessible';
  }
}
