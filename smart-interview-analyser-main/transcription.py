import whisper

def transcribe_audio(audio_path='audio.wav'):
    model = whisper.load_model('base')
    result = model.transcribe(audio_path)
    print(result['text'])
    return result['text']
    transcribe_audio()
