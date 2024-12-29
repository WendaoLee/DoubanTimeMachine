interface Location {
  /** 
   * 用户位置的唯一标识符
   */
  uid: string;
  /**
   * 位置ID
   */
  id: string;
  /**
   * 位置名称
   */
  name: string;
}

interface User {
  /**
   * 用户所在位置信息
   */
  loc: Location | null;
  /**
   * 用户是否被永久封禁
   */
  is_banned_forever: boolean;
  /**
   * 当前用户是否关注了该用户
   */
  followed: boolean;
  name: string;
  url: string;
  gender: string;
  id: string;
  reg_time: string;
  is_readonly_forever: boolean;
  uri: string;
  avatar: string;
  is_club: boolean;
  type: string;
  kind: string;
  uid: string;
}

interface ImageSize {
  url: string;
  width: number;
  height: number;
}

interface Image {
  large: ImageSize;
  primary_color: string;
  normal: ImageSize;
  is_animated: boolean;
}

interface Photo {
  layout: string;
  title: string;
  seq_id: string;
  image: Image;
  creation_date: string;
  topic_id: string;
  author_id: string;
  id: string;
  size: {
    width: number;
    height: number;
  };
}

interface TopicTag {
  name: string;
  short_name: string;
  subject_id: number;
  n_topics: number;
  is_hot: boolean;
  type: string;
  id: string;
  icon: string;
}

interface FeedTag {
  sortby: string;
  title: string;
}

interface Guide {
  text: string;
  links: any[];
}

interface Group {
  domain: string;
  member_role: number;
  manager_name: string;
  topic_count: number;
  uri: string;
  enable_subscribe: boolean;
  create_time: string;
  show_collection_photos: boolean;
  is_enable_reply_comment: boolean;
  member_name: string;
  owner: User;
  is_official: boolean;
  /**
   * 小组ID
   */
  id: string;
  feed_tags: FeedTag[];
  member_count: number;
  show_manager_icon_uids: string[];
  topic_tags_normal: TopicTag[];
  topic_tags_episode: any[];
  type: string;
  owner_id: string;
  post_guide: Guide;
  reject_status: null;
  allow_downvote_topic: boolean;
  allow_downvote_comment: boolean;
  is_invited_as_manager: boolean;
  allow_binding_video: boolean;
  can_create_topic_event: boolean;
  preview_collection_photos: boolean;
  unread_count_str: string;
  name: string;
  is_subject_group: boolean;
  sharing_url: string;
  url: string;
  can_set_collection_photos: boolean;
  desc_abstract: string;
  join_type: string;
  joining_guide: Guide;
  avatar: string;
  background_mask_color: string;
}

interface EliteLabel {
  text: string;
  color_type: string;
}

/**
 * 从 api "https://frodo.douban.com/api/v2/group/topic/${topicId}" 中获取的 topic 数据
 */
export interface TopicAPIResponse {
  /**
   * 主题帖的收藏数量
   */
  collections_count: number;
  /**
   * 是否允许非小组成员评论
   */
  can_comment_outside: boolean;
  /**
   * 帖子内容摘要
   */
  abstract: string;
  /**
   * 是否为原创内容
   */
  is_original: boolean;
  /**
   * 帖子创建时间
   */
  create_time: string;
  /**
   * 如果帖子有编辑过，则此字段有值
   */
  edit_time?:string;
  /**
   * 是否允许回复评论
   */
  is_enable_reply_comment: boolean;
  /**
   * 帖子内容
   */
  content: string;
  /**
   * 小组信息
   */
  group: Group;
  /**
   * 精华标签信息
   */
  elite_label: EliteLabel;
  /**
   * 帖子标题
   */
  title: string;
  /**
   * 是否为精华帖
   */
  is_elite: boolean;
  /**
   * 点赞数量
   */
  like_count: number;
  /**
   * 评论数量
   */
  comments_count: number;
  /**
   * IP归属地
   */
  ip_location: string;
  is_report_stock: boolean;
  screenshot_url: string;
  reshares_count: number;
  can_add_image_comment: boolean;
  image_layout: string;
  id: string;
  can_show_ad: boolean;
  screenshot_type: string;
  is_admin_locked: boolean;
  label: string;
  has_poll: boolean;
  reactions_count: number;
  is_collected: boolean;
  type: string;
  is_ad: boolean;
  can_author_delete: boolean;
  ad_filter_type: number;
  update_time: string;
  cover_url: string;
  is_douban_ad_author: boolean;
  gifts_count: number;
  reaction_type: number;
  sub_topic_tags: any[];
  /**
   * 小组的分类 tag ，例如 无关/水水
   */
  topic_tags: TopicTag[];
  screenshot_title: string;
  is_private: boolean;
  wechat_timeline_share: string;
  locked: boolean;
  sharing_url: string;
  photos: Photo[];
  url: string;
  can_relate_gallery_topic: boolean;
  author: User;
  uri: string;
  is_locked: boolean;
  is_richtext: boolean;
  is_event: boolean;
}
