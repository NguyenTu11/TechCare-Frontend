"use client"

import { useState, useEffect, useRef } from "react"
import { useSocket } from "@/hooks/useSocket"
import { useAuthStore } from "@/store/authStore"
import { chatService } from "@/services/chat"
import type { ChatMessage, ChatConversation } from "@/types/chat"
import { MessageCircle, X, Send, Minus } from "lucide-react"
import { logger } from "@/lib/logger"
import {
    SOCKET_EVENTS,
    parsePayload,
    chatMessagePayloadSchema,
    chatClosePayloadSchema,
} from "@/socket"

export default function CustomerChatWidget() {
    const { user } = useAuthStore()
    const { socket } = useSocket()
    const [isOpen, setIsOpen] = useState(false)
    const [conversation, setConversation] = useState<ChatConversation | null>(null)
    const [messages, setMessages] = useState<ChatMessage[]>([])
    const [input, setInput] = useState("")
    const [loading, setLoading] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (!user || user.role === "admin") return

        const loadConversation = async () => {
            try {
                const r = await chatService.getConversations(1, 1)
                if (r.data.conversations.length > 0) {
                    const conv = r.data.conversations[0]
                    setConversation(conv)
                    const msgRes = await chatService.getMessages(conv._id)
                    setMessages(msgRes.data.messages)
                }
            } catch (e) {
                logger.error("Failed to load conversation", e)
            }
        }
        loadConversation()
    }, [user])

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [messages, isOpen])

    useEffect(() => {
        if (!socket || !conversation) return

        const handleNewMessage = (raw: unknown) => {
            const data = parsePayload(chatMessagePayloadSchema, raw, SOCKET_EVENTS.CHAT_NEW_MESSAGE)
            if (!data) return
            if (data.conversationId === conversation._id) {
                setMessages((prev) => [...prev, data.message as ChatMessage])
            }
        }

        const handleClose = (raw: unknown) => {
            const data = parsePayload(chatClosePayloadSchema, raw, SOCKET_EVENTS.CHAT_CLOSED)
            if (!data) return
            if (data.conversationId === conversation._id) {
                setConversation(prev => prev ? { ...prev, isClosed: true } : null)
            }
        }

        socket.on(SOCKET_EVENTS.CHAT_NEW_MESSAGE, handleNewMessage)
        socket.on(SOCKET_EVENTS.CHAT_CLOSED, handleClose)

        return () => {
            socket.off(SOCKET_EVENTS.CHAT_NEW_MESSAGE, handleNewMessage)
            socket.off(SOCKET_EVENTS.CHAT_CLOSED, handleClose)
        }
    }, [socket, conversation])

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!input.trim()) return

        const content = input.trim()
        setInput("")

        try {
            if (!conversation) {
                const r = await chatService.startConversation({ message: content })
                setConversation(r.data.conversation)
                setMessages([r.data.message])
            } else {
                if (conversation.isClosed) return
                const r = await chatService.sendMessage(conversation._id, { content })
                setMessages((prev) => [...prev, r.data])
            }
        } catch (e) {
            logger.error("Failed to send message", e)
        }
    }

    if (!user || user.role === "admin") return null

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
            {isOpen && (
                <div className="mb-4 w-80 sm:w-96 h-96 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-border-light dark:border-border-dark flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 fade-in duration-200">
                    <div className="bg-primary-600 p-4 flex items-center justify-between text-white">
                        <div>
                            <h3 className="font-semibold">Support Chat</h3>
                            <p className="text-xs text-primary-100">{conversation?.isClosed ? "Ended" : "We usually reply in minutes"}</p>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="bg-white/10 hover:bg-white/20 p-1 rounded-full transition-colors">
                            <Minus size={16} />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-800/50">
                        {messages.length === 0 ? (
                            <p className="text-center text-sm text-text-secondary-light dark:text-text-secondary-dark mt-10">
                                Hi {user.fullName}! How can we help you today?
                            </p>
                        ) : (
                            messages.map((msg) => (
                                <div key={msg._id} className={`flex ${msg.sender === user._id ? "justify-end" : "justify-start"}`}>
                                    <div className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${msg.sender === user._id
                                            ? "bg-primary-600 text-white rounded-br-none"
                                            : "bg-white dark:bg-gray-800 border border-border-light dark:border-border-dark text-text-primary-light dark:text-text-primary-dark rounded-bl-none shadow-sm"
                                        }`}>
                                        {msg.content}
                                        <p className={`text-[10px] mt-1 ${msg.sender === user._id ? "text-primary-100" : "text-text-tertiary-light dark:text-text-tertiary-dark"}`}>
                                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                    </div>
                                </div>
                            ))
                        )}
                        {conversation?.isClosed && (
                            <div className="text-center text-xs text-text-secondary-light dark:text-text-secondary-dark py-2 border-t border-border-light dark:border-border-dark mt-4">
                                This conversation has ended.
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <form onSubmit={handleSend} className="p-3 bg-white dark:bg-gray-900 border-t border-border-light dark:border-border-dark flex gap-2">
                        <input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder={conversation?.isClosed ? "Conversation closed" : "Type a message..."}
                            disabled={loading || conversation?.isClosed}
                            className="flex-1 rounded-xl border border-border-light dark:border-border-dark bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary-500/30 text-text-primary-light dark:text-text-primary-dark disabled:opacity-50"
                        />
                        <button
                            type="submit"
                            disabled={!input.trim() || loading || conversation?.isClosed || false}
                            className="bg-primary-600 text-white p-2 rounded-xl hover:bg-primary-700 disabled:opacity-50 transition-colors"
                        >
                            <Send size={18} />
                        </button>
                    </form>
                </div>
            )}

            <button
                onClick={() => setIsOpen(!isOpen)}
                className="h-14 w-14 rounded-full bg-primary-600 text-white shadow-lg hover:bg-primary-700 hover:scale-105 transition-all flex items-center justify-center p-3"
            >
                {isOpen ? <X size={28} /> : <MessageCircle size={28} />}
            </button>
        </div>
    )
}
