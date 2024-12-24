import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, Index } from 'typeorm';
import { Topic } from './Topic.ts';
import type { TopicAPIResponse } from '@/types/Topic.ts';

/**
 * 存储帖子主楼内容的快照信息表
 */
@Entity({ name: 'topic_content_snapshots' })
export class TopicContentSnapshot {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: 'int', name: 'topic_index_id' })
    @Index()
    topic_index_id!: number;

    @ManyToOne(() => Topic)
    @JoinColumn({ name: 'topic_index_id' })
    topic!: Topic;


    /**
     * 帖子内容
     */
    @Column({ type: 'longtext', name: 'content' })
    content!: string;

    @Column({ type: 'varchar', length: 255, name: 'title' })
    title!: string;

    @Column({ type: 'varchar', length: 255, name: 'author_uid' })
    author_uid!: string;

    @Column({ type: 'varchar', length: 255, name: 'author_id' })
    author_id!: string;

    @Column({ type: 'timestamp', name: 'topic_created_at' })
    topic_created_at!: Date;

    /**
     * 帖子最后被回复的时间。
     * 此处的 update 的语义是帖子的回复状态发生变化。
     */
    @Column({ type: 'timestamp', name: 'topic_updated_at',nullable:true })
    topic_updated_at!: Date;

    /**
     * 最后编辑时间
     * 如果帖子没有编辑过，则此字段为 null
     */
    @Column({ type: 'timestamp', name: 'last_edit_time', nullable: true })
    last_edit_time!: Date;

    /**
     * 快照时间
     */
    @CreateDateColumn({ type: 'timestamp', name: 'snapshot_at' })
    snapshot_at!: Date;

    @Column({ type: 'json', name: 'metadata' })
    metadata!: TopicAPIResponse;
} 