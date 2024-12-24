import { Data } from "effect";

/**
 * 为了让 Error 提供更丰富的错误信息而自定义的 Error 类型
 */
export class ExtendedCommonError extends Data.TaggedError('ExtendedCommonError')<{
    message:string
    stack:string
}>{

}