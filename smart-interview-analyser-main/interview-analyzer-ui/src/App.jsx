import { useState, useEffect, useRef } from "react";
import axios from "axios";
import Webcam from "react-webcam";
import { jsPDF } from "jspdf";

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  RadialLinearScale,
  BarElement,
  Filler
} from "chart.js";

import { Pie, Line, Radar, Bar } from "react-chartjs-2";

ChartJS.register(
  ArcElement, Tooltip, Legend,
  CategoryScale, LinearScale,
  PointElement, LineElement,
  RadialLinearScale, BarElement, Filler
);

// ─────────────────────────────────────────
// 🏆 UPGRADE 1: Badge system
// ─────────────────────────────────────────
function getBadge(score) {
  if (score >= 90) return { label: "Expert",       emoji: "🏆", color: "text-yellow-400",  bg: "bg-yellow-400/10 border-yellow-400/40" };
  if (score >= 75) return { label: "Advanced",     emoji: "💎", color: "text-blue-400",    bg: "bg-blue-400/10 border-blue-400/40" };
  if (score >= 60) return { label: "Intermediate", emoji: "⭐", color: "text-green-400",   bg: "bg-green-400/10 border-green-400/40" };
  if (score >= 40) return { label: "Beginner",     emoji: "🌱", color: "text-orange-400",  bg: "bg-orange-400/10 border-orange-400/40" };
  return               { label: "Novice",          emoji: "🎯", color: "text-gray-400",    bg: "bg-gray-400/10 border-gray-400/40" };
}

function BadgeCard({ score }) {
  const badge = getBadge(score);
  return (
    <div className={`dashboard-card max-w-xs text-center border ${badge.bg}`}>
      <div className="text-5xl mb-2">{badge.emoji}</div>
      <p className={`text-xl font-bold ${badge.color}`}>{badge.label}</p>
      <p className="text-gray-400 text-xs mt-1">Performance Level</p>
      <div className="mt-3 bg-white/10 rounded-full h-2 w-full overflow-hidden">
        <div
          className="h-2 rounded-full transition-all duration-1000"
          style={{
            width: `${Math.min(score, 100)}%`,
            background: "linear-gradient(90deg, #3b82f6, #a855f7)"
          }}
        />
      </div>
      <p className="text-xs text-gray-400 mt-1">{score}% overall</p>
    </div>
  );
}

