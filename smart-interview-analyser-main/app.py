import streamlit as st
from main import run_analysis
import matplotlib.pyplot as plt
from webcam_recorder import record_interview
from question_generator import generate_question
from confidence_heatmap import render_confidence_heatmap

# Page settings
st.set_page_config(
    page_title="Smart Interview Analyzer",
    layout="wide"
)

st.title("🎯 Smart Interview Analyzer")

# -------------------------
# Interview Question Generator
# -------------------------

st.subheader("🎤 Interview Question")

if st.button("Generate Interview Question"):
    question = generate_question()
    st.session_state.question = question

if "question" in st.session_state:
    st.write(st.session_state.question)

# -------------------------
# Webcam Recording
# -------------------------

if st.button("🎥 Record Interview (30 sec)"):
    with st.spinner("Recording..."):
        record_interview()

    st.success("Recording complete!")

# -------------------------
# Upload Video
# -------------------------

uploaded_file = st.file_uploader("Upload Video", type=["mp4"])

if uploaded_file:

    with open("sample.mp4", "wb") as f:
        f.write(uploaded_file.read())

    st.success("Video uploaded successfully!")

    if st.button("🚀 Analyze Interview"):

        with st.spinner("Analyzing interview..."):
            st.session_state.results = run_analysis()

# -------------------------
# Display Results
# -------------------------

if "results" in st.session_state:

    results = st.session_state.results

    st.success("Analysis Complete!")

    # -------------------------
    # Final Score
    # -------------------------

    st.subheader("📊 Final Score")
    st.metric("Confidence Score", results["final_score"])

    # -------------------------
    # Answer Accuracy
    # -------------------------

    st.subheader("🧠 Answer Accuracy")
    st.metric("Answer Score", results["answer_score"])

    # -------------------------
    # Communication Score
    # -------------------------

    st.subheader("🗣 Communication Score")
    st.metric("Communication", results["communication_score"])

    # -------------------------
    # Speech Rate
    # -------------------------

    st.subheader("⚡ Speech Rate")
    st.metric("Words per Minute", results["speech_rate"])

    # -------------------------
    # Transcript
    # -------------------------

    st.subheader("📝 Transcript")
    st.write(results["text"])

    # -------------------------
    # Filler Words
    # -------------------------

    st.subheader("🚫 Filler Words")
    st.write(results["filler_count"])

    # -------------------------
    # Emotion Breakdown
    # -------------------------

    st.subheader("😄 Emotions")
    st.write(results["emotions"])

    # -------------------------
    # Emotion Pie Chart
    # -------------------------

    st.subheader("📊 Emotion Distribution")

    emotions = results["emotions"]

    labels = list(emotions.keys())
    values = list(emotions.values())

    fig, ax = plt.subplots()
    ax.pie(values, labels=labels, autopct='%1.1f%%')

    st.pyplot(fig)

    # -------------------------
    # Confidence Trend Graph
    # -------------------------

    st.subheader("📈 Confidence Trend")

    timeline = results["emotion_timeline"]

    emotion_map = {
        "happy": 3,
        "neutral": 2,
        "sad": 1,
        "angry": 1,
        "fear": 1
    }

    trend_values = [emotion_map.get(e, 2) for e in timeline]

    fig2, ax2 = plt.subplots()

    ax2.plot(trend_values)
    ax2.set_ylabel("Confidence Level")
    ax2.set_xlabel("Interview Time")

    st.pyplot(fig2)

    # -------------------------
    # Confidence Heatmap
    # -------------------------

    render_confidence_heatmap(results)

    # -------------------------
    # Feedback
    # -------------------------

    st.subheader("💡 Feedback")

    for f in results["feedback"]:
        st.write(f"• {f}")

    # -------------------------
    # Grammar Analysis
    # -------------------------

    st.subheader("✍️ Grammar Analysis")

    st.metric("Grammar Score", results["grammar_score"])
    st.write("Grammar Errors:", results["grammar_errors"])

    # -------------------------
    # Keyword Relevance
    # -------------------------

    st.subheader("🎯 Keyword Relevance")

    st.metric("Keyword Score", results["keyword_score"])
    st.write("Keywords Used:", results["keyword_matches"])

    # -------------------------
    # Eye Contact
    # -------------------------

    st.subheader("👀 Eye Contact Analysis")

    st.metric("Eye Contact Score", results["eye_contact_score"])

    st.write(
        f"Face detected in {results['face_frames']} out of {results['total_frames']} frames"
    )

    # -------------------------
    # AI Feedback
    # -------------------------

    st.subheader("🤖 AI Interview Feedback")

    for f in results["ai_feedback"]:
        st.write("•", f)

    # -------------------------
    # Topic Relevance
    # -------------------------

    st.subheader("🧠 Topic Relevance")

    st.metric("Topic Score", results["topic_score"])

    # -------------------------
    # AI Report
    # -------------------------

    st.subheader("📄 AI Interview Evaluation Report")

    st.text(results["report"])