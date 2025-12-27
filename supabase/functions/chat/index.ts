import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

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
    const { messages, language } = await req.json();

    console.log('Received chat request with', messages.length, 'messages');

    const systemPrompt = language === 'hi' 
      ? `आप जन-मित्र AI सहायक हैं। आप भारतीय सरकारी योजनाओं, छात्रवृत्तियों, कल्याण कार्यक्रमों और सब्सिडी के बारे में मदद करते हैं।
      
      आप इनमें मदद कर सकते हैं:
      - सरकारी योजनाओं के बारे में जानकारी
      - पात्रता मानदंड समझाना
      - आवेदन प्रक्रिया बताना
      - आवश्यक दस्तावेजों की सूची
      - आवेदन की समय सीमा
      
      हमेशा हिंदी में जवाब दें और सहायक रहें।`
      : `You are the Jan-Mitra AI assistant. You help users with information about Indian government schemes, scholarships, welfare programs, and subsidies.
      
      You can help with:
      - Information about government schemes
      - Explaining eligibility criteria
      - Application process guidance
      - Required documents list
      - Application deadlines
      
      Always be helpful, accurate, and provide actionable information about government schemes.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages
        ],
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', response.status, errorText);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const generatedText = data.choices[0].message.content;

    console.log('Generated response successfully');

    return new Response(JSON.stringify({ response: generatedText }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in chat function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
