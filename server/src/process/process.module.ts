import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Activity } from './activity.entity';
import { ActivityService } from './activity.service';

import { Process } from './process.entity';
import { ProcessService } from './process.service';
import { ProcessResolver } from './process.resolver';
import { ActivityResolver } from './activity.resolver';
import { DgramModule } from 'dgram/dgram.module';

@Module({
	imports: [
		TypeOrmModule.forFeature([Process, Activity]),
		DgramModule.forRoot({ address: '0.0.0.0', port: 3000 }),
	],
	providers: [
		ActivityService,
		ProcessService,
		ActivityResolver,
		ProcessResolver,
	],
	exports: [
		ProcessService,
	],
})
export class ProcessModule { }