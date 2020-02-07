import { Injectable } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Process } from './process.entity';
import { IProcess, ProcessPermission, ProcessPermissionMap } from './interfaces/process.interface';

import { ActivityService } from './activity.service';

import * as path from 'path';
import { readFileSync } from 'fs';
import {
	ActivityResponse,
	ActivityRequest,
	ActivityResponseMap,
	ActivityRequestMap,
 	ActivityResponseAdminHelpMap,
	IActivity,
} from './interfaces/activity.interface';
import { DgramService } from '../dgram/dgram.service';

// export enum Policy {
// 	PROCESS_ALLOW = 'PROCESS_ALLOW',
// 	PROCESS_DENY = 'PROCESS_DENY',
// }
@Injectable()
export class ProcessService {
	private processes = [];
	// public defaultPolicy: Policy = Policy.PROCESS_DENY;

	constructor(
		@InjectRepository(Process)
		private readonly processRepository: Repository<Process>,
		private readonly activityService: ActivityService,
		private readonly dgramService: DgramService,
	) { }

	async socketClientsPublish(process: IProcess): Promise<boolean> {
		const clients = await this.activityService.findLastConnectedClients();
		clients.forEach((client: IActivity) => {
			const processChallenge = ActivityResponse[process.permission];
			this.activityService.create({
				guid: client.guid,
				hostname: client.hostname,
				filename: process.originalFilename,
				hash: process.hash,
				address: client!.address,
				port: client!.port.toString(),
				from: 'SERVER',
				response: processChallenge,
			});

			const serverResponse = [
				'00',
				process.hash.toLocaleUpperCase(),
				ProcessPermissionMap[processChallenge],
			];

			const serverResponseBuffer = Buffer.from(serverResponse.join(''));
			this.dgramService.getDgramSocket().send(serverResponseBuffer, 0, serverResponseBuffer.length, +client.port, client.address);
		});
		return Promise.resolve(true);
	}

	// updateDefaultPolicy(policy: Policy) {
	// 	this.defaultPolicy = policy;
	// }

	async save(process: IProcess): Promise<IProcess> {
		const data = {
			...process,
			hash: process.hash.toLocaleUpperCase(),
			originalFilename: process.originalFilename,
			extension: path.win32.extname(process.originalFilename).toLocaleLowerCase(),

		};
		return this.processRepository.save(data);
	}

	async findAll(): Promise<IProcess[]> {
		return await this.processRepository.find({take: 100, order: {updatedAt: 'DESC'}});
	}

	async findOneById(id: number): Promise<IProcess> {
		return await this.processRepository.findOne(id);
	}

	async loadFromFile() {
		console.log('load from file starting');
		const processesFile = __dirname + '/processes.txt';
		const processes = readFileSync(processesFile).toString().split('\n');
		for (const processLine of processes) {
			const hash = processLine.slice(0, 64);
			const processPath = processLine.slice(64);
			// const [items, count] = await this.processRepository.findAndCount({where: {hash}});
			await this.processRepository.save({
				hash: hash.toLocaleUpperCase(),
				originalFilename: path.win32.basename(processPath),
				extension: path.win32.extname(processPath).toLocaleLowerCase(),
				permission: ProcessPermission.ALLOW,
			}).catch(err => {
				console.log(err);
			});
		}
		console.log('finished loads');
	}

