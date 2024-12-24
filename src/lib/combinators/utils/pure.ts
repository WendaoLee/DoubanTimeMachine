import { ExtenedFetchError } from "@/types/error/ExtendedFetchError.ts";

/**
 * 处理 fetch 或 ofetch 时发生的错误。通常只用在你不想手动写报错匹配的情况。
 * @param error 
 * @returns 
 */
export const handleFetchError = (error:any) => new ExtenedFetchError({
    message: error.message,
    url: error.url,
    stack: error.stack
})

