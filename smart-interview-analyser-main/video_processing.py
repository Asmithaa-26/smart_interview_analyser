import cv2
import os

def extract_frames(video_path, output_folder='frames'):
    os.makedirs(output_folder, exist_ok=True)

    cap = cv2.VideoCapture(video_path)

    if not cap.isOpened():
        print("Error: Cannot open video file")
        return

    fps = int(cap.get(cv2.CAP_PROP_FPS))
    frame_count = 0
    saved_count = 0

    while True:
        ret, frame = cap.read()
        if not ret:
            break

        if frame_count % fps == 0:
            cv2.imwrite(f"{output_folder}/frame_{saved_count:04d}.jpg", frame)
            saved_count += 1

        frame_count += 1   # ✅ VERY IMPORTANT

    cap.release()          # ✅ VERY IMPORTANT

    print(f"Extracted {saved_count} frames to {output_folder}/")


if __name__ == "__main__":
    extract_frames("sample.mp4")