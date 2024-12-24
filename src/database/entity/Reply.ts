import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, Index } from 'typeorm';
import { Topic } from './Topic.ts';
import { User } from './User.ts';

@Entity({ name: 'replies' })
export class Reply {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ name: 'topic_index_id' })
    @Index()
    topic_index_id!: number;

    @ManyToOne(() => Topic)
    @JoinColumn({ name: 'topic_index_id' })
    topic!: Topic;

    @Column({ name: 'user_id' })
    @Index()
    user_id!: number;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'user_id' })
    user!: User;

    /**
     * 回复内容
     */
    @Column({ type: 'longtext', name: 'content' })
    content!: string;

    /**
     * 楼层号
     */
    @Column({ type: 'int', name: 'floor_number' })
    floor_number!: number;

    @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
    created_at!: Date;
} 