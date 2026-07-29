import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Send, CheckCheck, Phone, ShieldCheck, Image, Smile } from 'lucide-react';
import { ServiceProvider, ChatMessage } from '../types';

interface ChatScreenProps {
  provider: ServiceProvider;
  initialMessages: ChatMessage[];
  onBack: () => void;
}

export const ChatScreen: React.FC<ChatScreenProps> = ({
  provider,
  initialMessages,
  onBack,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = (textToSend?: string) => {
    const text = textToSend || inputMessage;
    if (!text.trim()) return;

    const newMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      senderId: 'cust_01',
      senderName: 'You',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMe: true,
      status: 'sent',
    };

    setMessages((prev) => [...prev, newMsg]);
    if (!textToSend) setInputMessage('');

    // Update status to delivered then read
    setTimeout(() => {
      setMessages((prev) =>
        prev.map((m) => (m.id === newMsg.id ? { ...m, status: 'delivered' } : m))
      );
    }, 800);

    setTimeout(() => {
      setMessages((prev) =>
        prev.map((m) => (m.id === newMsg.id ? { ...m, status: 'read' } : m))
      );
      setIsTyping(true);
    }, 1600);

    // Provider automated response
    setTimeout(() => {
      setIsTyping(false);
      const replyMsg: ChatMessage = {
        id: `msg_${Date.now() + 1}`,
        senderId: provider.id,
        senderName: provider.name,
        text: `Got it! I am just 2 minutes away. I have all the spare parts ready.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isMe: false,
        status: 'read',
      };
      setMessages((prev) => [...prev, replyMsg]);
      
      import('../utils/notifications').then(({ sendPushNotification }) => {
        sendPushNotification(`New message from ${provider.name}`, { body: replyMsg.text });
      });
    }, 3600);
  };

  return (
    <div className="min-h-screen bg-[#F6F8FB] dark:bg-[#070B14] flex flex-col justify-between max-w-md mx-auto relative font-sans transition-colors">
      {/* Top Floating Glass Header */}
      <div className="p-4 bg-white/90 dark:bg-[#131E33]/90 backdrop-blur-md border-b border-slate-100 dark:border-white/[0.06] flex items-center justify-between sticky top-0 z-30 card-shadow">
        <div className="flex items-center space-x-3">
          <button
            onClick={onBack}
            className="w-10 h-10 bg-slate-50 dark:bg-[#17243C] rounded-full flex items-center justify-center text-slate-700 dark:text-[#B8C3D9] hover:bg-slate-100 dark:hover:bg-[#17243C]/80 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div className="relative">
            <img
              src={provider.avatarUrl}
              alt={provider.name}
              referrerPolicy="no-referrer"
              className="w-11 h-11 rounded-2xl object-cover"
            />
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white dark:border-[#131E33]" />
          </div>

          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white text-sm">{provider.name}</h3>
            <p className="text-[11px] text-emerald-600 dark:text-[#2DD36F] font-medium">Online • {provider.category} Pro</p>
          </div>
        </div>

        <a
          href={`tel:${provider.phone}`}
          className="w-10 h-10 bg-[#27C2D4]/10 dark:bg-[#21C7F6]/20 text-[#27C2D4] dark:text-[#21C7F6] rounded-full flex items-center justify-center hover:bg-[#27C2D4]/20 transition-colors"
        >
          <Phone className="w-5 h-5" />
        </a>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3 pb-36">
        <div className="text-center my-2">
          <span className="text-[10px] uppercase font-semibold text-slate-400 dark:text-[#7F8DA8] bg-slate-200/50 dark:bg-[#17243C] px-3 py-1 rounded-full">
            Encrypted Direct Line
          </span>
        </div>

        {messages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className={`flex flex-col ${msg.isMe ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-[80%] p-3.5 rounded-[22px] text-xs leading-relaxed shadow-sm ${
                msg.isMe
                  ? 'bg-gradient-to-r from-[#27C2D4] to-[#3F73C7] dark:from-[#21C7F6] dark:to-[#4D5DFA] text-white rounded-br-sm'
                  : 'bg-white dark:bg-[#131E33] text-slate-800 dark:text-white card-shadow rounded-bl-sm border border-slate-100 dark:border-white/[0.06]'
              }`}
            >
              <p>{msg.text}</p>
              <div
                className={`flex items-center justify-end space-x-1 mt-1 text-[9px] ${
                  msg.isMe ? 'text-cyan-100' : 'text-slate-400 dark:text-[#7F8DA8]'
                }`}
              >
                <span>{msg.timestamp}</span>
                {msg.isMe && (
                  <CheckCheck
                    className={`w-3.5 h-3.5 ${
                      msg.status === 'read' ? 'text-cyan-200' : 'text-cyan-100/60'
                    }`}
                  />
                )}
              </div>
            </div>
          </motion.div>
        ))}

        {/* Typing indicator */}
        <AnimatePresence>
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-center space-x-2 bg-white dark:bg-[#131E33] p-3 rounded-[20px] w-24 card-shadow border border-slate-100 dark:border-white/[0.06]"
            >
              <div className="w-2 h-2 bg-[#27C2D4] dark:bg-[#21C7F6] rounded-full animate-bounce" />
              <div className="w-2 h-2 bg-[#3F73C7] dark:bg-[#4D5DFA] rounded-full animate-bounce [animation-delay:0.2s]" />
              <div className="w-2 h-2 bg-[#4340A8] dark:bg-[#21C7F6] rounded-full animate-bounce [animation-delay:0.4s]" />
            </motion.div>
          )}
        </AnimatePresence>

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Reply Pills */}
      <div className="px-4 py-2 bg-white/80 dark:bg-[#0E1628]/80 backdrop-blur-md border-t border-slate-100 dark:border-white/[0.06] fixed bottom-20 left-0 right-0 max-w-md mx-auto flex items-center space-x-2 overflow-x-auto no-scrollbar z-20">
        {['Please ring doorbell', "I'm at the location", 'Bring extra sockets', 'Parking available'].map((pill) => (
          <button
            key={pill}
            onClick={() => handleSend(pill)}
            className="px-3 py-1.5 bg-slate-100 dark:bg-[#17243C] hover:bg-[#27C2D4]/10 dark:hover:bg-[#21C7F6]/20 text-slate-600 dark:text-[#B8C3D9] hover:text-[#27C2D4] dark:hover:text-[#21C7F6] rounded-full text-xs font-medium shrink-0 transition-colors"
          >
            {pill}
          </button>
        ))}
      </div>

      {/* Floating Composer Bar */}
      <div className="p-4 bg-white dark:bg-[#131E33] border-t border-slate-100 dark:border-white/[0.06] fixed bottom-0 left-0 right-0 max-w-md mx-auto z-30">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center space-x-2"
        >
          <div className="flex-1 bg-slate-50 dark:bg-[#0E1628] border border-slate-200/60 dark:border-white/[0.06] rounded-[24px] px-4 py-2.5 flex items-center space-x-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Type a message..."
              className="w-full text-xs text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-[#7F8DA8] bg-transparent focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={!inputMessage.trim()}
            className="w-11 h-11 bg-gradient-to-tr from-[#27C2D4] to-[#3F73C7] dark:from-[#21C7F6] dark:to-[#4D5DFA] text-white rounded-full flex items-center justify-center float-shadow disabled:opacity-40 transition-all active:scale-95"
          >
            <Send className="w-5 h-5 text-white dark:text-[#070B14]" />
          </button>
        </form>
      </div>
    </div>
  );
};
