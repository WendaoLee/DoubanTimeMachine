import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index, OneToMany } from 'typeorm';
import { UserSnapshot } from './UserSnapshot.ts';
import type { Comments } from './comments.ts';

/**
 * 提供所有用户的索引信息
 */
@Entity({ name: 'users' })
export class User {
    @PrimaryGeneratedColumn()
    id!: number;

    /**
     * 豆瓣用户的唯一标识符
     * @maxLength 255
     */
    @Column({ type: 'varchar', length: 255, name: 'douban_id', nullable: false,charset:'utf8mb4' })
    @Index()
    douban_id!: string;

    /**
     * UID 是可能发生变化的。
     * 此处记录 UID 是为了方便查询。
     */
    @Column({ type: 'varchar', length: 255, name: 'douban_uid', nullable: true,charset:'utf8mb4' })
    @Index()
    douban_uid!: string;

    @OneToMany(() => UserSnapshot, (userSnapshot) => userSnapshot.user)
    userSnapshots!: UserSnapshot[];

    @OneToMany('Comments',(comment:Comments) => comment.user)
    comments!: Comments[];

    /**
     * 用户的注册时间
     */
    @Column({ type: 'timestamp', name: 'user_created_at',nullable:true })
    user_created_at!: Date;

    @CreateDateColumn({ type: 'timestamp', name: 'record_created_at',nullable:false })
    record_created_at!: Date;

    @UpdateDateColumn({ type: 'timestamp', name: 'record_updated_at' })
    record_updated_at!: Date;

} 