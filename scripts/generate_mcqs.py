from fastapi import FastAPI
from pydantic import BaseModel
from typing import List
import re

app = FastAPI()

class TranscriptInput(BaseModel):
    transcript: List[str]

def extract_mcqs_from_transcript(transcript: List[str]):
    questions = []
    question_starters = ["What is", "What are", "Difference between", "Explain", "Define"]

    text = " ".join(transcript)
    sentences = re.split(r'(?<=[.?]) +', text)

    for i, sentence in enumerate(sentences):
        if any(sentence.strip().startswith(qs) for qs in question_starters):
            question = sentence.strip()
            answer = sentences[i + 1].strip() if i + 1 < len(sentences) else "Answer not found"

            options = [answer]
            for opt in ["Option A", "Option B", "Option C"]:
                if opt not in options:
                    options.append(opt)

            questions.append({
                "question": question,
                "options": options[:4],  
                "answer": answer
            })

    return questions

@app.post("/generate-mcqs")
async def generate_mcqs(data: TranscriptInput):
    transcript = data.transcript
    mcqs = extract_mcqs_from_transcript(transcript)
    return {"mcqs": mcqs}
