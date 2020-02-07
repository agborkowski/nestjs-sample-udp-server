import { createSocket, BindOptions, SocketOptions, RemoteInfo, Socket } from 'dgram';

import { DGRAM_SOCKET } from './dgram.constants';
import { rejects } from 'assert';

export const createDgramProviders = (
	bindOptions: BindOptions = { address: '127.0.0.1', port: 3000 },
	socketOptions: SocketOptions = { type: 'udp4' },
	onMessage: () => void = () => {},
) => [
	{
		provide: DGRAM_SOCKET,
		useFactory: () => {
			console.log('socketOptions:');
			console.log(socketOptions);
			const socket = createSocket(socketOptions);
			try {
				console.log('bindOptions');
				console.log(bindOptions);
				return new Promise(resolve => socket.bind(bindOptions, () => resolve(socket)));
			} catch (error) {
				rejects(error);
			}
		},
	},
];