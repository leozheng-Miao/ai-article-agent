/**
 * SSE 工具函数
 * @author <a href="https://codefather.cn">编程导航学习圈</a>

 */

export interface SSEMessage {
    type: string
    data?: any
    [key: string]: any
}

export interface SSEOptions {
    onMessage: (message: SSEMessage) => void
    onError?: (error: Event) => void
    onComplete?: () => void
    /**
     * 最大重连次数（不包含第一次连接）
     * @default 3
     */
    maxRetries?: number
    /**
     * 每次重连间隔（ms）
     * @default 3000
     */
    retryDelay?: number
}

/**
 * SSE 连接控制器
 */
export interface SSEConnection {
    eventSource: EventSource
    cancel: () => void
}

/**
 * 建立 SSE 连接（支持断线重连）
 */
export const connectSSE = (taskId: string, options: SSEOptions): SSEConnection => {
    const { onMessage, onError, onComplete } = options
    const maxRetries = options.maxRetries ?? 3
    const retryDelay = options.retryDelay ?? 3000

    let eventSource!: EventSource
    let cancelled = false
    let completed = false
    let retryCount = 0
    let lastEventType: string | undefined

    const buildUrl = (lastType?: string) => {
        if (!lastType) {
            return `/api/article/progress/${taskId}`
        }
        return `/api/article/progress/${taskId}?lastEventType=${encodeURIComponent(lastType)}`
    }

    const clearAndClose = () => {
        try {
            eventSource?.close()
        } catch {
            // ignore
        }
    }

    const connect = () => {
        eventSource = new EventSource(buildUrl(lastEventType))

        eventSource.onmessage = (event) => {
            try {
                const message: SSEMessage = JSON.parse(event.data)
                lastEventType = message.type
                onMessage(message)

                // 完成后不再重连
                if (message.type === 'ALL_COMPLETE' || message.type === 'ERROR') {
                    completed = true
                    clearAndClose()
                    onComplete?.()
                }
            } catch (error) {
                console.error('SSE 消息解析失败:', error)
            }
        }

        eventSource.onerror = (error) => {
            if (cancelled || completed) {
                return
            }

            console.error('SSE 连接错误:', error)
            clearAndClose()

            // 未完成则重连
            if (retryCount < maxRetries) {
                retryCount++
                const currentLastEventType = lastEventType

                window.setTimeout(() => {
                    if (cancelled || completed) {
                        return
                    }
                    // 重连时把 lastEventType 带到 URL
                    lastEventType = currentLastEventType
                    connect()
                }, retryDelay)
                return
            }

            // 超过最大次数：最终失败
            completed = true
            onError?.(error)
        }
    }

    connect()

    return {
        eventSource,
        cancel: () => {
            cancelled = true
            completed = true
            clearAndClose()
        },
    }
}

/**
 * 关闭 SSE 连接（兼容旧用法）
 */
export const closeSSE = (eventSource: EventSource | null) => {
    if (eventSource) {
        eventSource.close()
    }
}
