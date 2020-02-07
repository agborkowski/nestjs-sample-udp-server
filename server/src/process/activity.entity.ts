import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, BaseEntity } from 'typeorm';
import { IActivity, ActivityRequest, ActivityResponse } from './interfaces/activity.interface';

@Entity()
export class Activity extends BaseEntity implements IActivity {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ length: 64 })
	guid: string;

	@Column({ length: 255 })
	hostname: string;

	@Column({ type: 'varbinary', length: 16, nullable: true })
	ipv4v6: string;

	@Column({ length: 124 })
	filename: string;

	@Column({ type: 'char', length: 64 })
	hash: string;

	@Column()
	address: string;

	@Column()
	port: string;

	@Column({
		type: 'enum',
		enum: [
			'CLIENT',
			'SERVER',
		],
		nullable: true,
	})
	from: string;

	@Column({
		type: 'enum',
		enum: ActivityRequest,
		nullable: true,
	})
	request: ActivityRequest;

	@Column({
		nullable: true,
	})
	query: string;

	@Column({
		type: 'enum',
		enum: ActivityResponse,
		nullable: true,
	})
	response: ActivityResponse;

	@Column({ nullable: true, default: null })
	data: string;

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;
}