import whisper
from filler_detection import count_filler_words
def transcribe_audio(audio_path):
    model = whisper.load_model("base")
    result = model.transcribe(audio_path)

    

    print("Transcript:")
    print(result["text"])

    return result["text"]

if __name__ == "__main__":
    text = transcribe_audio("output/audio.wav")
    count_filler_words(text)