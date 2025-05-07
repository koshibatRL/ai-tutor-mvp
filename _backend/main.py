from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from openai import OpenAI

client = OpenAI(
  base_url="https://openrouter.ai/api/v1",
  api_key="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",
)

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
    try:
        # リクエストからデータを取得
        problem = request_data.get("problem", "")
        user_question = request_data.get("question", "")
        user_answer = request_data.get("user_answer", "")
        correct_answer = request_data.get("correct_answer", "")
        chat_history = request_data.get("chat_history", [])
        
        # 履歴が長すぎる場合は最新の5つに制限
        if len(chat_history) > 10:
            chat_history = chat_history[-5:]
        
        # システムプロンプトの追加
        messages = [
            {
                "role": "system", 
                "content": f"あなたは親切な数学の先生です。分数の問題を教えています。現在の問題は「{problem}」です。ユーザーの答えは「{user_answer}」で、正解は「{correct_answer}」です。ヒントを与えながら、生徒が自分で答えにたどり着けるよう導いてください。分数の計算方法について具体的に説明してください。"
            }
        ]
        print(chat_history)
        print(messages)
        
        # チャット履歴を追加
        messages.extend(chat_history)
        
        # LLMに送信
        completion = client.chat.completions.create(
            model="qwen/qwen3-0.6b-04-28:free",
            messages=messages
        )
        print(completion)
        
        return {"reply": completion.choices[0].message.content}
    except Exception as e:
        print(f"Chat API Error: {str(e)}")
        return {"reply": "申し訳ありません、エラーが発生しました。もう一度お試しください。"}