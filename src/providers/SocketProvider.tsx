"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import type { Socket } from "socket.io-client"
import { useAuthStore } from "@/store/authStore"
import { logger } from "@/lib/logger"
import { createSocket, SOCKET_EVENTS } from "@/socket"

interface SocketContextType {
    socket: Socket | null
    isConnected: boolean
}

const SocketContext = createContext<SocketContextType>({
    socket: null,
    isConnected: false,
})

export const useSocket = () => useContext(SocketContext)

interface SocketProviderProps {
    children: ReactNode
}

export default function SocketProvider({ children }: SocketProviderProps) {
    const [socket, setSocket] = useState<Socket | null>(null)
    const [isConnected, setIsConnected] = useState(false)
    const { user, accessToken } = useAuthStore()

    useEffect(() => {
        if (!accessToken || !user) {
            if (socket) {
                socket.disconnect()
                setSocket(null)
                setIsConnected(false)
            }
            return
        }

        const socketInstance = createSocket(accessToken)

        socketInstance.on(SOCKET_EVENTS.CONNECT, () => {
            logger.info("Socket connected", { socketId: socketInstance.id })
            setIsConnected(true)

            if (user.role === "admin") {
                socketInstance.emit(SOCKET_EVENTS.JOIN_ADMIN)
            }
            socketInstance.emit(SOCKET_EVENTS.JOIN_USER)
        })

        socketInstance.on(SOCKET_EVENTS.DISCONNECT, (reason) => {
            logger.warn("Socket disconnected", { reason })
            setIsConnected(false)
        })

        socketInstance.on(SOCKET_EVENTS.CONNECT_ERROR, (err) => {
            logger.error("Socket connection error", err.message)
            setIsConnected(false)
        })

        setSocket(socketInstance)

        return () => {
            socketInstance.disconnect()
        }
    }, [accessToken, user])

    return (
        <SocketContext.Provider value={{ socket, isConnected }}>
            {children}
        </SocketContext.Provider>
    )
}
