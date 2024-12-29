import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, Index } from 'typeorm';
import type { Topic } from './Topic.ts';
import type { User } from './User.ts';
import type { DoubanComment } from '@/types/Comments.ts';

@Entity({ name: 'comments' })
export class Comments {
    @PrimaryGeneratedColumn()
    id!: number;

    // @Column({ type: 'varchar', name: 'topic_id', nullable: false })
    // @Index()
    // topic_id!: string;

    @ManyToOne('Topic',(topic:Topic) => topic.topic_id)
    @JoinColumn({ name: 'topic_id',referencedColumnName:'topic_id' })
    topic!: Topic;

    /**
     * 此处存储 uid
     */
    @Column({ name: 'user_uid',nullable:false,type:'varchar',charset:'utf8mb4' })
    @Index()
    user_uid!: string;

    /**
     * 此处通过用户 id 进行关联
     */
    @ManyToOne('User',(user:User) => user.douban_id)
    @JoinColumn({ name: 'user_id',referencedColumnName:'douban_id' })
    user!: User;

    /**
     * 回复内容
     */
    @Column({ type: 'longtext', name: 'content',charset:'utf8mb4' })
    content!: string;

    /**
     * 评论 id
     */
    @Column({ type: 'varchar', name: 'comment_id', length: 200, nullable: false })
    comment_id!:string

    /**
     * 如果该条评论是对其他评论的回复，那么会出现该字段
     */
    @Column({ type: 'varchar', name: 'ref_comment_id', length: 200, nullable: true })
    ref_comment_id!:string | null

    @Column({ type: 'int', name: 'upvote_count', default: 0 })
    upvote_count!:number

    @Column({ type: 'timestamp', name: 'created_at' })
    created_at!: Date;

    @CreateDateColumn({ type: 'timestamp', name: 'record_created_at' })
    record_created_at!: Date;

    @Column({ type: 'json', name: 'metadata', nullable: true })
    metadata!: DoubanComment
} 