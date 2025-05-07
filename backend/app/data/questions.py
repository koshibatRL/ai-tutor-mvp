"""
分数問題のデータモジュール
"""

# 分数計算問題のリスト
QUESTIONS = [
    {"id": "q1", "body": "1/2 + 1/3 = ?", "answer": "5/6"},
    {"id": "q2", "body": "3/4 - 1/4 = ?", "answer": "1/2"},
    {"id": "q3", "body": "2/5 × 3/7 = ?", "answer": "6/35"},
    {"id": "q4", "body": "7/8 ÷ 1/2 = ?", "answer": "7/4"},
    {"id": "q5", "body": "5/6 + 2/3 = ?", "answer": "3/2"}
]

def get_questions():
    """すべての問題を取得"""
    return QUESTIONS

def get_question_by_id(question_id: str):
    """IDで問題を検索"""
    return next((q for q in QUESTIONS if q["id"] == question_id), None)

def add_question(question: dict):
    """新しい問題を追加"""
    QUESTIONS.append(question)
    return question