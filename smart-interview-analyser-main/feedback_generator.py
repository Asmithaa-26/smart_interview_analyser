def generate_feedback(results):

    feedback = []

    if results["grammar_score"] < 70:
        feedback.append("Work on grammar clarity in your sentences.")

    if results["filler_count"] > 5:
        feedback.append("Reduce filler words like 'um' and 'uh'.")

    if results["speech_rate"] < 90:
        feedback.append("Try speaking slightly faster to sound more confident.")

    if results["speech_rate"] > 180:
        feedback.append("You are speaking too fast. Slow down slightly.")

    if results["eye_contact_score"] < 60:
        feedback.append("Maintain better eye contact with the camera.")

    if results["answer_score"] < 60:
        feedback.append("Your answer could include more relevant technical details.")

    if not feedback:
        feedback.append("Great performance overall!")

    return feedback