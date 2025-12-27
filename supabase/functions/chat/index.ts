import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    console.log('Received chat request with', messages.length, 'messages');

    const systemPrompt = language === 'hi' 
      ? `आप जन-मित्र AI सहायक हैं। आप भारतीय सरकारी योजनाओं, छात्रवृत्तियों, कल्याण कार्यक्रमों और सब्सिडी के बारे में मदद करते हैं।
      
      आप इनमें मदद कर सकते हैं:
      - सरकारी योजनाओं के बारे में जानकारी
      - पात्रता मानदंड समझाना
      - आवेदन प्रक्रिया बताना
      - आवश्यक दस्तावेजों की सूची
      - आवेदन की समय सीमा
      
      हमेशा हिंदी में जवाब दें और सहायक रहें। जवाब संक्षिप्त और स्पष्ट रखें।`
      : `You are the Jan-Mitra AI assistant. You help users with information about Indian government schemes, scholarships, welfare programs, and subsidies.
      
      You can help with:
      - Information about government schemes like PM Kisan, PMAY, scholarships
      - Explaining eligibility criteria
      - Application process guidance
      - Required documents list
      - Application deadlines
      
      Always be helpful, accurate, and provide actionable information about government schemes. Keep responses concise and clear.`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: 'AI credits exhausted. Please add funds.' }), {
          status: 402,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      throw new Error(`AI gateway error: ${response.status}`);
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