	onMessage(dgramSocket: any) {
		// console.log('onMessage Init with policy:', this.defaultPolicy);
		dgramSocket.on('message', async (msg, rinfo) => {
			// tslint:disable-next-line:prefer-const
			let [guid, hostname, filename, hash, requestType, value] = msg.toString('utf8').split('\n');

			console.log(`DgramServer got message: ${msg.toString('utf8')}`);
			let serverResponse = [
				'00',
				hash.toLocaleUpperCase(),
				ActivityResponseMap[ActivityResponse.ERROR],
			];

			if (ActivityRequestMap[+requestType] === 'CHECK_HASH') {
				console.log('!!ActivityRequestMap[+requestType]', ActivityRequestMap[+requestType], ActivityRequestMap[+requestType]);
				let processChallenge = ProcessPermissionMap[ProcessPermission.DENY];

				this.activityService.create({
					guid,
					hostname,
					filename,
					hash,
					address: rinfo.address,
					port: rinfo.port.toString(),
					from: 'CLIENT',
					request: ActivityRequest.CHECK_HASH,
				});

				const findProcess = await this.processRepository.findOne({
					hash,
				});

				if (findProcess) {
					processChallenge = ProcessPermissionMap[findProcess.permission];
				} else {
					this.processRepository.insert({
						hash: hash.toLocaleUpperCase(),
						originalFilename: filename,
						extension: path.win32.extname(filename).toLocaleLowerCase(),
						permission: ProcessPermission.UNKNOWN,
					});
					processChallenge = ProcessPermissionMap[ProcessPermission.UNKNOWN];
				}
				const res = {
					guid,
					hostname,
					filename,
					hash,
					address: rinfo.address,
					port: rinfo.port.toString(),
					from: 'SERVER',
					response: ActivityResponse[ActivityResponseMap[processChallenge]],
				};

				this.activityService.create(res);

				serverResponse = [
					'00',
					hash.toLocaleUpperCase(),
					processChallenge,
				];
			} else if (ActivityRequestMap[+requestType] === 'PROCESS_SET_PERMISSION') {
				const processPermissionMapped = ProcessPermission[ProcessPermissionMap[+value]];
				let processChallenge = ActivityResponse.PROCESS_UNKNOWN;

				if (processPermissionMapped) {
					if (processPermissionMapped === ProcessPermission.ALLOW) {
						processChallenge = ActivityResponse.PROCESS_ALLOW;
					} else {
						processChallenge = ActivityResponse.PROCESS_DENY;
					}
				} else {
					processChallenge = ActivityResponse.ERROR;
				}

				this.activityService.create({
					guid,
					hostname,
					filename,
					hash,
					address: rinfo.address,
					port: rinfo.port.toString(),
					from: 'CLIENT',
					request: ActivityRequest.PROCESS_SET_PERMISSION,
				});

				const findProcess = await this.processRepository.findOne({
					hash,
				});

				if (findProcess) {
					findProcess.permission = processPermissionMapped;
					findProcess.save();
				} else {
					this.processRepository.insert({
						hash: hash.toLocaleUpperCase(),
						originalFilename: filename,
						extension: path.win32.extname(filename).toLocaleLowerCase(),
						permission: processPermissionMapped,
					});
				}

				this.activityService.create({
					guid,
					hostname,
					filename,
					hash,
					address: rinfo.address,
					port: rinfo.port.toString(),
					from: 'SERVER',
					response: processChallenge,
				});

				serverResponse = [
					'00',
					hash.toLocaleUpperCase(),
					ActivityResponseMap[processChallenge],
				];
			} else if (ActivityRequestMap[+requestType] === 'ADMIN_HELP') {
				let activityAdminHelp = ActivityResponse.ADMIN_HELP_UNREGISTER;
				let adminHelpResponse = ActivityResponseAdminHelpMap[activityAdminHelp];

				this.activityService.create({
					guid,
					hostname,
					filename,
					hash,
					address: rinfo.address,
					port: rinfo.port.toString(),
					from: 'CLIENT',
					request: ActivityRequest.ADMIN_HELP,
				});

				const findProcess = await this.processRepository.findOne({
					hash,
				});

				if (findProcess) {
					if (findProcess.adminHelp === ActivityResponse.ADMIN_HELP_UNREGISTER) {
						findProcess.adminHelp = ActivityResponse.ADMIN_HELP_START;
						findProcess.save();
					}
					adminHelpResponse = ActivityResponseAdminHelpMap[findProcess.adminHelp];
					activityAdminHelp = ActivityResponse[ActivityResponseAdminHelpMap[adminHelpResponse]];

					this.activityService.create({
						guid,
						hostname,
						filename,
						hash,
						address: rinfo.address,
						port: rinfo.port.toString(),
						from: 'SERVER',
						response: activityAdminHelp,
					});

					serverResponse = [
						'00',
						hash.toLocaleUpperCase(),
						ProcessPermissionMap[findProcess.permission],
						adminHelpResponse,
					];
				}
			}

			const serverResponseBuffer = Buffer.from(serverResponse.join(''));
			dgramSocket.send(serverResponseBuffer, 0, serverResponseBuffer.length, rinfo.port, rinfo.address);
		});
	}
}