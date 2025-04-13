
// Anthropic API client for Claude AI

// Initialize with the API key or a default mock mode
const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;

// Function to get a response from Claude
export async function getClaudeResponse(question: string): Promise<string> {
  try {
    // If no API key is provided, return a mock response
    if (!apiKey) {
      console.warn('No Anthropic API key found. Using mock response.');
      return getMockResponse(question);
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-haiku-20240307',
        max_tokens: 1000,
        messages: [
          {
            role: 'user',
            content: `You are a helpful educational AI assistant. Please answer this question from a student: ${question}`
          }
        ]
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Anthropic API error:', errorData);
      return `Sorry, there was an error getting a response from the AI. (Error: ${response.status})`;
    }

    const data = await response.json();
    return data.content[0].text;
  } catch (error) {
    console.error('Error calling Anthropic API:', error);
    return 'Sorry, there was an error connecting to the AI assistant.';
  }
}

// Function to generate mock responses when no API key is available
function getMockResponse(question: string): string {
  // Generate a consistent response based on the question
  const questionLower = question.toLowerCase();
  
  if (questionLower.includes('math') || questionLower.includes('calculate')) {
    return "I can help with math problems! To solve mathematical equations, I'd typically break them down step by step. For example, with an equation like 2x + 5 = 13, I'd first subtract 5 from both sides to get 2x = 8, then divide by 2 to find x = 4. Without a specific problem though, I can only explain the general approach.";
  }
  
  if (questionLower.includes('science') || questionLower.includes('physics') || questionLower.includes('chemistry')) {
    return "Great science question! Science is built on the scientific method: observation, hypothesis, experiment, and conclusion. I'd be happy to explore specific scientific concepts when you have questions about physics, chemistry, biology, or other scientific fields.";
  }
  
  if (questionLower.includes('history') || questionLower.includes('when did')) {
    return "History is a fascinating subject that helps us understand our present by examining the past. Historical analysis considers primary sources, context, and different perspectives on events. If you have a specific historical period or event you'd like to learn about, I'd be happy to provide more details.";
  }
  
  if (questionLower.includes('english') || questionLower.includes('literature') || questionLower.includes('grammar')) {
    return "Language and literature help us communicate and understand our world through stories and ideas. Good writing typically focuses on clarity, structure, and purpose. Reading widely helps develop critical thinking and empathy. I'd be happy to discuss specific literary works or language concepts in more detail.";
  }
  
  // Default response if no specific topic is detected
  return "Thanks for your question! I'm an AI assistant designed to help with educational topics. I can provide information on subjects like math, science, history, literature, and more. To give you the most helpful response, could you provide more details about what you'd like to learn?";
}

// Export the anthropic client
export const anthropic = {
  getResponse: getClaudeResponse
};