// ─────────────────────────────────────────
// 💬 UPGRADE 2: AI Coach with score memory
// ─────────────────────────────────────────
function AICoach({ lastScores }) {
  const [messages, setMessages] = useState([
    {
      role: "ai",
      text: lastScores
        ? `Hi! I'm your AI Interview Coach 👋 I can see your latest scores — your final score was ${lastScores.final_score}%. Ask me anything and I'll give you personalised advice!`
        : "Hi! I'm your AI Interview Coach 👋 Ask me anything about interview preparation, tips, or how to improve your score."
    }
  ]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    const userMsg = input.trim();
    if (!userMsg) return;

    setMessages(prev => [...prev, { role: "user", text: userMsg }]);
    setInput("");
    setThinking(true);

    try {
      const res = await axios.post("http://127.0.0.1:8000/coach-chat", {
        message: userMsg,
        last_scores: lastScores || null   // ✅ sends scores for personalised advice
      });
      setMessages(prev => [...prev, { role: "ai", text: res.data.reply }]);
    } catch {
      setMessages(prev => [...prev, { role: "ai", text: "Sorry, I couldn't connect to the AI right now. Please check your backend." }]);
    }

    setThinking(false);
  };

  // Quick prompt chips
  const chips = lastScores
    ? ["How can I improve my score?", "Tips for eye contact", "Reduce filler words", "Body language advice"]
    : ["Tell me about STAR method", "How to handle nerves", "Salary negotiation tips", "Common mistakes to avoid"];

  return (
    <div className="dashboard-card max-w-2xl flex flex-col" style={{ height: "560px" }}>
      {/* Score context banner */}
      {lastScores && (
        <div className="mb-3 px-3 py-2 rounded-lg bg-blue-500/10 border border-blue-500/30 text-xs text-blue-300 flex gap-3 flex-wrap">
          <span>📊 Last session:</span>
          <span>Final {lastScores.final_score}%</span>
          <span>·</span>
          <span>Grammar {lastScores.grammar_score}%</span>
          <span>·</span>
          <span>Eye Contact {lastScores.eye_contact_score}%</span>
          <span>·</span>
          <span>Emotion {lastScores.emotion_score}%</span>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto mb-3 space-y-3 pr-1">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`px-4 py-2 rounded-2xl text-sm max-w-sm leading-relaxed whitespace-pre-wrap
              ${m.role === "user"
                ? "bg-blue-500 text-white rounded-br-none"
                : "bg-white/10 text-gray-200 rounded-bl-none"}`}>
              {m.text}
            </div>
          </div>
        ))}
        {thinking && (
          <div className="flex justify-start">
            <div className="bg-white/10 text-gray-400 px-4 py-2 rounded-2xl text-sm animate-pulse">
              Coach is thinking...
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Quick chips */}
      <div className="flex gap-2 flex-wrap mb-2">
        {chips.map((c, i) => (
          <button
            key={i}
            onClick={() => { setInput(c); }}
            className="text-xs px-3 py-1 rounded-full bg-white/10 text-gray-300 hover:bg-blue-500/30 hover:text-blue-200 transition-colors border border-white/10"
          >
            {c}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="flex gap-2">
        <input
          className="flex-1 bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-sm text-white placeholder-gray-400 outline-none focus:border-blue-400"
          placeholder="Ask your interview coach..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && sendMessage()}
        />
        <button onClick={sendMessage} className="primary-btn text-sm">Send</button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────
// 🎯 UPGRADE 3: AI Practice Mode
// ─────────────────────────────────────────
function PracticeMode() {
  const [question, setQuestion] = useState(null);
  const [loadingQ, setLoadingQ] = useState(false);
  const [role, setRole] = useState("Software Engineer");
  const [difficulty, setDifficulty] = useState("medium");
  const [category, setCategory] = useState("behavioral");
  const [timer, setTimer] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [recording, setRecording] = useState(false);
  const intervalRef = useRef(null);
  const webcamRef = useRef(null);

  const fetchQuestion = async () => {
    setLoadingQ(true);
    setQuestion(null);
    setTimer(null);
    clearInterval(intervalRef.current);
    try {
      const res = await axios.post("http://127.0.0.1:8000/generate-question", {
        role, difficulty, category
      });
      setQuestion(res.data);
    } catch {
      setQuestion({
        question: "Tell me about a challenging project you worked on and how you overcame obstacles.",
        tip: "Use the STAR method: Situation, Task, Action, Result.",
        time_limit: 90
      });
    }
    setLoadingQ(false);
  };

  const startTimer = () => {
    if (!question) return;
    setTimeLeft(question.time_limit);
    setRecording(true);
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          setRecording(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const stopTimer = () => {
    clearInterval(intervalRef.current);
    setRecording(false);
    setTimeLeft(0);
  };

  const timerColor = timeLeft > 30 ? "#22c55e" : timeLeft > 10 ? "#eab308" : "#ef4444";

  return (
    <div>
      <h1 className="page-title">🎯 Practice Mode</h1>
      <p className="text-gray-400 mb-6 text-sm">Get AI-generated interview questions tailored to your role and practice with the webcam.</p>

      {/* Controls */}
      <div className="dashboard-card mb-6 flex gap-4 flex-wrap items-end">
        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-400">Role</label>
          <input
            className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-blue-400 w-48"
            value={role}
            onChange={e => setRole(e.target.value)}
            placeholder="e.g. Data Scientist"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-400">Difficulty</label>
          <select
            className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-blue-400"
            value={difficulty}
            onChange={e => setDifficulty(e.target.value)}
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-gray-400">Category</label>
          <select
            className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-blue-400"
            value={category}
            onChange={e => setCategory(e.target.value)}
          >
            <option value="behavioral">Behavioral</option>
            <option value="technical">Technical</option>
            <option value="hr">HR</option>
            <option value="situational">Situational</option>
          </select>
        </div>
        <button onClick={fetchQuestion} className="primary-btn" disabled={loadingQ}>
          {loadingQ ? "⏳ Generating..." : "🎲 Get Question"}
        </button>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Question card */}
        <div className="flex flex-col gap-4">
          {question ? (
            <div className="dashboard-card border border-blue-500/30">
              <div className="flex items-center gap-2 mb-3">
                <span className={`text-xs px-2 py-1 rounded-full font-semibold
                  ${difficulty === "easy" ? "bg-green-500/20 text-green-400"
                  : difficulty === "medium" ? "bg-yellow-500/20 text-yellow-400"
                  : "bg-red-500/20 text-red-400"}`}>
                  {difficulty.toUpperCase()}
                </span>
                <span className="text-xs px-2 py-1 rounded-full bg-blue-500/20 text-blue-400 font-semibold">
                  {category.toUpperCase()}
                </span>
              </div>
              <p className="text-white text-base font-medium leading-relaxed mb-4">
                ❓ {question.question}
              </p>
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg px-4 py-3 text-sm text-blue-300">
                💡 <strong>Tip:</strong> {question.tip}
              </div>

              {/* Timer */}
              <div className="mt-4 flex items-center gap-4">
                {!recording ? (
                  <button onClick={startTimer} className="primary-btn text-sm">
                    ▶ Start Timer ({question.time_limit}s)
                  </button>
                ) : (
                  <button onClick={stopTimer} className="secondary-btn text-sm">
                    ⏹ Stop
                  </button>
                )}
                {(recording || timeLeft > 0) && (
                  <div className="flex items-center gap-2">
                    <div
                      className="text-2xl font-bold tabular-nums"
                      style={{ color: timerColor }}
                    >
                      {String(Math.floor(timeLeft / 60)).padStart(2, "0")}:{String(timeLeft % 60).padStart(2, "0")}
                    </div>
                    {recording && (
                      <span className="text-xs text-red-400 animate-pulse">● REC</span>
                    )}
                  </div>
                )}
                {timeLeft === 0 && !recording && question && (
                  <span className="text-green-400 text-sm">✅ Time's up!</span>
                )}
              </div>
            </div>
          ) : (
            <div className="dashboard-card border border-dashed border-white/20 text-center py-10 text-gray-500">
              <p className="text-4xl mb-3">🎯</p>
              <p>Click "Get Question" to generate an AI interview question</p>
            </div>
          )}

          <button
            onClick={fetchQuestion}
            className="secondary-btn text-sm"
            disabled={loadingQ || !question}
          >
            🔄 Next Question
          </button>
        </div>

        {/* Webcam */}
        <div className="dashboard-card">
          <h3 className="section-title mb-3">📷 Live Preview</h3>
          <Webcam ref={webcamRef} className="rounded-lg w-full" />
          <p className="text-gray-500 text-xs mt-2 text-center">Practice your body language and eye contact</p>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────
// MAIN APP
// ─────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("analytics");
  const [file, setFile] = useState(null);
  const [videoURL, setVideoURL] = useState(null);
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [llmFeedback, setLlmFeedback] = useState(null);
  const [llmLoading, setLlmLoading] = useState(false);

  // ✅ UPGRADE 2: last scores for AI Coach memory
  const [lastScores, setLastScores] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem("interviewHistory");
    if (saved) setHistory(JSON.parse(saved));
    const savedScores = localStorage.getItem("lastScores");
    if (savedScores) setLastScores(JSON.parse(savedScores));
  }, []);

  const saveHistory = (data) => {
    const entry = { ...data, timestamp: new Date().toISOString() };
    const newHistory = [entry, ...history];
    setHistory(newHistory);
    localStorage.setItem("interviewHistory", JSON.stringify(newHistory));
    // ✅ save scores for AI Coach
    const scores = {
      final_score: data.final_score,
      grammar_score: data.grammar_score,
      emotion_score: data.emotion_score,
      eye_contact_score: data.eye_contact_score,
      keyword_score: data.keyword_score,
      speech_rate: data.speech_rate,
      filler_count: data.filler_count
    };
    setLastScores(scores);
    localStorage.setItem("lastScores", JSON.stringify(scores));
  };

  const analyzeInterview = async () => {
    if (!file) { alert("Upload a video first"); return; }
    const formData = new FormData();
    formData.append("file", file);
    try {
      setLoading(true);
      setLlmFeedback(null);
      const res = await axios.post("http://127.0.0.1:8000/analyze", formData);
      setResult(res.data);
      saveHistory(res.data);
      await fetchLLMFeedback(res.data);
    } catch {
      alert("Analysis failed. Make sure your backend is running.");
    }
    setLoading(false);
  };

  const fetchLLMFeedback = async (data) => {
    try {
      setLlmLoading(true);
      const res = await axios.post("http://127.0.0.1:8000/llm-feedback", {
        final_score:       data.final_score,
        grammar_score:     data.grammar_score,
        emotion_score:     data.emotion_score,
        eye_contact_score: data.eye_contact_score,
        keyword_score:     data.keyword_score,
        speech_rate:       data.speech_rate,
        filler_count:      data.filler_count,
        text:              data.text
      });
      setLlmFeedback(res.data.llm_feedback);
    } catch {
      setLlmFeedback("Could not generate AI feedback. Check your Anthropic API key in api.py.");
    }
    setLlmLoading(false);
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Interview Performance Report", 20, 20);
    doc.setFontSize(12);
    doc.text(`Final Score:       ${result.final_score}`, 20, 40);
    doc.text(`Grammar Score:     ${result.grammar_score}`, 20, 50);
    doc.text(`Emotion Score:     ${result.emotion_score}`, 20, 60);
    doc.text(`Eye Contact Score: ${result.eye_contact_score}`, 20, 70);
    doc.text(`Keyword Score:     ${result.keyword_score}`, 20, 80);
    doc.text(`Speech Rate:       ${result.speech_rate}`, 20, 90);
    doc.setFontSize(13);
    doc.text("Transcript:", 20, 105);
    doc.setFontSize(10);
    doc.text(result.text || "N/A", 20, 113, { maxWidth: 160 });
    const feedbackY = 113 + Math.ceil((result.text?.length || 0) / 90) * 6 + 10;
    doc.setFontSize(13);
    doc.text("AI Coach Feedback:", 20, feedbackY);
    doc.setFontSize(10);
    doc.text(llmFeedback || result.ai_feedback || "N/A", 20, feedbackY + 8, { maxWidth: 160 });
    doc.save("interview_report.pdf");
  };

  const emotionChart = result && {
    labels: Object.keys(result.emotions),
    datasets: [{ data: Object.values(result.emotions), backgroundColor: ["#22c55e","#3b82f6","#eab308","#ef4444","#a855f7"] }]
  };

  const timeline = result && {
    labels: result.emotion_timeline.map((_, i) => `Frame ${i}`),
    datasets: [{
      label: "Emotion Timeline",
      data: result.emotion_timeline.map(e => e === "happy" ? 3 : e === "neutral" ? 2 : 1),
      borderColor: "#38bdf8",
      fill: true,
      backgroundColor: "rgba(56,189,248,0.1)"
    }]
  };

  const radarData = result && {
    labels: ["Grammar", "Emotion", "Eye Contact", "Keywords", "Speech"],
    datasets: [{
      data: [result.grammar_score, result.emotion_score, result.eye_contact_score, result.keyword_score, result.speech_rate],
      backgroundColor: "rgba(59,130,246,0.2)",
      borderColor: "#3b82f6"
    }]
  };

  // ─── UPGRADE 4: History trend chart data ───
  const trendData = history.length > 1 && {
    labels: history.map((_, i) => `Session ${history.length - i}`).reverse(),
    datasets: [
      {
        label: "Final Score",
        data: [...history].reverse().map(h => h.final_score),
        borderColor: "#3b82f6",
        backgroundColor: "rgba(59,130,246,0.1)",
        fill: true,
        tension: 0.4
      },
      {
        label: "Grammar",
        data: [...history].reverse().map(h => h.grammar_score),
        borderColor: "#22c55e",
        backgroundColor: "transparent",
        tension: 0.4
      },
      {
        label: "Eye Contact",
        data: [...history].reverse().map(h => h.eye_contact_score),
        borderColor: "#a855f7",
        backgroundColor: "transparent",
        tension: 0.4
      }
    ]
  };

  return (
    <div className="min-h-screen flex">
      {/* SIDEBAR */}
      <div className="w-56 border-r border-white/10 p-6 flex flex-col">
        <h2 className="font-semibold text-lg mb-8">Interview AI</h2>
        {["analytics","practice","history","coach"].map(p => (
          <button
            key={p}
            className={`sidebar-link capitalize ${page === p ? "text-blue-400 font-semibold" : ""}`}
            onClick={() => setPage(p)}
          >
            {p === "analytics" ? "📊 Analytics"
             : p === "practice" ? "🎯 Practice"
             : p === "history"  ? "🕒 History"
             : "🤖 AI Coach"}
          </button>
        ))}
      </div>

      {/* MAIN */}
      <div className="flex-1 p-10 max-w-6xl mx-auto">

        {/* ── ANALYTICS ── */}
        {page === "analytics" && (
          <>
            <h1 className="page-title">Smart Interview Analyzer</h1>

            <div className="dashboard-card mb-8 flex gap-4 items-center flex-wrap">
              <input type="file" accept="video/*" onChange={e => {
                setFile(e.target.files[0]);
                setVideoURL(URL.createObjectURL(e.target.files[0]));
              }} />
              <button onClick={analyzeInterview} className="primary-btn">Analyze</button>
            </div>

            {videoURL && (
              <div className="dashboard-card mb-8 max-w-2xl">
                <h3 className="section-title">Interview Recording</h3>
                <video controls src={videoURL} className="rounded-lg w-full" />
              </div>
            )}

            {loading && (
              <div className="dashboard-card mb-6 text-blue-300 animate-pulse">
                ⏳ Analyzing your interview... please wait
              </div>
            )}

            {result && (
              <>
                {/* ✅ UPGRADE 1: Badge + Score Cards row */}
                <div className="flex gap-6 mb-8 flex-wrap items-start">
                  <BadgeCard score={result.final_score} />
                  <div className="flex-1">
                    <div className="grid grid-cols-3 gap-5">
                      <Card title="Final Score"   value={result.final_score} />
                      <Card title="Grammar"       value={result.grammar_score} />
                      <Card title="Emotion"       value={result.emotion_score} />
                      <Card title="Keywords"      value={result.keyword_score} />
                      <Card title="Speech Rate"   value={result.speech_rate} />
                      <Card title="Eye Contact"   value={result.eye_contact_score} />
                    </div>
                  </div>
                </div>

                {/* Charts */}
                <div className="grid grid-cols-2 gap-6 mb-8">
                  <div className="dashboard-card">
                    <h3 className="section-title">Emotion Distribution</h3>
                    <Pie data={emotionChart} />
                  </div>
                  <div className="dashboard-card">
                    <h3 className="section-title">Emotion Timeline</h3>
                    <Line data={timeline} />
                  </div>
                </div>

                <div className="dashboard-card mb-8 max-w-xl">
                  <h3 className="section-title">Performance Radar</h3>
                  <Radar data={radarData} />
                </div>

                {/* Transcript */}
                <div className="dashboard-card max-w-2xl mb-8">
                  <h3 className="section-title">📝 Transcript</h3>
                  <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
                    {result.text || "No transcript available."}
                  </p>
                </div>

                {/* Claude AI Feedback */}
                <div className="dashboard-card max-w-2xl mb-8 border border-blue-500/40">
                  <h3 className="section-title flex items-center gap-2">
                    🤖 AI Coach Feedback
                    <span className="text-xs text-blue-400 font-normal">Powered by Claude AI</span>
                  </h3>
                  {llmLoading && (
                    <div className="text-blue-300 animate-pulse text-sm">
                      ✨ Claude is analyzing your performance...
                    </div>
                  )}
                  {llmFeedback && !llmLoading && (
                    <div className="text-gray-200 text-sm leading-relaxed whitespace-pre-wrap bg-white/5 rounded-lg p-4">
                      {llmFeedback}
                    </div>
                  )}
                </div>

                {/* Quick Feedback + PDF */}
                <div className="dashboard-card max-w-xl mb-8">
                  <h3 className="section-title">Quick Feedback</h3>
                  <ul className="list-disc list-inside text-gray-300 text-sm space-y-1 mb-4">
                    {Array.isArray(result.feedback)
                      ? result.feedback.map((f, i) => <li key={i}>{f}</li>)
                      : <li>{result.ai_feedback}</li>
                    }
                  </ul>
                  <button className="secondary-btn" onClick={downloadPDF}>
                    ⬇ Download Full Report (PDF)
                  </button>
                </div>
              </>
            )}
          </>
        )}

        {/* ── PRACTICE — UPGRADE 3 ── */}
        {page === "practice" && <PracticeMode />}

        {/* ── HISTORY — UPGRADE 4 ── */}
        {page === "history" && (
          <div>
            <h1 className="page-title">🕒 Interview History</h1>

            {/* Score trend chart */}
            {trendData ? (
              <div className="dashboard-card mb-8">
                <h3 className="section-title">📈 Score Trend Across Sessions</h3>
                <Line
                  data={trendData}
                  options={{
                    responsive: true,
                    scales: {
                      y: { min: 0, max: 100, grid: { color: "rgba(255,255,255,0.05)" }, ticks: { color: "#9ca3af" } },
                      x: { grid: { color: "rgba(255,255,255,0.05)" }, ticks: { color: "#9ca3af" } }
                    },
                    plugins: { legend: { labels: { color: "#d1d5db" } } }
                  }}
                />
              </div>
            ) : history.length === 1 ? (
              <div className="dashboard-card mb-6 text-gray-400 text-sm">
                Complete at least 2 sessions to see your score trend chart.
              </div>
            ) : null}

            {/* Session cards */}
            {history.length === 0 && <p className="text-gray-400">No interviews analyzed yet.</p>}
            <div className="grid grid-cols-2 gap-4">
              {history.map((h, i) => {
                const badge = getBadge(h.final_score);
                const date = h.timestamp ? new Date(h.timestamp).toLocaleDateString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }) : "—";
                return (
                  <div key={i} className={`dashboard-card border ${badge.bg}`}>
                    <div className="flex justify-between items-start mb-2">
                      <p className="text-blue-400 font-semibold">Session #{history.length - i}</p>
                      <div className="flex items-center gap-1">
                        <span>{badge.emoji}</span>
                        <span className={`text-xs font-semibold ${badge.color}`}>{badge.label}</span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mb-3">{date}</p>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm text-gray-300">
                      <span>Final: <strong className="text-white">{h.final_score}%</strong></span>
                      <span>Grammar: <strong className="text-white">{h.grammar_score}%</strong></span>
                      <span>Eye Contact: <strong className="text-white">{h.eye_contact_score}%</strong></span>
                      <span>Emotion: <strong className="text-white">{h.emotion_score}%</strong></span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── AI COACH — UPGRADE 2 ── */}
        {page === "coach" && (
          <div>
            <h1 className="page-title">🤖 AI Interview Coach</h1>
            <p className="text-gray-400 mb-6 text-sm">
              Ask anything — interview tips, how to improve your score, body language advice, and more.
              {lastScores && <span className="text-blue-400"> Your last session scores are loaded for personalised advice.</span>}
            </p>
            <AICoach lastScores={lastScores} />
          </div>
        )}

      </div>
    </div>
  );
}

function Card({ title, value }) {
  return (
    <div className="dashboard-card text-center">
      <p className="text-gray-400 text-sm mb-2">{title}</p>
      <p className="text-2xl font-semibold text-blue-400">{value}</p>
    </div>
  );
}
