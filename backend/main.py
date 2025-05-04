from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

QUESTIONS = [
    {"id": "q1", "body": "1/2 + 1/3 = ?", "answer": "5/6"},
    {"id": "q2", "body": "3/4 - 1/4 = ?", "answer": "1/2"},
    {"id": "q3", "body": "2/5 × 3/7 = ?", "answer": "6/35"},
    {"id": "q4", "body": "7/8 ÷ 1/2 = ?", "answer": "7/4"},
    {"id": "q5", "body": "5/6 + 2/3 = ?", "answer": "3/2"}
]

@app.get("/api/questions")
async def get_questions():
    return QUESTIONS

@app.post("/api/answer")
async def check_answer(answer_data: dict):
    question = next((q for q in QUESTIONS if q["id"] == answer_data["id"]), None)
    if not question:
        return {"ok": False, "hint": "Question not found"}
    
    if answer_data["answer"] == question["answer"]:
        return {"ok": True}
    return {"ok": False, "hint": "Stub hint: remember to find a common denominator"}

@app.post("/api/chat")
async def chat_endpoint(request_data: dict):
    return {"reply": "This is a stubbed tutor response."}