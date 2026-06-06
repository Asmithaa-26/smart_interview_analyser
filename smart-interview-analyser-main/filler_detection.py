def count_filler_words(text):
    fillers = ["um", "uh", "like", "basically", "actually"]

    text = text.lower()
    total_fillers = 0

    for word in fillers:
        total_fillers += text.count(word)

    print("\nFiller Words Count:", total_fillers)
    return total_fillers