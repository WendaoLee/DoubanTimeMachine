import { Data } from "effect"
/**
 * 扩展的错误类型。说明是在通过 fetch 或 ofetch 时发生的访问错误。
 * 该类型用于提供更加丰富的错误信息。
 * - stack: 包含错误信息及调用栈，通常在 debug 与 trace 中使用
 * - url: 发生错误的 url
 * - message: 错误信息
 */
export class ExtenedFetchError extends Data.TaggedError('FetchError')<{
    message:string,
    url:string,
    stack:string
}>  {
    readonly _tag = 'FetchError'
}