class RequestQueue {
    private static instance: RequestQueue
    private queue: Map<string, Promise<any>> = new Map()
    private pendingRequests: Map<string, number> = new Map()
    private readonly RATE_LIMIT_WINDOW = 60000 // 1 minute
    private readonly MAX_REQUESTS_PER_WINDOW = 30

    static getInstance(): RequestQueue {
        if (!RequestQueue.instance) {
            RequestQueue.instance = new RequestQueue()
        }
        return RequestQueue.instance
    }

    private getKey(url: string, params?: any): string {
        return `${url}?${JSON.stringify(params || {})}`
    }

    private isRateLimited(key: string): boolean {
        const count = this.pendingRequests.get(key) || 0
        return count >= this.MAX_REQUESTS_PER_WINDOW
    }

    private incrementRequest(key: string): void {
        const current = this.pendingRequests.get(key) || 0
        this.pendingRequests.set(key, current + 1)
        
        setTimeout(() => {
            const newCount = (this.pendingRequests.get(key) || 0) - 1
            if (newCount <= 0) {
                this.pendingRequests.delete(key)
            } else {
                this.pendingRequests.set(key, newCount)
            }
        }, this.RATE_LIMIT_WINDOW)
    }

    async execute<T>(key: string, fn: () => Promise<T>): Promise<T> {
        if (this.queue.has(key)) {
            return this.queue.get(key)
        }

        if (this.isRateLimited(key)) {
            await new Promise(resolve => setTimeout(resolve, 1000))
            return this.execute(key, fn)
        }

        this.incrementRequest(key)
        
        const promise = fn()
        this.queue.set(key, promise)

        try {
            const result = await promise
            return result
        } finally {
            this.queue.delete(key)
        }
    }
}

export const requestQueue = RequestQueue.getInstance()
