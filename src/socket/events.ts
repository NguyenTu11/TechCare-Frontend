export const SOCKET_EVENTS = {
    CONNECT: "connect",
    DISCONNECT: "disconnect",
    CONNECT_ERROR: "connect_error",

    JOIN_ADMIN: "join:admin",
    JOIN_USER: "join:user",

    NOTIFICATION_NEW: "notification:new",
    STOCK_LOW: "stock:low",
    INVENTORY_LOW_STOCK: "inventory:lowStock",

    CHAT_NEW_MESSAGE: "chat:new-message",
    CHAT_CLOSED: "chat:closed",
} as const
