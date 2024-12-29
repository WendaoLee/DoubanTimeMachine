interface Location {
  uid: string;
  id: string;
  name: string;
}

interface Author {
  loc: Location | null;
  is_banned_forever: boolean;
  followed: boolean;
  uid: string;
  avatar_side_icon?: string;
  url: string;
  gender: 'M' | 'F' | 'U';
  reg_time: string;
  is_readonly_forever: boolean;
  uri: string;
  name: string;
  avatar_side_icon_id?: string;
  avatar_side_icon_type?: number;
  is_club: boolean;
  kind: string;
  type: string;
  id: string;
  avatar: string;
}

interface ImageSize {
  url: string;
  width: number;
  height: number;
}

interface Image {
  large: ImageSize;
  normal: ImageSize;
  is_animated: boolean;
}

interface Photo {
  origin: boolean;
  description: string;
  watermark: any | null;
  image: Image;
  tag_name: string;
  id: string;
}


export interface DoubanComment {
  reaction_type: number;
  is_censoring: boolean;
  is_deleted: boolean;
  entities: any[];
  author: Author;
  text: string;
  is_disabled: boolean;
  uri: string;
  photos: Photo[];
  /**
   * 点赞数
   * 头疼，不是很想做这个东东的快照。
   */
  vote_count: number;
  create_time: string;
  ip_location: string;
  id: string;
  ref_comment?:DoubanComment | null
}

/**
 * 从 api "https://frodo.douban.com/api/v2/group/topic/${topicId}/comments" 中获取的评论数据
 */
export interface CommentsResponse {
  /**
   * 热门评论
   */
  popular_comments: DoubanComment[];
  /**
   * 开始索引
   */
  start: number;
  /**
   * 总数
   */
  total: number;
  /**
   * 评论数量
   */
  count: number;
  comments: DoubanComment[];
}
