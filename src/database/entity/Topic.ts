import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index, OneToMany } from 'typeorm';
import { TopicStatSnapshot } from './TopicStatSnapshot.ts';
import { TopicContentSnapshot } from './TopicContentSnapshot.ts';
import { Comments } from './comments.ts';

@Entity({ name: 'topics' })
export class Topic {
    @PrimaryGeneratedColumn()
    id!: number;

    /**
     * 豆瓣话题的唯一标识符
     * @maxLength 255
     */
    @Column({ type: 'varchar',length:255, name: 'topic_id', nullable: false })
    @Index()
    topic_id!: string;

    @OneToMany(() => TopicStatSnapshot,(topicStatSnapshot) => topicStatSnapshot.topic)
    topic_stat_snapshots!: TopicStatSnapshot[];

    @OneToMany(() => TopicContentSnapshot,(topicContentSnapshot) => topicContentSnapshot.topic)
    topic_content_snapshots!: TopicContentSnapshot[];

    @OneToMany(() => Comments,(comment) => comment.topic)
    comments!: Comments[];

    /**
     * 所属小组ID
     */
    @Column({ type: 'varchar', length: 255, name: 'group_id', nullable: false })
    @Index()
    group_id!: string;

    @Column({ type: 'timestamp', name: 'topic_created_at' })
    topic_created_at!: Date;

    @Column({ type: 'varchar', length: 255, name: 'author_uid' })
    author_uid!: string;

    @Column({ type: 'varchar', length: 255, name: 'author_id' })
    author_id!: string;

    @Column({ type: 'timestamp', name: 'last_reply_at',nullable:true })
    last_reply_at!: Date;

    @CreateDateColumn({ type: 'timestamp', name: 'record_created_at' })
    record_created_at!: Date;

    @UpdateDateColumn({ type: 'timestamp', name: 'record_updated_at' })
    record_updated_at!: Date;

} 