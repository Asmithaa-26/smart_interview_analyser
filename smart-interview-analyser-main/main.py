from grammar_analysis import grammar_score
from video_processing import extract_frames
from audio_extraction import extract_audio
from speech_to_text import transcribe_audio
from filler_detection import count_filler_words
from emotion_detection import analyze_emotions
from scoring import calculate_emotion_score, calculate_filler_score, final_score
from answer_analysis import calculate_answer_similarity
from scoring import communication_score
from speech_analysis import speech_rate
from keyword_analysis import keyword_score
from eye_contact_analysis import eye_contact_score
from feedback_generator import generate_feedback
from topic_analysis import topic_relevance
from report_generator import generate_interview_report

def run_analysis():
    # Step 1: Extract frames
    extract_frames("sample.mp4")

    # Step 2: Extract audio
    extract_audio("sample.mp4")

    # Step 3: Speech to text
    text = transcribe_audio("output/audio.wav")

    keyword, keyword_matches = keyword_score(text)

    grammar, grammar_errors = grammar_score(text)

    # Step 4: Filler detection
    filler_count = count_filler_words(text)

    # Step 5: Emotion detection
    emotion_counts, emotion_timeline = analyze_emotions()

    eye_score, face_frames, total_frames = eye_contact_score()

    # Step 6: Scores
    emotion_score = calculate_emotion_score(emotion_counts)
    filler_score = calculate_filler_score(filler_count, text)

    answer_score = calculate_answer_similarity(
        text,
        "Python is a high-level programming language used for web development, data science, and automation."
    )

    comm_score = communication_score(text)

    rate = speech_rate("output/audio.wav", text)

    topic_score = topic_relevance(text, "Explain Python programming language")

    feedback = []

    if filler_count > 5:
        feedback.append("Reduce filler words")

    if emotion_score < 50:
        feedback.append("Improve facial expressions")

    if answer_score < 60:
        feedback.append("Improve answer quality")

    if comm_score < 60:
        feedback.append("Improve communication clarity")

    if not feedback:
        feedback.append("Excellent performance!")

    final = final_score(emotion_score, filler_score)

    feedback_report = generate_feedback({
    "grammar_score": grammar,
    "filler_count": filler_count,
    "speech_rate": rate,
    "eye_contact_score": eye_score,
    "answer_score": answer_score,
    
})
    report = generate_interview_report({
    "final_score": final,
    "speech_rate": rate,
    "grammar_score": grammar,
    "eye_contact_score": eye_score,
    "answer_score": answer_score,
    "filler_count": filler_count,
    "topic_score": topic_score
})

    return {
    "text": text,
    "filler_count": filler_count,
    "emotions": emotion_counts,
    "emotion_score": emotion_score,
    "emotion_timeline": emotion_timeline,
    "filler_score": filler_score,
    "answer_score": answer_score,
    "communication_score": comm_score,
    "speech_rate": rate,
    "grammar_score": grammar,
    "grammar_errors": grammar_errors,
    "keyword_score": keyword,
    "keyword_matches": keyword_matches,
    "eye_contact_score": eye_score,
    "face_frames": face_frames,
    "total_frames": total_frames,
    "final_score": final,
    "feedback": feedback,
    "ai_feedback": feedback_report,
    "topic_score": topic_score,
    "report": report
}

if __name__ == "__main__":
    run_analysis()
