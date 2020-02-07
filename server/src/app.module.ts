import {
	Module,
	NestModule,
} from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';

import { GraphQLModule } from '@nestjs/graphql';
import * as GraphQLJSON from 'graphql-type-json';
import { join } from 'path';

import { DgramModule } from './dgram/dgram.module';
import { DgramService } from './dgram/dgram.service';

import { ProcessModule } from './process/process.module';
import { ProcessService } from './process/process.service';

import { AppController } from './app.controller';
import { AppService } from './app.service';
// import { ActivityService } from 'process/activity.service';

@Module({
	imports: [
		DgramModule.forRoot({ address: '0.0.0.0', port: 3000 }),
		TypeOrmModule.forRoot(),
		GraphQLModule.forRoot({
			typePaths: ['./**/*.graphql'],
			path: '/',
			resolvers: { JSON: GraphQLJSON },
			subscriptions: {
				path: '/ws',
				keepAlive: 10000,
			},
			installSubscriptionHandlers: true,
			resolverValidationOptions: {
				requireResolversForResolveType: false,
			},
			debug: true,
			definitions: {
				path: join(process.cwd(), 'src/graphql.schema.ts'),
				outputAs: 'class',
			},
		}),
		ProcessModule,
	],
	controllers: [AppController],
	providers: [
		AppService,
		// ActivityService
	],
})
export class AppModule implements NestModule {

	constructor(
		private readonly dgramService: DgramService,
		private readonly processService: ProcessService,
	) {}

	configure() {
		const dgramSocketServer = this.dgramService.createDgramSocket();
		this.processService.onMessage(dgramSocketServer);
	}
}
