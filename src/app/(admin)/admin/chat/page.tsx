"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { useSocket } from "@/hooks/useSocket"
import { chatService } from "@/services/chat"
import type { ChatMessage, ChatConversation } from "@/types/chat"
import { Search, Send, CheckCheck, Loader2, XCircle, MessageCircle } from "lucide-react"
import { useAuthStore } from "@/store/authStore"
import { logger } from "@/lib/logger"
import {
    SOCKET_EVENTS,
    parsePayload,
    chatMessagePayloadSchema,
    chatClosePayloadSchema,
} from "@/socket"

export default function AdminChatPage() {
    const { user } = useAuthStore()
    const { socket } = useSocket()

    const [conversations, setConversations] = useState<ChatConversation[]>([])
    const [selectedId, setSelectedId] = useState<string | null>(null)
    const [messages, setMessages] = useState<ChatMessage[]>([])
    const [input, setInput] = useState("")
    const [loading, setLoading] = useState(false)
    const [initialLoading, setInitialLoading] = useState(true)

    const messagesEndRef = useRef<HTMLDivElement>(null)

    const loadConversations = useCallback(async () => {
        try {
            const r = await chatService.getConversations(1, 50)
            setConversations(r.data.conversations)
        } catch (e) {
            logger.error(e)
        } finally {
            setInitialLoading(false)
        }
    }, [])

    useEffect(() => { loadConversations() }, [loadConversations])

    useEffect(() => {
        if (!selectedId) return

        const loadMessages = async () => {
            setLoading(true)
            try {
                const r = await chatService.getMessages(selectedId)
                setMessages(r.data.messages)
                await chatService.markAsRead(selectedId)
            } catch (e) {
                logger.error(e)
            } finally {
                setLoading(false)
            }
        }
        loadMessages()
    }, [selectedId])

    useEffect(() => {
        if (selectedId && !loading) {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
        }
    }, [messages, selectedId, loading])

    useEffect(() => {
        if (!socket) return

        const handleNewMessage = (raw: unknown) => {
            const data = parsePayload(chatMessagePayloadSchema, raw, SOCKET_EVENTS.CHAT_NEW_MESSAGE)
            if (!data) return

            if (data.conversationId === selectedId) {
                setMessages((prev) => [...prev, data.message as ChatMessage])
                if (user?.role === "admin" && data.message.senderRole === "user") {
                    chatService.markAsRead(data.conversationId).catch(() => { })
                }
            }

            setConversations((prev) => {
                const existing = prev.find(c => c._id === data.conversationId)
                if (existing) {
                    const updated = { ...existing, lastMessage: data.message.content, lastMessageAt: data.message.createdAt, isClosed: false }
                    return [updated, ...prev.filter(c => c._id !== data.conversationId)]
                } else {
                    loadConversations()
                    return prev
                }
            })
        }

        const handleClose = (raw: unknown) => {
            const data = parsePayload(chatClosePayloadSchema, raw, SOCKET_EVENTS.CHAT_CLOSED)
            if (!data) return
            setConversations(prev => prev.map(c => c._id === data.conversationId ? { ...c, isClosed: true } : c))
        }

        socket.on(SOCKET_EVENTS.CHAT_NEW_MESSAGE, handleNewMessage)
        socket.on(SOCKET_EVENTS.CHAT_CLOSED, handleClose)

        return () => {
            socket.off(SOCKET_EVENTS.CHAT_NEW_MESSAGE, handleNewMessage)
            socket.off(SOCKET_EVENTS.CHAT_CLOSED, handleClose)
        }
    }, [socket, selectedId, loadConversations, user])

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!input.trim() || !selectedId) return

        const content = input.trim()
        setInput("")

        try {
            const r = await chatService.sendMessage(selectedId, { content })
            setMessages((prev) => [...prev, r.data])
            setConversations(prev => {
                const c = prev.find(x => x._id === selectedId)
                if (!c) return prev
                return [{ ...c, lastMessage: content, lastMessageAt: new Date().toISOString() }, ...prev.filter(x => x._id !== selectedId)]
            })
        } catch (e) {
            logger.error(e)
        }
    }

    const handleCloseChat = async () => {
        if (!selectedId || !confirm("Close this conversation?")) return
        try {
            await chatService.closeConversation(selectedId)
            setConversations(prev => prev.map(c => c._id === selectedId ? { ...c, isClosed: true } : c))
        } catch { }
    }

    const activeConversation = conversations.find(c => c._id === selectedId)

    return (
        <div className="h-[calc(100vh-100px)] flex gap-6">
            <div className="w-80 flex flex-col bg-white dark:bg-gray-900 rounded-2xl border border-border-light dark:border-border-dark overflow-hidden">
                <div className="p-4 border-b border-border-light dark:border-border-dark">
                    <h2 className="font-bold text-lg text-text-primary-light dark:text-text-primary-dark">Messages</h2>
                    <div className="mt-2 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary-light dark:text-text-tertiary-dark" size={16} />
                        <input placeholder="Search users..." className="w-full bg-gray-50 dark:bg-gray-800 rounded-xl pl-9 pr-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary-500/30 text-text-primary-light dark:text-text-primary-dark" />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto">
                    {initialLoading ? (
                        <div className="flex justify-center p-4"><Loader2 className="animate-spin text-primary-500" /></div>
                    ) : conversations.length === 0 ? (
                        <p className="text-center p-4 text-text-secondary-light dark:text-text-secondary-dark text-sm">No conversations</p>
                    ) : (
                        conversations.map(c => (
                            <button
                                key={c._id}
                                onClick={() => setSelectedId(c._id)}
                                className={`w-full text-left p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors border-b border-border-light dark:border-border-dark last:border-0 ${selectedId === c._id ? "bg-primary-50 dark:bg-primary-900/10 border-l-4 border-l-primary-600" : ""}`}
                            >
                                <div className="flex justify-between items-start mb-1">
                                    <span className="font-semibold text-sm text-text-primary-light dark:text-text-primary-dark truncate">{c.user?.fullName || c.user?.email || "Unknown User"}</span>
                                    <span className="text-[10px] text-text-tertiary-light dark:text-text-tertiary-dark whitespace-nowrap ml-2">
                                        {new Date(c.lastMessageAt).toLocaleDateString()}
                                    </span>
                                </div>
                                <p className={`text-xs truncate ${false ? "font-bold text-text-primary-light dark:text-text-primary-dark" : "text-text-secondary-light dark:text-text-secondary-dark"}`}>
                                    {c.lastMessage}
                                </p>
                                {c.isClosed && <span className="inline-block mt-1 px-1.5 py-0.5 bg-gray-200 dark:bg-gray-700 rounded text-[10px] text-text-secondary-light dark:text-text-secondary-dark">Closed</span>}
                            </button>
                        ))
                    )}
                </div>
            </div>

            <div className="flex-1 bg-white dark:bg-gray-900 rounded-2xl border border-border-light dark:border-border-dark flex flex-col overflow-hidden">
                {selectedId ? (
                    <>
                        <div className="p-4 border-b border-border-light dark:border-border-dark flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/50">
                            <div>
                                <h3 className="font-bold text-text-primary-light dark:text-text-primary-dark">{activeConversation?.user?.fullName}</h3>
                                <p className="text-xs text-text-secondary-light dark:text-text-secondary-dark">{activeConversation?.user?.email}</p>
                            </div>
                            <div className="flex gap-2">
                                {!activeConversation?.isClosed && (
                                    <button onClick={handleCloseChat} className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-red-200 text-red-600 text-xs hover:bg-red-50 transition-colors">
                                        <XCircle size={14} /> Close Chat
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {loading ? (
                                <div className="flex justify-center mt-10"><Loader2 className="animate-spin text-primary-500" /></div>
                            ) : (
                                messages.map(msg => (
                                    <div key={msg._id} className={`flex ${msg.senderRole === "admin" ? "justify-end" : "justify-start"}`}>
                                        <div className={`max-w-[70%] rounded-2xl px-4 py-3 text-sm ${msg.senderRole === "admin"
                                            ? "bg-primary-600 text-white rounded-br-none"
                                            : "bg-gray-100 dark:bg-gray-800 text-text-primary-light dark:text-text-primary-dark rounded-bl-none"
                                            }`}>
                                            {msg.content}
                                            <div className={`flex items-center justify-end gap-1 mt-1 text-[10px] ${msg.senderRole === "admin" ? "text-primary-100" : "text-text-tertiary-light dark:text-text-tertiary-dark"}`}>
                                                <span>{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                {msg.senderRole === "admin" && msg.isRead && <CheckCheck size={12} />}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                            {activeConversation?.isClosed && (
                                <div className="text-center my-4">
                                    <span className="bg-gray-100 dark:bg-gray-800 text-text-secondary-light dark:text-text-secondary-dark px-3 py-1 rounded-full text-xs">
                                        This conversation is closed
                                    </span>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        <form onSubmit={handleSend} className="p-4 border-t border-border-light dark:border-border-dark flex gap-3">
                            <input
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                disabled={activeConversation?.isClosed || loading}
                                placeholder="Type your reply..."
                                className="flex-1 rounded-xl border border-border-light dark:border-border-dark bg-transparent px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary-500/30 text-text-primary-light dark:text-text-primary-dark disabled:opacity-50"
                            />
                            <button
                                type="submit"
                                disabled={!input.trim() || activeConversation?.isClosed}
                                className="bg-primary-600 text-white p-2.5 rounded-xl hover:bg-primary-700 disabled:opacity-50 transition-colors shadow-sm"
                            >
                                <Send size={20} />
                            </button>
                        </form>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-text-secondary-light dark:text-text-secondary-dark">
                        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                            <MessageCircle className="w-8 h-8 opacity-50" />
                        </div>
                        <p>Select a conversation to start chatting</p>
                    </div>
                )}
            </div>
        </div>
    )
}
