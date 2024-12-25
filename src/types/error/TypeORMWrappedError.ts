import { TypeORMError } from "typeorm";
import { Data, Effect } from "effect";
import { ExtendedCommonError } from "./ExtendedCommonError.ts";

export class TypeORMWrappedError extends Data.TaggedError('TypeORMWrappedError')<
{
    message:string
    stack:string
}>{

}

export const handleTypeORMError = (error:TypeORMError | Error | any) => {
    if(error instanceof TypeORMError){
        return new TypeORMWrappedError({
            message: error.message,
            stack: `TypeORMWrappedError: ${error.stack}`
        })
    }
    return new ExtendedCommonError({
        message: `在匹配数据库的 TypeORM 错误时，似乎发生了意料之外的、不属于 TypeORM 的错误。错误信息为：${error.message}\n 错误堆栈为：${error?.stack}`,
        stack: `handleTypeORMError:: ${error?.stack}`
    })
}