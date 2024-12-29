/**
 * 统一的用户特征元信息数据，用于和数据库交互使用。
 * 请注意，这不是存在数据库里的元信息数据。只是用于和数据库交互使用。
 */
export interface UserFeatureMetaData {
    douban_id: string;
    douban_uid: string;
    name: string;
    avatar: string;
    gender: 'M' | 'F' | 'U';
    user_created_at: Date;
    user_avatar_url: string;
    location?:{
        uid: string;
        id: string;
        /**
         * 位置的中文名
         */
        name: string;
    }
}

export type DoubanUserGender = 'M' | 'F' | 'U';