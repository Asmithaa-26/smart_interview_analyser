from moviepy import VideoFileClip

def extract_audio(video_path, output_path='output/audio.wav'):
    with VideoFileClip(video_path) as video:
        video.audio.write_audiofile(output_path)

if __name__ == '__main__':
    extract_audio('sample.mp4')
