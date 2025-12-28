import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Sanitize user input by removing control characters and limiting content
function sanitizeMessage(content: string): string {
  // Remove control characters except newlines and tabs
  let sanitized = content.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');
  
  // Limit to max length
  if (sanitized.length > 2000) {
    sanitized = sanitized.substring(0, 2000);
  }
  
  return sanitized.trim();
}

// Simple rate limiting store (in production, use Redis or database)
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW_MS = 60000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 20; // 20 requests per minute per user

function checkRateLimit(userId: string): boolean {
  const now = Date.now();
  const userLimit = rateLimitStore.get(userId);
  
  if (!userLimit || now > userLimit.resetAt) {
    rateLimitStore.set(userId, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }
  
  if (userLimit.count >= RATE_LIMIT_MAX_REQUESTS) {
    return false;
  }
  
  userLimit.count++;
  return true;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify authentication
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      console.log('Missing authorization header');
      return new Response(JSON.stringify({ error: 'Authentication required', code: 'AUTH_REQUIRED' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Create Supabase client and verify the user
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY');
    
    if (!supabaseUrl || !supabaseAnonKey) {
      console.error('Missing Supabase configuration');
      return new Response(JSON.stringify({ error: 'Service temporarily unavailable', code: 'SERVICE_ERROR' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } }
    });

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    
    if (authError || !user) {
      console.log('Auth verification failed:', authError?.message);
      return new Response(JSON.stringify({ error: 'Authentication failed', code: 'AUTH_FAILED' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Check rate limit
    if (!checkRateLimit(user.id)) {
      console.log('Rate limit exceeded for user:', user.id);
      return new Response(JSON.stringify({ error: 'Too many requests. Please wait a moment.', code: 'RATE_LIMITED' }), {
        status: 429,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('Authenticated user:', user.id);

    const { messages, language } = await req.json();
    
    // Validate input
    if (!messages || !Array.isArray(messages)) {
      return new Response(JSON.stringify({ error: 'Invalid request format', code: 'INVALID_FORMAT' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Limit message history to prevent abuse
    const limitedMessages = messages.slice(-20);

    // Validate and sanitize each message
    const sanitizedMessages = [];
    for (const msg of limitedMessages) {
      if (!msg.content || typeof msg.content !== 'string') {
        return new Response(JSON.stringify({ error: 'Invalid message format', code: 'INVALID_MESSAGE' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      if (msg.content.length > 2000) {
        return new Response(JSON.stringify({ error: 'Message too long', code: 'MESSAGE_TOO_LONG' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      if (!['user', 'assistant', 'system'].includes(msg.role)) {
        return new Response(JSON.stringify({ error: 'Invalid message format', code: 'INVALID_ROLE' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Sanitize the message content
      sanitizedMessages.push({
        role: msg.role,
        content: sanitizeMessage(msg.content)
      });
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

    if (!LOVABLE_API_KEY) {
      console.error('LOVABLE_API_KEY is not configured');
      return new Response(JSON.stringify({ error: 'Service temporarily unavailable', code: 'SERVICE_ERROR' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('Processing chat request for user:', user.id, 'with', sanitizedMessages.length, 'messages');

    const systemPrompt = language === 'hi' 
      ? `आप जन-मित्र AI सहायक हैं। आप भारतीय सरकारी योजनाओं, छात्रवृत्तियों, कल्याण कार्यक्रमों और सब्सिडी के बारे में मदद करते हैं।
      
      आप इनमें मदद कर सकते हैं:
      - सरकारी योजनाओं के बारे में जानकारी
      - पात्रता मानदंड समझाना
      - आवेदन प्रक्रिया बताना
      - आवश्यक दस्तावेजों की सूची
      - आवेदन की समय सीमा
      
      हमेशा हिंदी में जवाब दें और सहायक रहें। जवाब संक्षिप्त और स्पष्ट रखें।
      
      महत्वपूर्ण: केवल सरकारी योजनाओं के बारे में ही बात करें। अन्य विषयों पर न जाएं।`
      : `You are the Jan-Mitra AI assistant. You help users with information about Indian government schemes, scholarships, welfare programs, and subsidies.
      
      You can help with:
      - Information about government schemes like PM Kisan, PMAY, scholarships
      - Explaining eligibility criteria
      - Application process guidance
      - Required documents list
      - Application deadlines
      
      Always be helpful, accurate, and provide actionable information about government schemes. Keep responses concise and clear.
      
      Important: Only discuss government schemes and related topics. Stay on topic and do not engage with off-topic requests.`;

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
          ...sanitizedMessages
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: 'Service busy. Please try again later.', code: 'RATE_LIMITED' }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: 'Service temporarily unavailable.', code: 'SERVICE_ERROR' }), {
          status: 503,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      return new Response(JSON.stringify({ error: 'Service temporarily unavailable', code: 'SERVICE_ERROR' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const data = await response.json();
    const generatedText = data.choices[0].message.content;

    console.log('Generated response successfully for user:', user.id);

    return new Response(JSON.stringify({ response: generatedText }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in chat function:', error);
    return new Response(JSON.stringify({ error: 'An unexpected error occurred', code: 'INTERNAL_ERROR' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
