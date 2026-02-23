"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { isCanceledError } from "@/utils/isCancel"
import { chatService } from "@/services/chat"
import type { ChatConversation, ChatMessage } from "@/types/chat"
import type { PaginationMeta } from "@/types/api"

export function useAdminConversations() {
    const [conversations, setConversations] = useState<ChatConversation[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetchConversations = useCallback(async (page = 1, limit = 50, signal?: AbortSignal) => {
        setIsLoading(true)
        setError(null)
        try {
            const result = await chatService.getConversations(page, limit, signal)
            setConversations(result.data.conversations)
        } catch (err) {
            if (isCanceledError(err)) return
            setError(err instanceof Error ? err.message : "Failed to load conversations")
        } finally {
            setIsLoading(false)
        }
    }, [])

    useEffect(() => {
        const controller = new AbortController()
        fetchConversations(1, 50, controller.signal)
        return () => controller.abort()
    }, [fetchConversations])

    return { conversations, setConversations, isLoading, error, refetch: fetchConversations }
}

export function useAdminMessages(conversationId: string | null) {
    const [messages, setMessages] = useState<ChatMessage[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (!conversationId) {
            setMessages([])
            return
        }

        const controller = new AbortController()

        const load = async () => {
            setIsLoading(true)
            setError(null)
            try {
                const result = await chatService.getMessages(conversationId, 1, 50, controller.signal)
                if (!controller.signal.aborted) {
                    setMessages(result.data.messages)
                }
                await chatService.markAsRead(conversationId, controller.signal)
            } catch (err) {
                if (isCanceledError(err)) return
                if (!controller.signal.aborted) {
                    setError(err instanceof Error ? err.message : "Failed to load messages")
                }
            } finally {
                if (!controller.signal.aborted) {
                    setIsLoading(false)
                }
            }
        }

        load()
        return () => controller.abort()
    }, [conversationId])

    return { messages, setMessages, isLoading, error }
}

export function useAdminSendMessage() {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const abortRef = useRef<AbortController | null>(null)

    useEffect(() => {
        return () => { abortRef.current?.abort() }
    }, [])

    const sendMessage = useCallback(async (conversationId: string, content: string) => {
        abortRef.current?.abort()
        abortRef.current = new AbortController()
        setIsLoading(true)
        setError(null)
        try {
            const result = await chatService.sendMessage(conversationId, { content }, abortRef.current.signal)
            return result.data
        } catch (err) {
            if (isCanceledError(err)) return null
            setError(err instanceof Error ? err.message : "Failed to send message")
            return null
        } finally {
            setIsLoading(false)
        }
    }, [])

    const closeConversation = useCallback(async (conversationId: string) => {
        abortRef.current?.abort()
        abortRef.current = new AbortController()
        setIsLoading(true)
        setError(null)
        try {
            await chatService.closeConversation(conversationId, abortRef.current.signal)
            return true
        } catch (err) {
            if (isCanceledError(err)) return false
            setError(err instanceof Error ? err.message : "Failed to close conversation")
            return false
        } finally {
            setIsLoading(false)
        }
    }, [])

    return { sendMessage, closeConversation, isLoading, error }
}
