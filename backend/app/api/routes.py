"""
APIルート定義
"""
from fastapi import APIRouter, Depends, HTTPException
from typing import List

from app.models.schemas import (
    Question, 
    AnswerRequest, 
    AnswerResponse, 
    ChatRequest, 
    ChatResponse
)
from app.services.questions import question_service
from app.services.llm import llm_service
from app.services.agent import fraction_agent

# ルーターの初期化
router = APIRouter(prefix="/api")


@router.get("/questions", response_model=List[Question])
async def get_questions():
    """
    すべての問題を取得するエンドポイント
    """
    return await question_service.get_all_questions()


@router.post("/answer", response_model=AnswerResponse)
async def check_answer(answer_data: AnswerRequest):
    """
    回答をチェックするエンドポイント
    
    Args:
        answer_data: 回答データ（問題IDと回答）
    
    Returns:
        回答が正しいかどうかとヒント
    """
    return await question_service.check_answer(
        question_id=answer_data.id,
        user_answer=answer_data.answer
    )


# @router.post("/chat", response_model=ChatResponse)
# async def chat_endpoint(request_data: ChatRequest):
#     """
#     チャットエンドポイント - LLMに質問を送信
    
#     Args:
#         request_data: チャットリクエストデータ
    
#     Returns:
#         LLMからの応答
#     """
#     try:
#         # LLMからの応答を取得
#         reply = await llm_service.get_chat_response(
#             problem=request_data.problem,
#             user_question=request_data.question,
#             user_answer=request_data.user_answer,
#             correct_answer=request_data.correct_answer,
#             chat_history=request_data.chat_history
#         )
        
#         return ChatResponse(reply=reply)
    
#     except Exception as e:
#         # エラーログを出力
#         print(f"Chat API Error: {str(e)}")
        
#         # エラーレスポンスを返す
#         return ChatResponse(
#             reply="申し訳ありません、エラーが発生しました。もう一度お試しください。"
#         )
    
@router.post("/chat/agent", response_model=ChatResponse)
async def agent_chat_endpoint(request_data: ChatRequest):
    """エージェントを使用したチャットエンドポイント"""
    try:
        # 回答の分析
        analysis = await fraction_agent.analyze_answer(
            problem=request_data.problem,
            user_answer=request_data.user_answer,
            correct_answer=request_data.correct_answer
        )
        
        # エージェントからの応答を取得
        reply = await fraction_agent.generate_response(
            problem=request_data.problem,
            user_question=request_data.question,
            user_answer=request_data.user_answer,
            correct_answer=request_data.correct_answer,
            chat_history=request_data.chat_history,
            analysis=analysis
        )
        
        return ChatResponse(reply=reply)
    except Exception as e:
        print(f"Agent Chat API Error: {str(e)}")
        return ChatResponse(reply="申し訳ありません、エラーが発生しました。")