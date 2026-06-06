from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import shutil
import anthropic
from main import run_analysis

app = FastAPI()

# ✅ Your Anthropic API key
ANTHROPIC_API_KEY = "the-api-key-i-sent-here"

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ─────────────────────────────────────────
# /analyze  (unchanged)
# ─────────────────────────────────────────
@app.post("/analyze")
async def analyze_video(file: UploadFile = File(...)):
    try:
        with open("sample.mp4", "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        results = run_analysis()
        return results
    except Exception as e:
        return {"error": str(e)}


# ─────────────────────────────────────────
# /llm-feedback  ✅ FIXED model name
# ─────────────────────────────────────────
class ScoreData(BaseModel):
    final_score: float
    grammar_score: float
    emotion_score: float
    eye_contact_score: float
    keyword_score: float
    speech_rate: float
    filler_count: int
    text: str


@app.post("/llm-feedback")
async def llm_feedback(data: ScoreData):
    try:
        client = anthropic.Anthropic(api_key=ANTHROPIC_API_KEY)

        prompt = f"""
You are an expert interview coach AI. Analyze this candidate's interview performance and give detailed, specific, personalized feedback.

Interview Scores:
- Final Score: {data.final_score}%
- Grammar Score: {data.grammar_score}%
- Emotion Score: {data.emotion_score}%
- Eye Contact Score: {data.eye_contact_score}%
- Keyword Relevance: {data.keyword_score}%
- Speech Rate: {data.speech_rate} words/min
- Filler Words Used: {data.filler_count}

Candidate's Actual Transcript:
\"\"\"{data.text}\"\"\"

Based on the ACTUAL transcript above, write a structured feedback report:

1. Overall Assessment (2-3 sentences referencing their actual words/content)
2. Strengths (2-3 specific bullet points based on their scores and transcript)
3. Areas for Improvement (2-3 specific bullet points with concrete suggestions)
4. Specific Tips (actionable advice based on what they actually said)
5. Encouragement (1 motivating sentence)

Be specific to THIS candidate. Do not give generic advice.
"""

        message = client.messages.create(
            model="claude-haiku-4-5-20251001",   # ✅ FIXED
            max_tokens=1024,
            messages=[{"role": "user", "content": prompt}]
        )

        return {"llm_feedback": message.content[0].text}

    except Exception as e:
        print(f"LLM feedback error: {e}")
        return {"error": str(e)}


# ─────────────────────────────────────────
# /coach-chat  ✅ FIXED model name
#              ✅ NEW: accepts last_scores context
# ─────────────────────────────────────────
class ChatMessage(BaseModel):
    message: str
    # Optional scores so the coach remembers your last session
    last_scores: Optional[dict] = None


@app.post("/coach-chat")
async def coach_chat(data: ChatMessage):
    try:
        client = anthropic.Anthropic(api_key=ANTHROPIC_API_KEY)

        # Build context block if scores exist
        scores_context = ""
        if data.last_scores:
            scores_context = f"""
The user's most recent interview analysis scores are:
- Final Score: {data.last_scores.get('final_score', 'N/A')}%
- Grammar: {data.last_scores.get('grammar_score', 'N/A')}%
- Emotion: {data.last_scores.get('emotion_score', 'N/A')}%
- Eye Contact: {data.last_scores.get('eye_contact_score', 'N/A')}%
- Keywords: {data.last_scores.get('keyword_score', 'N/A')}%
- Speech Rate: {data.last_scores.get('speech_rate', 'N/A')} wpm
- Filler Words: {data.last_scores.get('filler_count', 'N/A')}

Reference these scores naturally when relevant to personalise your advice.
"""

        system_prompt = f"""You are an expert interview coach. Give short, practical, encouraging advice about job interviews, communication skills, body language, and how to improve interview performance. Keep responses under 5 sentences and be warm and direct.
{scores_context}"""

        message = client.messages.create(
            model="claude-haiku-4-5-20251001",   # ✅ FIXED — fast & cheap for chat
            max_tokens=512,
            system=system_prompt,
            messages=[{"role": "user", "content": data.message}]
        )

        return {"reply": message.content[0].text}

    except Exception as e:
        print(f"Coach chat error: {e}")
        return {"error": str(e), "reply": "Sorry, I couldn't process that. Please try again."}


# ─────────────────────────────────────────
# /generate-question  ✅ NEW — AI Practice questions
# ─────────────────────────────────────────
class QuestionRequest(BaseModel):
    role: Optional[str] = "Software Engineer"
    difficulty: Optional[str] = "medium"   # easy | medium | hard
    category: Optional[str] = "behavioral" # behavioral | technical | hr


@app.post("/generate-question")
async def generate_question(data: QuestionRequest):
    try:
        client = anthropic.Anthropic(api_key=ANTHROPIC_API_KEY)

        prompt = f"""Generate ONE {data.difficulty} {data.category} interview question for a {data.role} role.

Return ONLY a JSON object with this exact structure (no markdown, no extra text):
{{
  "question": "the interview question here",
  "tip": "one short tip on how to answer it well (1 sentence)",
  "time_limit": 90
}}"""

        message = client.messages.create(
            model="claude-haiku-4-5-20251001",
            max_tokens=256,
            messages=[{"role": "user", "content": prompt}]
        )

        import json
        text = message.content[0].text.strip()
        # Strip markdown fences if present
        if text.startswith("```"):
            text = text.split("```")[1]
            if text.startswith("json"):
                text = text[4:]
        parsed = json.loads(text.strip())
        return parsed

    except Exception as e:
        print(f"Question gen error: {e}")
        # Fallback question
        return {
            "question": "Tell me about yourself and why you're interested in this role.",
            "tip": "Use the Present-Past-Future structure: where you are now, how you got here, and where you're going.",
            "time_limit": 90
        }