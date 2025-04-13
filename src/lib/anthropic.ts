
// Anthropic API client for Claude AI

// Initialize with the API key or a default mock value
const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY || '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';

// Function to get a response from Claude
export async function getClaudeResponse(question: string): Promise<string> {
  try {
    // Check if we should use the mock response (for development or preview)
    if (!import.meta.env.VITE_ANTHROPIC_API_KEY) {
      console.warn('Using default Anthropic API key. For production, set your own key as VITE_ANTHROPIC_API_KEY.');
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
      return `Sorry, there was an error getting a response from the second AI. (Error: ${response.status})`;
    }

    const data = await response.json();
    return data.content[0].text;
  } catch (error) {
    console.error('Error calling Anthropic API:', error);
    return 'Sorry, there was an error connecting to the second AI assistant.';
  }
}

// Create a mock client if the API key is missing or for development purposes
export const anthropic = {
  getResponse: getClaudeResponse
};
