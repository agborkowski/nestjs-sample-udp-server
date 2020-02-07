import { Module, DynamicModule } from '@nestjs/common';

import { createDgramProviders } from './dgram.providers';
import { DgramService } from './dgram.service';

import { SocketOptions, BindOptions } from 'dgram';

@Module({
	providers: [DgramService],
	exports: [DgramService],
})
export class DgramModule {
	static forRoot(
		bindOptions: BindOptions = { address: '127.0.0.1', port: 3000 },
		socketOptions: SocketOptions = { type: 'udp4' },
		onMessage: () => void = () => {},
	): DynamicModule {
		const providers = createDgramProviders(bindOptions, socketOptions, onMessage);
		return {
			module: DgramModule,
			providers: [...providers],
			exports: [...providers],
		};
	}
}