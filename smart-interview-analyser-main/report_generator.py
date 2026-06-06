def generate_interview_report(results):

    report = []

    report.append("INTERVIEW PERFORMANCE REPORT\n")

    report.append(f"Overall Confidence Score: {results['final_score']}%\n")

    report.append("Strengths:")

    if results["speech_rate"] >= 110 and results["speech_rate"] <= 160:
        report.append("- Good speaking pace")

    if results["grammar_score"] >= 80:
        report.append("- Strong grammar usage")

    if results["eye_contact_score"] >= 70:
        report.append("- Maintains good eye contact")

    if results["answer_score"] >= 70:
        report.append("- Relevant and structured answer")

    report.append("\nAreas for Improvement:")

    if results["filler_count"] > 5:
        report.append("- Reduce filler words")

    if results["grammar_score"] < 70:
        report.append("- Improve sentence grammar")

    if results["eye_contact_score"] < 60:
        report.append("- Maintain better eye contact")

    if results["topic_score"] < 60:
        report.append("- Stay focused on the interview question")

    report.append("\nRecommendation:")
    report.append("Practice structured answers and maintain confident body language.")

    return "\n".join(report)