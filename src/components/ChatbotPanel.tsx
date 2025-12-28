import { useState, useRef, useEffect } from "react";
import { useApp } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Send, Mic, MicOff, Bot, User, Volume2, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

interface ChatbotPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ChatbotPanel({ isOpen, onClose }: ChatbotPanelProps) {
  const { t, language, session, isAuthenticated } = useApp();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: language === "hi" 
        ? "नमस्ते! मैं जन-मित्र AI सहायक हूं। सरकारी योजनाओं के बारे में कुछ भी पूछें।"
        : "Hello! I'm your Jan-Mitra AI assistant powered by ChatGPT. Ask me anything about government schemes.",
      isBot: true,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    // Check authentication before sending
    if (!isAuthenticated || !session) {
      const authMessage: Message = {
        id: Date.now().toString(),
        text: language === "hi"
          ? "कृपया चैट का उपयोग करने के लिए पहले लॉगिन करें।"
          : "Please login first to use the chat feature.",
        isBot: true,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, authMessage]);
      return;
    }

    // Validate input length (max 2000 characters)
    if (input.length > 2000) {
      const lengthMessage: Message = {
        id: Date.now().toString(),
        text: language === "hi"
          ? "संदेश बहुत लंबा है। कृपया 2000 अक्षरों से कम में लिखें।"
          : "Message too long. Please keep it under 2000 characters.",
        isBot: true,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, lengthMessage]);
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      isBot: false,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    const userInput = input;
    setInput("");
    setIsLoading(true);

    try {
      // Build conversation history for context
      const conversationHistory = messages.map(msg => ({
        role: msg.isBot ? "assistant" : "user",
        content: msg.text
      }));
      conversationHistory.push({ role: "user", content: userInput });

      const { data, error } = await supabase.functions.invoke('chat', {
        body: { 
          messages: conversationHistory,
          language: language
        }
      });

      if (error) {
        console.error('Chat function error:', error);
        throw error;
      }

      if (data?.error) {
        // Handle specific error messages
        if (data.error.includes('Authentication') || data.error.includes('token')) {
          const authErrorMessage: Message = {
            id: (Date.now() + 1).toString(),
            text: language === "hi"
              ? "आपका सत्र समाप्त हो गया है। कृपया पुनः लॉगिन करें।"
              : "Your session has expired. Please login again.",
            isBot: true,
            timestamp: new Date(),
          };
          setMessages(prev => [...prev, authErrorMessage]);
          return;
        }
        throw new Error(data.error);
      }

      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: data.response || (language === "hi" 
          ? "क्षमा करें, मुझे जवाब देने में समस्या हुई। कृपया पुनः प्रयास करें।"
          : "Sorry, I had trouble responding. Please try again."),
        isBot: true,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botResponse]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: language === "hi"
          ? "क्षमा करें, कुछ गड़बड़ हो गई। कृपया बाद में पुनः प्रयास करें।"
          : "Sorry, something went wrong. Please try again later.",
        isBot: true,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleVoiceInput = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.lang = language === "hi" ? "hi-IN" : "en-IN";
      
      if (!isListening) {
        recognition.start();
        setIsListening(true);
        
        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setInput(transcript);
          setIsListening(false);
        };
        
        recognition.onerror = () => {
          setIsListening(false);
        };
        
        recognition.onend = () => {
          setIsListening(false);
        };
      }
    }
  };

  const speakMessage = (text: string) => {
    if ('speechSynthesis' in window) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language === "hi" ? "hi-IN" : "en-IN";
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 lg:inset-auto lg:right-6 lg:bottom-24 lg:w-96 lg:h-[600px] bg-card lg:rounded-2xl shadow-2xl z-50 flex flex-col border border-border animate-slide-in-bottom lg:animate-slide-in-right">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-primary text-primary-foreground lg:rounded-t-2xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary-foreground/20 flex items-center justify-center">
            <Bot className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-semibold">{t("chatbot")}</h3>
            <p className="text-xs opacity-80">
              {language === "hi" ? "ChatGPT द्वारा संचालित" : "Powered by ChatGPT"}
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="text-primary-foreground hover:bg-primary-foreground/20"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      {/* Auth warning if not logged in */}
      {!isAuthenticated && (
        <div className="px-4 py-2 bg-yellow-50 border-b border-yellow-200 text-yellow-800 text-sm">
          {language === "hi" 
            ? "चैट का उपयोग करने के लिए कृपया लॉगिन करें"
            : "Please login to use the chat feature"}
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${message.isBot ? "" : "flex-row-reverse"}`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
              message.isBot ? "bg-primary/10" : "bg-secondary/10"
            }`}>
              {message.isBot ? (
                <Bot className="h-4 w-4 text-primary" />
              ) : (
                <User className="h-4 w-4 text-secondary" />
              )}
            </div>
            <div className={`max-w-[75%] ${message.isBot ? "" : "text-right"}`}>
              <div className={`rounded-2xl px-4 py-3 ${
                message.isBot 
                  ? "bg-muted rounded-tl-none" 
                  : "bg-primary text-primary-foreground rounded-tr-none"
              }`}>
                <p className="text-sm whitespace-pre-wrap">{message.text}</p>
              </div>
              {message.isBot && (
                <button
                  onClick={() => speakMessage(message.text)}
                  className="mt-1 p-1 text-muted-foreground hover:text-primary transition-colors"
                  title={language === "hi" ? "बोलें" : "Speak"}
                >
                  <Volume2 className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <Bot className="h-4 w-4 text-primary" />
            </div>
            <div className="bg-muted rounded-2xl rounded-tl-none px-4 py-3">
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
                <span className="text-sm text-muted-foreground">
                  {language === "hi" ? "सोच रहा हूं..." : "Thinking..."}
                </span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-border">
        <div className="flex gap-2">
          <Button
            variant={isListening ? "destructive" : "outline"}
            size="icon"
            onClick={toggleVoiceInput}
            className="flex-shrink-0"
            title={language === "hi" ? "आवाज से बोलें" : "Voice input"}
            disabled={!isAuthenticated}
          >
            {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
          </Button>
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
            placeholder={t("askQuestion")}
            className="flex-1"
            disabled={isLoading || !isAuthenticated}
          />
          <Button onClick={handleSend} disabled={!input.trim() || isLoading || !isAuthenticated}>
            {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
          </Button>
        </div>
        {isListening && (
          <p className="text-xs text-center text-primary mt-2 animate-pulse">
            {language === "hi" ? "🎤 सुन रहा हूं..." : "🎤 Listening..."}
          </p>
        )}
      </div>
    </div>
  );
}
