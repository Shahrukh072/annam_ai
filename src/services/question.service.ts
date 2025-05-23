import axios from 'axios';
import { Video } from '../models/video.model'; 

interface MCQ {
  question: string;
  options: string[];
  answer: string;
}

interface QuestionSegment {
  segment: number;
  mcqs: MCQ[];
}

export const generateQuestions = async (
  segments: string[],
  uploadedFileName: string,
  uploadedPath: string
) => {
  try {
    const questions: QuestionSegment[] = [];

    for (let i = 0; i < segments.length; i++) {
      const segmentText = segments[i];

      const transcriptList = segmentText.split('. ').filter(s => s.trim().length > 0);

      const mcqResponse = await axios.post('http://localhost:8000/generate-mcqs', {
        transcript: transcriptList,
      });

      const mcqs: MCQ[] = mcqResponse.data.mcqs;

      questions.push({
        segment: i,
        mcqs,
      });
    }

    await Video.create({
      filename: uploadedFileName,
      path: uploadedPath,
      transcript: segments,
      questions,
    });

    return questions;
  } catch (error: any) {
    console.error('[MCQ Generation Error]', error.response?.data || error.message);
    throw new Error('Failed to generate MCQs from Python server');
  }
};
