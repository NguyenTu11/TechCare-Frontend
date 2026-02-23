import type { ZodSchema } from "zod"
import { logger } from "@/lib/logger"

export function parsePayload<T>(schema: ZodSchema<T>, data: unknown, eventName: string): T | null {
    const result = schema.safeParse(data)
    if (!result.success) {
        logger.error(`Invalid socket payload for ${eventName}`, result.error.flatten())
        return null
    }
    return result.data
}
