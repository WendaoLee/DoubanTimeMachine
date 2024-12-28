import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, Index } from 'typeorm';
import type { Topic } from './Topic.ts';
import type { User } from './User.ts';

@Entity({ name: 'replies' })
export class Reply {
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
     * 楼层号
     */
    @Column({ type: 'int', name: 'floor_number' })
    floor_number!: number;

    @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
    created_at!: Date;
} 