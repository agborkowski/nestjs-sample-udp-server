import { Injectable } from '@nestjs/common';

import { PubSub } from 'graphql-subscriptions';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository, InsertResult } from 'typeorm';

import { Activity } from './activity.entity';
import { IActivity } from './interfaces/activity.interface';

@Injectable()
export class ActivityService {

	public pubSub: PubSub;
	constructor(
		@InjectRepository(Activity)
		private readonly activityRepository: Repository<Activity>,
	) {
		this.pubSub = new PubSub();
	}

	async create(data: IActivity): Promise<IActivity> {
		const activityCreated = await this.activityRepository.save(data, {
			transaction: false,
		});

		this.pubSub.publish('activityCreated', { activityCreated: { ...data, ...activityCreated }});

		return activityCreated;
	}

	async find(): Promise<Activity[]>{
		return await this.activityRepository.find({order: {id: 'DESC'}, take: 20});
	}

	async findLastConnectedClients(): Promise<[]> {
		// tslint:disable-next-line:max-line-length
		const selectLastConnectionsQuery = `SELECT *, CONCAT(\`address\`,':',\`port\`) AS 'client' FROM activity WHERE \`from\`='CLIENT' GROUP BY client ORDER BY createdAt DESC LIMIT 10`;

		return this.activityRepository.query(selectLastConnectionsQuery);
	}
}