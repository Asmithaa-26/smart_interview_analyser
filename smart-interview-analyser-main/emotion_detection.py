from deepface import DeepFace
import os
from collections import Counter

def analyze_emotions(frames_folder="frames"):

    emotions = []

    for file in sorted(os.listdir(frames_folder)):

        img_path = os.path.join(frames_folder, file)

        try:
            result = DeepFace.analyze(
                img_path,
                actions=['emotion'],
                enforce_detection=False
            )

            dominant = result[0]['dominant_emotion']
            emotions.append(dominant)

        except:
            continue

    emotion_counts = Counter(emotions)

    return emotion_counts, emotions