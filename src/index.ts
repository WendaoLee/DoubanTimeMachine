import { ofetch } from 'ofetch';
import crypto from 'crypto';

const headers = {
    "User-Agent": "api-client/1 com.douban.frodo/7.27.0.6(231) Android/25 product/DT1901A vendor/smartisan model/DT1901A brand/smartisan  rom/android  network/wifi  udid/5fe86d1e414d8417ff3ec84c369e28c97a7d9d45  platform/AndroidPad",
};

const dm = {
    channel: "Douban",
    os_rom: "android",
};

interface ParamsData {
    [key: string]: any;
}

/**
 * 获取加密参数
 * @param api 
 * @param method 
 * @param data 
 * @returns 
 */
function encrypt(api: string, method: string, data: ParamsData): ParamsData {
    const path = new URL(api).pathname;
    const secret = "bf7dddc7c9cfe6f7";
    const timestamp = Math.floor(Date.now() / 1000);
    const message = [method, encodeURIComponent(path), timestamp.toString()].join('&');

    const hmac = crypto.createHmac('sha1', secret);
    hmac.update(message);
    const signature = hmac.digest('base64');

    return {
        ...data,
        apikey: "0dad551ec0f84ed02907ff5c42e8ec70",
        _ts: timestamp,
        _sig: signature,
    };
}

async function get(api: string, params?: ParamsData) {
    return await ofetch(api, {
        method: 'GET',
        params,
        headers
    });
}

async function getTopic(tid: string | number) {
    const api = `https://frodo.douban.com/api/v2/group/topic/${tid}`;
    const params = encrypt(api, "GET", dm);
    return await get(api, params);
}

async function getComment(tid: string | number, start: number = 0, count: number = 20) {
    const api = `https://frodo.douban.com/api/v2/group/topic/${tid}/comments`;
    const params = encrypt(api, "GET", { ...dm, start, count });
    return await get(api, params);
}

export const fetchGroupTopics = async (groupId:string) => {
  const api = `https://frodo.douban.com/api/v2/group/${groupId}/topics`;
  const params = encrypt(api, "GET", { ...dm});
  return await get(api, params);
}

async function getAllComments(tid: string | number) {
    const comments: any[] = [];
    let i = 0;
    let r = await getComment(tid);
    
    while (r.comments && r.comments.length > 0) {
        i += 20;
        comments.push(...r.comments);
        r = await getComment(tid, i);
        console.log(i);
        await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    return comments;
}

const result = await getComment("315353257")
console.log(result)