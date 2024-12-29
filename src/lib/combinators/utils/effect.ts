import crypto from 'crypto';
import { Effect } from 'effect';
import { ExtendedCommonError } from '@/types/error/ExtendedCommonError.ts';
import { DOUBAN_API_KEY, DOUBAN_API_SECRET } from '@/lib/constants/ENVIROMENT.ts';
import { ExtenedFetchError } from '@/types/error/ExtendedFetchError.ts';
import { ofetch } from 'ofetch';

interface ParamsData {
    [key: string]: any;
}

/**
 * 传入 apiSecret 和 apiKey 后，获得对应的加密函数
 * @param apiSecret 
 * @returns 
 */
export const getEncryptedParams = (apiSecret:string) => (apiKey:string) => (targetApiUrl:string,method:string,paramData:ParamsData = {
    channel: "Douban",
    os_rom: "android",
}) => Effect.try({
    try:()=>{
        const path = new URL(targetApiUrl).pathname;
        const timestamp = Math.floor(Date.now() / 1000);
        const message = [method, encodeURIComponent(path), timestamp.toString()].join('&');

        const hmac = crypto.createHmac('sha1', apiSecret);
        hmac.update(message);
        const signature = hmac.digest('base64');

        return {
            ...paramData,
            apikey: apiKey,
            _ts: timestamp,
            _sig: signature,
        };
    },
    catch:(err) => new ExtendedCommonError({
        message: `[getEncryptedParams] 在获取加密参数时发生错误: ${(err as Error).message}`,
        stack: (err as Error).stack ?? ''
    })
})

/**
 * 使用配置好的 API_SECRET 和 API_KEY 后，获得对应的加密函数
 */
export const getEncrypedParamsByDefaultEnv = getEncryptedParams(DOUBAN_API_SECRET)(DOUBAN_API_KEY)


const headers = {
    "User-Agent": "api-client/1 com.douban.frodo/7.27.0.6(231) Android/25 product/DT1901A vendor/smartisan model/DT1901A brand/smartisan  rom/android  network/wifi  udid/5fe86d1e414d8417ff3ec84c369e28c97a7d9d45  platform/AndroidPad",
};

/**
 * 通用的豆瓣访问组合子
 * @param api 访问的结果 API  
 * @param params 包含了加密结果的参数
 * @returns 
 */
export const doubanFetch = <T>(api: string, params?: ParamsData) => Effect.tryPromise({
    try: () => ofetch<T>(api, {
        method: 'GET',
        params,
        headers
    }),
    catch: (error) => new ExtenedFetchError({
        message: `[doubanFetch] 在访问 ${api} 时失败: ${(error as Error).message}`,
        url: (error as any).url,
        stack: (error as any).stack
    })
})

