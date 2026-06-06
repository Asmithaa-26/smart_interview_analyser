def keyword_score(text):

    keywords = [
        "python",
        "programming",
        "language",
        "data",
        "development",
        "software",
        "presentation",
        "candidate",
        "author"
    ]

    text = text.lower()

    count = sum(1 for word in keywords if word in text)

    score = (count / len(keywords)) * 100

    return round(score, 2), count