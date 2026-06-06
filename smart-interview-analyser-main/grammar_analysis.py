import language_tool_python

tool = language_tool_python.LanguageTool('en-US')

def grammar_score(text):
    matches = tool.check(text)
    error_count = len(matches)

    words = len(text.split())

    if words == 0:
        return 0

    # simple grammar score
    score = max(0, 100 - (error_count / words) * 100)

    return round(score, 2), error_count