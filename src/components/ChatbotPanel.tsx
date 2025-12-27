import { useState, useRef, useEffect } from "react";
import { useApp } from "@/context/AppContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Send, Mic, MicOff, Bot, User, Volume2 } from "lucide-react";

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
  const { t, language } = useApp();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: language === "hi" 
        ? "नमस्ते! मैं जन-मित्र AI सहायक हूं। सरकारी योजनाओं के बारे में कुछ भी पूछें।"
        : "Hello! I'm your Jan-Mitra AI assistant. Ask me anything about government schemes.",
      isBot: true,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const generateBotResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes("scholarship") || lowerMessage.includes("छात्रवृत्ति")) {
      return language === "hi"
        ? "आपकी प्रोफ़ाइल के आधार पर, आप पोस्ट मैट्रिक छात्रवृत्ति और राष्ट्रीय साधन-सह-मेधा छात्रवृत्ति के लिए पात्र हैं। क्या आप इनके बारे में अधिक जानना चाहेंगे?"
        : "Based on your profile, you may be eligible for Post Matric Scholarship and National Means-cum-Merit Scholarship. Would you like to know more about these?";
    }
    
    if (lowerMessage.includes("document") || lowerMessage.includes("दस्तावेज")) {
      return language === "hi"
        ? "अधिकांश योजनाओं के लिए आपको आधार कार्ड, आय प्रमाण पत्र, जाति प्रमाण पत्र और बैंक पासबुक की आवश्यकता होगी। क्या आप किसी विशेष योजना के दस्तावेज़ जानना चाहते हैं?"
        : "For most schemes, you'll need Aadhaar Card, Income Certificate, Caste Certificate, and Bank Passbook. Would you like to know documents for a specific scheme?";
    }
    
    if (lowerMessage.includes("deadline") || lowerMessage.includes("समय सीमा") || lowerMessage.includes("last date")) {
      return language === "hi"
        ? "⚠️ प्री-मैट्रिक छात्रवृत्ति की अंतिम तिथि 20 जनवरी है - केवल 24 दिन बाकी! राष्ट्रीय साधन-सह-मेधा छात्रवृत्ति 15 फरवरी तक है।"
        : "⚠️ Pre-Matric Scholarship deadline is January 20 - only 24 days left! National Means-cum-Merit Scholarship is due February 15.";
    }
    
    if (lowerMessage.includes("how to apply") || lowerMessage.includes("कैसे आवेदन करें")) {
      return language === "hi"
        ? "आवेदन करने के लिए: 1) योजना चुनें 2) 'अभी आवेदन करें' पर क्लिक करें 3) दस्तावेज़ अपलोड करें 4) फॉर्म भरें। मैं हर कदम पर आपकी मदद करूंगा!"
        : "To apply: 1) Select a scheme 2) Click 'Apply Now' 3) Upload documents 4) Fill the form. I'll guide you through every step!";
    }
    
    return language === "hi"
      ? "मैं आपकी मदद के लिए यहां हूं। कृपया योजनाओं, पात्रता, दस्तावेज़ों, या आवेदन प्रक्रिया के बारे में पूछें।"
      : "I'm here to help you. Please ask about schemes, eligibility, documents, or application process.";
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      isBot: false,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Simulate AI response delay
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: generateBotResponse(input),
        isBot: true,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000);
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
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language === "hi" ? "hi-IN" : "en-IN";
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
              {language === "hi" ? "आपका AI मित्र" : "Your AI Friend"}
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
                <p className="text-sm">{message.text}</p>
              </div>
              {message.isBot && (
                <button
                  onClick={() => speakMessage(message.text)}
                  className="mt-1 p-1 text-muted-foreground hover:text-primary transition-colors"
                >
                  <Volume2 className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <Bot className="h-4 w-4 text-primary" />
            </div>
            <div className="bg-muted rounded-2xl rounded-tl-none px-4 py-3">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
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
          >
            {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
          </Button>
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
            placeholder={t("askQuestion")}
            className="flex-1"
          />
          <Button onClick={handleSend} disabled={!input.trim()}>
            <Send className="h-5 w-5" />
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
