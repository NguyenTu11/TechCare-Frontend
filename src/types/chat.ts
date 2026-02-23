export interface ChatMessage {
    _id: string
    conversation: string
    sender: string
    senderRole: "user" | "admin"
    content: string
    isRead: boolean
    createdAt: string
}

export interface ChatConversation {
    _id: string
    user: {
        _id: string
        fullName: string
        email: string
    }
    admin?: {
        _id: string
        fullName: string
    }
    lastMessage: string
    lastMessageAt: string
    isClosed: boolean
    unreadCount?: number
}
