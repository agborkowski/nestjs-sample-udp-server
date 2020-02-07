import { Get, Controller } from '@nestjs/common';
import { AppService } from './app.service';
// import { ActivityService } from 'process/activity.service';

@Controller()
export class AppController {
	constructor(
		private readonly appService: AppService,
		// private readonly activityService: ActivityService,
	) {}

	@Get()
	async root(): Promise<any> {
		// console.log(await this.activityService.find());
		return this.appService.root();
	}
}
