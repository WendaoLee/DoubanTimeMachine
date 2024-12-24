import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, Index } from 'typeorm';
import { Topic } from './Topic.ts';

@Entity({ name: 'topic_stat_snapshots' })
export class TopicStatSnapshot {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: 'int', name: 'topic_index_id' })
    @Index()
    topic_index_id!: number;

    @ManyToOne(() => Topic)
    @JoinColumn({ name: 'topic_index_id' })
    topic!: Topic;

    /**
     * 回复数量
     */
    @Column({ type: 'int', name: 'reply_count', default: 0 })
    reply_count!: number;

    /**
     * 点赞数量
     */
    @Column({ type: 'int', name: 'favorite_count', default: 0 })
    favorite_count!: number;

    /**
     * 收藏数量
     */
    @Column({ type: 'int', name: 'collect_count', default: 0 })
    collect_count!: number;

    /**
     * 转发数量
     * 
     */
    @Column({ type: 'int', name: 'reshare_count', default: 0 })
    reshare_count!: number;


    /**
     * 最后回复时间
     */
    @Column({ type: 'timestamp', name: 'last_reply_time', nullable: true })
    last_reply_time!: Date;

    /**
     * 快照时间
     */
    @CreateDateColumn({ type: 'timestamp', name: 'snapshot_at' })
    snapshot_at!: Date;
} 