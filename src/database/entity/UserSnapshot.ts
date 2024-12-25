import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, Index } from 'typeorm';
import { User } from './User.ts';

@Entity({ name: 'user_snapshots' })
export class UserSnapshot {
    @PrimaryGeneratedColumn()
    id!: number;

    /**
     * 去用户索引表里获取的 ID
     */
    @Column({ type: 'varchar', name: 'user_id', nullable: false })
    @Index()
    user_id!: string;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'user_id' })
    user!: User;

    /**
     * 用户名称
     * @maxLength 255
     */
    @Column({ type: 'varchar', length: 255, name: 'name', nullable: true })
    name!: string;

    /**
     * 用户头像URL
     * @maxLength 1000
     */
    @Column({ type: 'varchar', length: 1000, name: 'avatar', nullable: true })
    avatar!: string;

    /**
     * 用户IP地址
     * @maxLength 45
     */
    @Column({ type: 'json', nullable: true })
    ip!: {
        /**
         * 这是ip地址的uid和id
         */
        uid: string;
        id: string;
        /**
         * 这是ip地址的名称
         */
        name: string;
    } | null;

    /**
     * 用户注册时间
     */
    @Column({ type: 'timestamp', name: 'user_created_at' })
    user_created_at!: Date;

    /**
     * 用户性别
     */
    @Column({ type: 'varchar', length: 10, name: 'gender', nullable: true })
    gender!: string;

    /**
     * 快照时间
     */
    @CreateDateColumn({ type: 'timestamp', name: 'snapshot_at' })
    snapshot_at!: Date;

    /**
     * 元数据
     */
    @Column({ type: 'json', nullable: true, name: 'metadata' })
    metadata: any;
} 