import { z } from "zod"

const OBJECTID_REGEX = /^[a-fA-F0-9]{24}$/

export const notificationIdSchema = z.object({
    id: z.string().min(1, "Notification ID is required").regex(OBJECTID_REGEX, "Invalid Notification ID format"),
})

export type NotificationIdInput = z.infer<typeof notificationIdSchema>
