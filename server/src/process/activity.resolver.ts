import {
	Mutation,
	Resolver,
	Subscription,
	Query,
} from '@nestjs/graphql';

import { IActivity } from './interfaces/activity.interface';
import { ActivityService } from './activity.service';

@Resolver('Activity')
export class ActivityResolver {

	constructor(private readonly activityService: ActivityService) { }

	@Query()
	async activities(): Promise<IActivity[]> {
		return await this.activityService.find();
	}

	// @Query()
	// async activity(obj, args, context, info): Promise<IActivity> {
	// 	const { id } = args;
	// 	return await this.activityService.findOneById(+id);
	// }

	// @Mutation('createCat')
	// async create(@Args() args: Cat): Promise<Cat> {
	// 	const createdCat = await this.catsService.create(args);
	// 	pubSub.publish('catCreated', { catCreated: createdCat });
	// 	return createdCat;
	// }

	// @Subscription('catCreated')
	// catCreated() {
	// 	return {
	// 		subscribe: () => pubSub.asyncIterator('catCreated'),
	// 	};
	// }

	// @Mutation('activityCreate')
	// async activityCreate(obj, args: IActivity, context, info): Promise<IActivity> {
	// 	const activityCreated = await this.activityService.create(args);
	// 	pubSub.publish('activityCreated', { activityCreated });
	// 	return activityCreated;
	// }

	@Subscription()
	activityCreated() {
		return {
			subscribe: () => this.activityService.pubSub.asyncIterator('activityCreated'),
		};
	}
}