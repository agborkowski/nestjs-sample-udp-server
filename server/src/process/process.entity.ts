import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Index, BaseEntity } from 'typeorm';
import { IProcess, ProcessPermission } from './interfaces/process.interface';

@Entity()
export class Process extends BaseEntity implements IProcess {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ type: 'char', length: 64 })
	@Index({ unique: true })
	hash: string;

	@Column({ length: 124 })
	originalFilename: string;

	@Column({ length: 24 })
	extension: string;

	@Column({type: 'enum', enum: ProcessPermission, default: ProcessPermission.UNKNOWN, nullable: false})
	permission: ProcessPermission;

	@Column({ type: 'enum', enum: [
		'ADMIN_HELP_UNREGISTER',
		'ADMIN_HELP_START',
		'ADMIN_HELP_PROCESS', // @deprecated
		'ADMIN_HELP_END', // @deprecated
	], default: 'ADMIN_HELP_UNREGISTER', nullable: false })
	adminHelp: string;

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;
}