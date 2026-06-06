import wave

def speech_rate(audio_path, text):
    with wave.open(audio_path, 'r') as f:
        frames = f.getnframes()
        rate = f.getframerate()
        duration = frames / float(rate)

    words = len(text.split())

    wpm = (words / duration) * 60

    return round(wpm, 2)