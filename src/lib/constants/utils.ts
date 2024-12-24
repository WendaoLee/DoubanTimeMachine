/**
 * 传入环境变量值，如果环境变量未定义，则及时抛出错误。
 * @param envVal 
 * @param envName 
 * @returns 
 */
export const throwErrorIsEnvNotConfigured = (envVal:string | undefined,envName?:string) => {
    if(!envVal) {
        throw new Error(`${envName} 未配置`)
    }
    return envVal as typeof envVal
}