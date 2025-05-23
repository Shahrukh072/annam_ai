import { Request, Response } from "express";
import { transcribeAudio  } from "../services/transcription.service";
import { generateQuestions } from "../services/question.service";
import { Video } from "../models/video.model";

export const uploadVideo = async (req: Request, res: Response) => {
  try {
    const filePath = req.file?.path!;
    const whisperText = await transcribeAudio(filePath);

    const segments = segmentTranscript(whisperText, 300); // 5 mins = 300 sec
   const questions = await generateQuestions(segments, req.file?.originalname!, filePath);

    const newVideo = await Video.create({
      filename: req.file?.originalname,
      path: filePath,
      transcript: segments,
      questions,
    });

    res.status(200).json(newVideo);
  } catch (error) {
    console.error('[UploadVideo Error]', error);
    res.status(500).json({ message: 'Error processing video', error });
  }
};


const segmentTranscript = (text: string, minutes: number): string[] => {
  const words = text.split(" ");
  const wordsPerSegment = minutes * 60 * 2; // 2 words/sec estimate
  const segments: string[] = [];

  for (let i = 0; i < words.length; i += wordsPerSegment) {
    segments.push(words.slice(i, i + wordsPerSegment).join(" "));
  }

  return segments;
};




