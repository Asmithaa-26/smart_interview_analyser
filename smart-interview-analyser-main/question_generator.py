import random

questions = [
    "Tell me about yourself.",
    "What are your strengths?",
    "Explain Python programming language.",
    "Describe a challenging project you worked on.",
    "Why do you want this job?",
    "Explain object oriented programming.",
    "What is machine learning?"
]

def generate_question():

    return random.choice(questions)