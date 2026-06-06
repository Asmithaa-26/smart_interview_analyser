def calculate_emotion_score(emotion_counts):
    total = sum(emotion_counts.values())

    if total == 0:
        return 0

    happy = emotion_counts.get('happy', 0)
    neutral = emotion_counts.get('neutral', 0)

    score = ((happy * 1.0) + (neutral * 0.5)) / total

    return round(score * 100, 2)


def calculate_filler_score(filler_count, text):
    words = len(text.split())

    if words == 0:
        return 0

    rate = filler_count / words

    score = max(0, 100 - (rate * 200))

    return round(score, 2)


def final_score(emotion_score, filler_score):
    return round((emotion_score * 0.6 + filler_score * 0.4), 2)

def communication_score(text):
    words = text.split()
    length = len(words)

    # simple logic
    if length > 50:
        score = 90
    elif length > 20:
        score = 70
    else:
        score = 50

    return score