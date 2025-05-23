import { spawn } from 'child_process';
import path from 'path';

export const transcribeAudio = (filePath: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const scriptPath = path.join(__dirname, '../../scripts/whisper_transcribe.py');
    const pythonProcess = spawn('python', [scriptPath, filePath]);

    let transcript = '';
    let errorOutput = '';

    const timeout = setTimeout(() => {
      pythonProcess.kill();
      reject(new Error("Transcription timed out"));
    }, 5 * 60 * 1000); // 5 minutes timeout

    pythonProcess.stdout.on('data', (data) => {
      transcript += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
      console.log('[Python STDERR]', data.toString());
      errorOutput += data.toString();
    });

    pythonProcess.on('close', (code) => {
      clearTimeout(timeout);
      if (code === 0) {
        resolve(transcript.trim());
      } else {
        reject(new Error(`Whisper process exited with code ${code}: ${errorOutput}`));
      }
    });
  });
};
