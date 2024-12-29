/**
 * 位置信息
 */
interface Location {
  /**
   * 位置 UID
   */
  uid: string;

  /**
   * 位置 ID
   */
  id: string;

  /**
   * 位置名称
   */
  name: string;
}

/**
 * 群组所有者信息
 */
interface Owner {
  /**
   * 位置信息
   */
  loc: Location;

  /**
   * 是否永久封禁
   */
  is_banned_forever: boolean;

  /**
   * 是否已关注
   */
  followed: boolean;

  /**
   * 用户名称
   */
  name: string;

  /**
   * 用户链接
   */
  url: string;

  /**
   * 性别
   */
  gender: string;

  /**
   * 用户ID
   */
  id: string;

  /**
   * 注册时间
   */
  reg_time: string;

  /**
   * 是否永久只读
   */
  is_readonly_forever: boolean;

  /**
   * URI
   */
  uri: string;

  /**
   * 头像URL
   */
  avatar: string;

  /**
   * 是否为俱乐部
   */
  is_club: boolean;

  /**
   * 类型
   */
  type: string;

  /**
   * 种类
   */
  kind: string;

  /**
   * 用户 UID
   */
  uid: string;
}

/**
 * 发帖指南信息
 */
interface PostGuide {
  /**
   * 指南文本
   */
  text: string;

  /**
   * 相关链接
   */
  links: any[];
}

/**
 * 分类信息
 */
interface Category {
  /**
   * 分类标题
   */
  title: string;

  /**
   * 分类ID
   */
  id: number;

  /**
   * 分类URI
   */
  uri: string;
}

/**
 * 信息流标签
 */
interface FeedTag {
  /**
   * 排序方式
   */
  sortby: string;

  /**
   * 标签标题
   */
  title: string;
}

/**
 * 话题标签
 */
interface TopicTag {
  /**
   * 标签名称
   */
  name: string;

  /**
   * 标签简称
   */
  short_name: string;

  /**
   * 相关主题ID
   */
  subject_id: number;

  /**
   * 相关话题数量
   */
  n_topics: number;

  /**
   * 是否为热门标签
   */
  is_hot: boolean;

  /**
   * 标签类型
   */
  type: string;

  /**
   * 标签ID
   */
  id: string;

  /**
   * 标签图标
   */
  icon: string;
}

/**
 * 群组标签页
 */
interface GroupTab {
  /**
   * 标签页名称
   */
  name: string;

  /**
   * 序号
   */
  seq: number;

  /**
   * URI
   */
  uri: string;

  /**
   * 是否为着陆页
   */
  landing: boolean;

  /**
   * 类型
   */
  type: string;

  /**
   * 标签页ID
   */
  id: string;
}

/**
 * 小组信息
 */
export interface GroupMetaData {
  /**
   * 群组域名
   */
  domain: string;

  /**
   * 提醒列表
   */
  alerts: any[];

  /**
   * 是否已关注
   */
  is_addicted: boolean;

  /**
   * 成员角色
   */
  member_role: number;

  /**
   * 管理员名称
   */
  manager_name: string;

  /**
   * 是否可以创建话题事件
   */
  can_create_topic_event: boolean;

  /**
   * 截图标题
   */
  screenshot_title: string;

  /**
   * 截图URL
   */
  screenshot_url: string;

  /**
   * 创建时间
   */
  create_time: string;

  /**
   * 是否显示收藏图片
   */
  show_collection_photos: boolean;

  /**
   * 是否允许回复评论
   */
  is_enable_reply_comment: boolean;

  /**
   * 成员名称
   */
  member_name: string;

  /**
   * 群组所有者信息
   */
  owner: Owner;

  /**
   * 是否为官方群组
   */
  is_official: boolean;

  /**
   * 截图类型
   */
  screenshot_type: string;

  /**
   * 群组ID
   */
  id: string;

  /**
   * 热门话题数量
   */
  hot_topic_count: number;

  /**
   * 发帖指南
   */
  post_guide: PostGuide;

  /**
   * 分类信息
   */
  category: Category;

  /**
   * 用户话题数量
   */
  user_topic_count: number;

  /**
   * 是否需要弹出规则
   */
  need_pop_rules: boolean;

  /**
   * 信息流标签列表
   */
  feed_tags: FeedTag[];

  /**
   * 成员数量
   */
  member_count: number;

  /**
   * 显示管理员图标的用户ID列表
   */
  show_manager_icon_uids: string[];

  /**
   * 普通话题标签列表
   */
  topic_tags_normal: TopicTag[];

  /**
   * 俱乐部ID
   */
  club_id: string;

  /**
   * 成员数量文本
   */
  member_count_text: string;

  /**
   * 群组名称
   */
  name: string;

  /**
   * 审查消息
   */
  censor_message: string;

  /**
   * 搜索建议词
   */
  search_suggestion_word: string;

  /**
   * 话题标签剧集
   */
  topic_tags_episode: any[];

  /**
   * 规则描述
   */
  rules_desc: string;

  /**
   * 群组标签页列表
   */
  group_tabs: GroupTab[];

  /**
   * 分享URL
   */
  sharing_url: string;

  /**
   * 类型
   */
  type: string;

  /**
   * 是否允许订阅
   */
  enable_subscribe: boolean;

  /**
   * 大头像URL
   */
  large_avatar: string;

  /**
   * 话题列表隐藏原因
   */
  topics_list_hidden_reason: string;

  /**
   * 是否为新所有者
   */
  is_new_onwer: boolean;

  /**
   * 是否允许评论踩
   */
  allow_downvote_comment: boolean;

  /**
   * 是否为新话题事件模板
   */
  new_topic_event_template: boolean;

  /**
   * 是否被邀请为管理员
   */
  is_invited_as_manager: boolean;

  /**
   * 提醒
   */
  alert: string;

  /**
   * 精华总数
   */
  elite_total: number;

  /**
   * 是否允许绑定视频
   */
  allow_binding_video: boolean;

  /**
   * 是否允许话题踩
   */
  allow_downvote_topic: boolean;

  /**
   * 是否允许话题事件
   */
  allow_topic_event: boolean;

  /**
   * 是否预览收藏图片
   */
  preview_collection_photos: boolean;

  /**
   * 未读数量字符串
   */
  unread_count_str: string;

  /**
   * 是否启用热搜榜
   */
  enable_hot_search_board: boolean;

  /**
   * 群组描述
   */
  desc: string;

  /**
   * 是否为主题群组
   */
  is_subject_group: boolean;

  /**
   * 话题数量
   */
  topic_count: number;

  /**
   * 标语
   */
  slogan: string;

  /**
   * 微信朋友圈分享
   */
  wechat_timeline_share: string;

  /**
   * 是否只读
   */
  is_readonly: boolean;

  /**
   * URL
   */
  url: string;

  /**
   * 是否可以设置收藏图片
   */
  can_set_collection_photos: boolean;

  /**
   * URI
   */
  uri: string;

  /**
   * 加入类型
   */
  join_type: string;

  /**
   * 主题卡片列表
   */
  subject_cards: any[];

  /**
   * 加入指南
   */
  joining_guide: PostGuide;

  /**
   * 头像URL
   */
  avatar: string;

  /**
   * 背景遮罩颜色
   */
  background_mask_color: string;

  /**
   * 所有者ID
   */
  owner_id: string;

  /**
   * 管理员横幅
   */
  admin_banner: Record<string, any>;
}
