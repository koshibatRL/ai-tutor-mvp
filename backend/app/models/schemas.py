"""
Pydanticモデルによるデータ検証
"""
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any


class Question(BaseModel):
    """問題モデル"""
    id: str
    body: str
    answer: str


class AnswerRequest(BaseModel):
    """回答リクエストモデル"""
    id: str
    answer: str


class AnswerResponse(BaseModel):
    """回答レスポンスモデル"""
    ok: bool
    hint: Optional[str] = None


class ChatMessage(BaseModel):
    """チャットメッセージモデル"""
    role: str
    content: str


class ChatRequest(BaseModel):
    """チャットリクエストモデル"""
    problem: str = Field(..., description="現在の問題")
    question: Optional[str] = Field(default="", description="ユーザーの質問")
    user_answer: str = Field(..., description="ユーザーの回答")
    correct_answer: str = Field(..., description="正解")
    chat_history: List[Dict[str, str]] = Field(default_factory=list, description="チャット履歴")


class ChatResponse(BaseModel):
    """チャットレスポンスモデル"""
    reply: str