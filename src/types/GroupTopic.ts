interface Image {
  /**
   * 图片URL
   */
  url: string;
  /**
   * 图片宽度
   */
  width: number;
  /**
   * 图片高度
   */
  height: number;
}

interface ImageInfo {
  large: Image;
  primary_color: string;
  normal: Image;
  is_animated: boolean;
}

interface PhotoSize {
  width: number;
  height: number;
}

interface Photo {
  /**
   * 图片布局方式
   */
  layout: string;
  /**
   * 图片标题
   */
  title: string;
  /**
   * 如果是一系列照片，该Id指示为系列的第几张
   */
  seq_id: string;
  image: ImageInfo;
  /**
   * 图片创建时间
   */
  creation_date: string;
  /**
   * 关联的帖子ID
   */
  topic_id: string;
  /**
   * 图片上传者ID
   */
  author_id: string;
  id: string;
  size: PhotoSize;
}

interface Author {
  /**
   * 用户所在地
   */
  loc: {
    uid: string
    id: string
    name: string
  };
  /**
   * 是否被永久封禁
   */
  is_banned_forever: boolean;
  /**
   * 当前用户是否关注了该作者
   */
  followed: boolean;
  /**
   * 用户名称
   */
  name: string;
  /**
   * 用户个人主页URL
   */
  url: string;
  /**
   * 用户性别
   */
  gender: string;
  /**
   * 用户ID
   */
  id: string;
  /**
   * 用户注册时间
   */
  reg_time: string;
  /**
   * 是否被永久只读
   */
  is_readonly_forever: boolean;
  uri: string;
  /**
   * 用户头像URL
   */
  avatar: string;
  /**
   * 是否为小组账号
   */
  is_club: boolean;
  type: string;
  kind: string;
  /**
   * 用户唯一标识符
   */
  uid: string;
}

/**
 * 从 api "https://frodo.douban.com/api/v2/group/${groupId}/topic" 中获取的 topic 数据
 */
export interface GroupTopicAPITopicInfo {
  /**
   * 帖子内容摘要
   */
  abstract: string;
  /**
   * 帖子创建时间
   */
  create_time: string;
  /**
   * 转发数
   */
  reshares_count: number;
  /**
   * 帖子ID
   */
  id: string;
  author: Author;
  label: string;
  /**
   * 是否包含投票
   */
  has_poll: boolean;
  gallery_topic: null;
  type: string;
  /**
   * 是否为广告
   */
  is_ad: boolean;
  reaction_type: number;
  /**
   * 最后更新时间
   */
  update_time: string;
  /**
   * 是否为精华帖
   */
  is_elite: boolean;
  /**
   * 封面图片URL
   */
  cover_url: string;
  /**
   * 帖子包含的图片
   */
  photos: Photo[];
  url: string;
  /**
   * 帖子标签
   */
  topic_tags: any[];
  /**
   * 帖子标题
   */
  title: string;
  uri: string;
  activity_tag: null;
  video_info: null;
  /**
   * 获得的点赞数
   */
  reactions_count: number;
  /**
   * 评论数
   */
  comments_count: number;
  /**
   * 是否为活动帖
   */
  is_event: boolean;
} 

/**
 * 从 api "https://frodo.douban.com/api/v2/group/${groupId}/topics" 中获取的 topic 数据
 */
export interface GroupTopicAPIResponse {
    /**
     * 本次请求获取的帖子数
     */
    count: number,
    /**
     * 精华帖数
     */
    elite_count: number,
    topics: GroupTopicAPITopicInfo[],
    /**
     * 热门帖子总数
     */
    hot_total: number,
    has_card_mode: boolean,
    sticky_topics: [],
    start: number,
    total: number,
    is_card_mode: boolean
}