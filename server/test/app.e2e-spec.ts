import { Test } from '@nestjs/testing';
import { AppModule } from './../src/app.module';
import { INestApplication } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';

import { DgramModule } from '../src/dgram/dgram.module';

import { createSocket, Socket } from 'dgram';

import { Connection } from 'typeorm';
import { Process } from '../src/process/process.entity';

import 'jest';

import { ProcessPermission } from '../src/process/interfaces/process.interface';

describe('AppController (e2e)', () => {
	let app: INestApplication;
	let dgramSocketClient: Socket;

	beforeAll(async () => {
		jest.setTimeout(9000);

		const moduleFixture = await Test.createTestingModule({
			imports: [
				// DgramModule.forRoot(),
				// TypeOrmModule.forRoot(),
				AppModule,
			],
		}).compile();

		app = moduleFixture.createNestApplication();
		await app.init();

		dgramSocketClient = await createSocket('udp4');

		const processRepository = await app.get(Connection).getRepository(Process);

		// clear test db be sure its a test env :)
		const allProcess = await processRepository.find();
		await processRepository.remove(allProcess);

		// seed db
		await processRepository.insert([{
			hash: 'TEST_HASH_EXIST_DENY',
			originalFilename: 'test.exe',
			permission: ProcessPermission.DENY,
			extension: '.exe',
		}, {
			hash: 'TEST_HASH_EXIST_ALLOW',
			originalFilename: 'test.exe',
			permission: ProcessPermission.ALLOW,
			extension: '.exe',
		}]);
	});

	it('Process exists in db and should be deny by setup status', async (done) => {
		const clientRequestBuffer = Buffer.from(`guid\nhostname\nfilename.dll\nTEST_HASH_EXIST_DENY\n0`);
		dgramSocketClient.send(clientRequestBuffer, 0, clientRequestBuffer.length, 3000, '127.0.0.1', (err, bytes) => {
			if (err) {
				console.error(`Error sent to client`, err);
			}
			dgramSocketClient.on('message', (message) => {
				expect(message.toString()).toBe('00TEST_HASH_EXIST_DENY2');
				dgramSocketClient.removeAllListeners();
				done();
			});
		});
	});

	it('Process exists in db and should be allow by setup status', async (done) => {
		const clientRequestBuffer = Buffer.from(`guid\nhostname\nfilename.dll\nTEST_HASH_EXIST_ALLOW\n0`);
		dgramSocketClient.send(clientRequestBuffer, 0, clientRequestBuffer.length, 3000, '127.0.0.1', (err, bytes) => {
			if (err) {
				console.error(`Error sent to client`, err);
			}
			dgramSocketClient.on('message', (message) => {
				expect(message.toString()).toBe('00TEST_HASH_EXIST_ALLOW1');
				dgramSocketClient.removeAllListeners();
				done();
			});
		});
	});

	it('Process is new and should be set as unknown process', async (done) => {
		const clientRequestBuffer = Buffer.from(`guid\nhostname\nfilename.dll\nTEST_HASH_UNKNOWN\n0`);
		dgramSocketClient.send(clientRequestBuffer, 0, clientRequestBuffer.length, 3000, '127.0.0.1', (err, bytes) => {
			if (err) {
				console.error(`Error sent to client`, err);
			}
			dgramSocketClient.on('message', (message) => {
				expect(message.toString()).toBe('00TEST_HASH_UNKNOWN0');
				dgramSocketClient.removeAllListeners();
				done();
			});
		});
	});

	it('Setup new process in db by "REQUEST_SET_PERMISSION" from desktop client', async (done) => {
		const clientRequestBuffer = Buffer.from(`guid\nhostname\nfilename.dll\nTEST_HASH_NEW\n2\n1`);
		dgramSocketClient.send(clientRequestBuffer, 0, clientRequestBuffer.length, 3000, '127.0.0.1', (err, bytes) => {
			if (err) {
				console.error(`Error sent to client`, err);
			}
			dgramSocketClient.on('message', (message) => {
				expect(message.toString()).toBe('00TEST_HASH_NEW1');
				dgramSocketClient.removeAllListeners();
				done();
			});
		});
	});

	it('Update new process in db by "REQUEST_SET_PERMISSION" from desktop client to deny', async (done) => {
		const clientRequestBuffer = Buffer.from(`guid\nhostname\nfilename.dll\nTEST_HASH_NEW\n2\n2`);
		dgramSocketClient.send(clientRequestBuffer, 0, clientRequestBuffer.length, 3000, '127.0.0.1', (err, bytes) => {
			if (err) {
				console.error(`Error sent to client`, err);
			}
			dgramSocketClient.on('message', (message) => {
				expect(message.toString()).toBe('00TEST_HASH_NEW2');
				dgramSocketClient.removeAllListeners();
				done();
			});
		});
	});

	it('Log down client activity "REQUEST_ADMIN_HELP" from desktop client in db', async (done) => {
		const clientRequestBuffer = Buffer.from(`guid\nhostname\nfilename.dll\nTEST_HASH_NEW\n1`);
		dgramSocketClient.send(clientRequestBuffer, 0, clientRequestBuffer.length, 3000, '127.0.0.1', (err, bytes) => {
			if (err) {
				console.error(`Error sent to client`, err);
			}
			dgramSocketClient.on('message', (message) => {
				expect(message.toString()).toBe('00TEST_HASH_NEW11');
				dgramSocketClient.removeAllListeners();
				done();
			});
		});
	});

	// it('Function should return last connected clients', async (done) => {

	// });
});