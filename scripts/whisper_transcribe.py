import whisper
import sys
import time

if len(sys.argv) < 2:
    print("Video path not provided", file=sys.stderr)
    sys.exit(1)

file_path = sys.argv[1]
start = time.time()
print("Loading model...", file=sys.stderr)
model = whisper.load_model("tiny").to("cpu")  # use "cuda" if GPU available

print("Transcribing...", file=sys.stderr)
result = model.transcribe(file_path, word_timestamps=False)

print("Done in", time.time() - start, "seconds", file=sys.stderr)
print(result["text"])
