import { NextApiRequest, NextApiResponse } from 'next';
import { spawn } from 'child_process';

//
export default function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method !== 'POST') {
		res.status(405).json({ error: 'Method not allowed' });
		return;
	}

	const { message } = req.body;

	if (!message) {
		res.status(400).json({ error: 'Message parameter is required' });
		return;
	}

	res.setHeader('Cache-Control', 'no-cache, no-transform');
	res.setHeader('Connection', 'keep-alive');
	res.setHeader('Content-Type', 'text/event-stream');
	res.flushHeaders();

	//const pythonProcess = spawn('python', ['-u', './src/python/message.py', message as string]);
	const pythonProcess = spawn('python3', ['-u', './src/python/test_nebula_minecraft.py', message as string]);

	//const pythonProcess = spawn('python', ['-u', './src/python/test_infer.py', message as string]);

	pythonProcess.stdout.on('data', (data) => {
		res.write(`data: ${data.toString().trim()}\n\n`);
	});

	pythonProcess.stderr.on('data', (data) => {
		res.write(`error: ${data.toString().trim()}\n\n`);
		console.error(data.toString().trim());
	});

	pythonProcess.on('close', (code) => {
		res.write(`process exited with code ${code}\n\n`);
		res.end();
	});

	res.on('close', () => {
		pythonProcess.kill();
		res.end();
	});
}
