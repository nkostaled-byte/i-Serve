import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, Headset, Search, ChevronRight, CheckCheck, Send, Zap } from 'lucide-react';
import { ChatMessage, AppScreen } from '../types';

interface ProviderMessagesProps {
  onOpenChat: (customerName: string) => void;
}

interface ConversationThread {
  id: string;
  customerName: string;
  avatarUrl: string;
  category: string;
  lastMessage: string;
  time: string;
  unreadCount: number;
  isSupport?: boolean;
}

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.24,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.45,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

export const ProviderMessages: React.FC<ProviderMessagesProps> = ({ onOpenChat }) => {
  const [activeTab, setActiveTab] = useState<'customers' | 'support'>('customers');
  const [searchQuery, setSearchQuery] = useState('');
  const [animatedIds, setAnimatedIds] = useState<Record<string, boolean>>({});

  const customerThreads: ConversationThread[] = [
    {
      id: 'thread_1',
      customerName: 'Sarah Jenkins',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
      category: 'Electrical Wiring',
      lastMessage: 'Hi! Are you still arriving around 2:30 PM?',
      time: '12m ago',
      unreadCount: 2,
    },
    {
      id: 'thread_2',
      customerName: 'David Miller',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
      category: 'Plumbing Emergency',
      lastMessage: 'Thanks for turning off the main valve! Kitchen floor is dry.',
      time: '1h ago',
      unreadCount: 0,
    },
    {
      id: 'thread_3',
      customerName: 'Elena Rostova',
      avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=200',
      category: 'AC Servicing',
      lastMessage: 'Left a 5-star review! Appreciate the speedy service.',
      time: 'Yesterday',
      unreadCount: 0,
    }
  ];

  const supportThreads: ConversationThread[] = [
    {
      id: 'supp_1',
      customerName: 'i-Serve Partner Support',
      avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200',
      category: 'Payout & Wallet Help',
      lastMessage: 'Your weekly payout of $1,280.00 has been transferred to your bank account.',
      time: '2h ago',
      unreadCount: 1,
      isSupport: true,
    },
    {
      id: 'supp_2',
      customerName: 'Dispatch Safety Desk',
      avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=200',
      category: 'Verification Desk',
      lastMessage: 'Your electrician license document was re-verified successfully.',
      time: '3 days ago',
      unreadCount: 0,
      isSupport: true,
    }
  ];

  const threads = activeTab === 'customers' ? customerThreads : supportThreads;

  const filteredThreads = threads.filter(
    (t) =>
      t.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="pb-28 pt-[calc(env(safe-area-inset-top)+1rem)] px-4 max-w-md mx-auto space-y-5 font-sans">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1], delay: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#3F73C7] dark:text-[#21C7F6]">
            Communication
          </span>
          <h1 className="text-2xl font-serif font-normal text-slate-900 dark:text-white">
            Messages & Support
          </h1>
        </div>
        <div className="w-10 h-10 rounded-2xl bg-[#3F73C7]/10 dark:bg-[#21C7F6]/20 flex items-center justify-center text-[#3F73C7] dark:text-[#21C7F6]">
          <MessageSquare className="w-5 h-5" />
        </div>
      </motion.div>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1], delay: 0.06 }}
        className="flex bg-slate-100 dark:bg-[#131E33] p-1 rounded-2xl text-xs font-semibold border border-transparent dark:border-white/[0.06]"
      >
        <button
          onClick={() => setActiveTab('customers')}
          className={`flex-1 py-2.5 rounded-xl transition-all flex items-center justify-center space-x-2 ${
            activeTab === 'customers'
              ? 'bg-white dark:bg-[#1E2E4A] text-slate-900 dark:text-white shadow-sm'
              : 'text-slate-500 dark:text-[#7F8DA8] hover:text-slate-800 dark:hover:text-white'
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Customer Chats</span>
        </button>

        <button
          onClick={() => setActiveTab('support')}
          className={`flex-1 py-2.5 rounded-xl transition-all flex items-center justify-center space-x-2 ${
            activeTab === 'support'
              ? 'bg-white dark:bg-[#1E2E4A] text-slate-900 dark:text-white shadow-sm'
              : 'text-slate-500 dark:text-[#7F8DA8] hover:text-slate-800 dark:hover:text-white'
          }`}
        >
          <Headset className="w-3.5 h-3.5" />
          <span>Partner Support</span>
          <span className="w-2 h-2 rounded-full bg-cyan-500 dark:bg-[#21C7F6]" />
        </button>
      </motion.div>

      {/* Search Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1], delay: 0.12 }}
        className="relative"
      >
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-[#7F8DA8]" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={`Search ${activeTab === 'customers' ? 'customer' : 'support topic'}...`}
          className="w-full bg-white dark:bg-[#131E33] pl-10 pr-4 py-2.5 rounded-2xl text-xs text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-[#7F8DA8] border border-slate-200/80 dark:border-white/[0.06] focus:outline-none focus:ring-2 focus:ring-[#3F73C7]/20 dark:focus:ring-[#21C7F6]/20 transition-all shadow-sm"
        />
      </motion.div>

      {/* Thread List */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-2.5"
      >
        {filteredThreads.map((thread) => (
          <motion.div
            key={thread.id}
            variants={itemVariants}
            onClick={() => onOpenChat(thread.customerName)}
            className="bg-white dark:bg-[#131E33] p-3.5 rounded-[24px] card-shadow border border-slate-100 dark:border-white/[0.06] flex items-center justify-between cursor-pointer transition-all hover:border-[#3F73C7]/30"
          >
            <div className="flex items-center space-x-3 min-w-0 pr-2">
              <div className="relative shrink-0">
                <img
                  src={thread.avatarUrl}
                  alt={thread.customerName}
                  referrerPolicy="no-referrer"
                  className="w-12 h-12 rounded-2xl object-cover border border-slate-100 dark:border-white/[0.06]"
                />
                {thread.unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#3F73C7] dark:bg-[#21C7F6] text-white dark:text-[#070B14] rounded-full text-[10px] font-bold flex items-center justify-center border-2 border-white dark:border-[#131E33] shadow-sm">
                    {thread.unreadCount}
                  </span>
                )}
              </div>

              <div className="min-w-0">
                <div className="flex items-center space-x-2">
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                    {thread.customerName}
                  </h3>
                  <span className="text-[9px] font-bold uppercase tracking-wider text-[#3F73C7] dark:text-[#21C7F6] bg-[#3F73C7]/10 dark:bg-[#21C7F6]/20 px-2.5 py-0.2 rounded-full shrink-0">
                    {thread.category}
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-[#B8C3D9] truncate mt-0.5">
                  {thread.lastMessage}
                </p>
              </div>
            </div>

            <div className="flex flex-col items-end shrink-0 space-y-1">
              <span className="text-[10px] text-slate-400 dark:text-[#7F8DA8] font-medium">
                {thread.time}
              </span>
              <ChevronRight className="w-4 h-4 text-slate-300 dark:text-[#7F8DA8]" />
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};
