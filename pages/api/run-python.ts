import { NextApiRequest, NextApiResponse } from 'next';
import { spawn } from 'child_process';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
	res.setHeader('Cache-Control', 'no-cache, no-transform');
	res.setHeader('Connection', 'keep-alive');
	res.setHeader('Content-Type', 'text/event-stream');
	res.flushHeaders();

	const pythonProcess = spawn('python', ['-u', './src/python/test_websocket.py']);

	pythonProcess.stdout.on('data', (data) => {
		res.write(`data: ${data.toString().trim()}\n\n`);
	});

	res.on('close', () => {
		pythonProcess.kill();
		res.end();
	});
}
