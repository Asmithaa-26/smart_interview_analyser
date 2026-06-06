import cv2
import os

def eye_contact_score(frames_folder="frames"):

    face_cascade = cv2.CascadeClassifier(
        cv2.data.haarcascades + "haarcascade_frontalface_default.xml"
    )

    total_frames = 0
    face_frames = 0

    for file in os.listdir(frames_folder):

        img_path = os.path.join(frames_folder, file)

        img = cv2.imread(img_path)

        if img is None:
            continue

        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

        faces = face_cascade.detectMultiScale(gray, 1.3, 5)

        total_frames += 1

        if len(faces) > 0:
            face_frames += 1

    if total_frames == 0:
        return 0, 0, 0

    score = (face_frames / total_frames) * 100

    return round(score, 2), face_frames, total_frames