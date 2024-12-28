import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index, OneToMany } from 'typeorm';
import { TopicStatSnapshot } from './TopicStatSnapshot.ts';
import { TopicContentSnapshot } from './TopicContentSnapshot.ts';
import { Reply } from './Reply.ts';

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

    @OneToMany(() => Reply,(reply) => reply.topic)
    replies!: Reply[];

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

    @CreateDateColumn({ type: 'timestamp', name: 'record_created_at' })
    record_created_at!: Date;

    @UpdateDateColumn({ type: 'timestamp', name: 'record_updated_at' })
    record_updated_at!: Date;

} 