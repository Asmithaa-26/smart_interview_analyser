import cv2

def record_interview(filename="sample.mp4", duration=30):

    cap = cv2.VideoCapture(0)

    width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))

    fourcc = cv2.VideoWriter_fourcc(*'mp4v')
    out = cv2.VideoWriter(filename, fourcc, 20.0, (width, height))

    frame_count = 0
    max_frames = duration * 20

    while frame_count < max_frames:

        ret, frame = cap.read()

        if not ret:
            break

        out.write(frame)

        cv2.imshow("Recording Interview", frame)

        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

        frame_count += 1

    cap.release()
    out.release()
    cv2.destroyAllWindows()

    return filename