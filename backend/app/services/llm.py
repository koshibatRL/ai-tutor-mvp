"""
LLMサービス
"""
from openai import OpenAI
from typing import List, Dict, Any

from app.config import get_settings


class LLMService:
    """LLMサービスクラス"""
    
    def __init__(self):
        """OpenAIクライアントの初期化"""
        settings = get_settings()
        # 明示的にパラメータを指定して初期化
        self.client = OpenAI(
            api_key=settings.OPENAI_API_KEY,
            base_url=settings.OPENAI_BASE_URL
        )
        self.model = settings.OPENAI_MODEL
    
    async def get_chat_response(
        self, 
        problem: str, 
        user_question: str, 
        user_answer: str, 
        correct_answer: str, 
        chat_history: List[Dict[str, str]]
    ) -> str:
        """
        LLMからチャットレスポンスを取得
        
        Args:
            problem: 現在の問題
            user_question: ユーザーの質問
            user_answer: ユーザーの回答
            correct_answer: 正解
            chat_history: チャット履歴
        
        Returns:
            str: LLMの応答
        """
        # システムプロンプト
        messages = [
            {
                "role": "system",
                "content": f"あなたは親切な数学の先生です。分数の問題を教えています。現在の問題は「{problem}」です。"
                          f"ユーザーの答えは「{user_answer}」で、正解は「{correct_answer}」です。"
                          f"ヒントを与えながら、生徒が自分で答えにたどり着けるよう導いてください。"
                          f"決して答えを直接教えないでください。ユーザーが算数の問題の本質を理解しやすいように説明してください。"
                          f"分数の計算方法について具体的に説明してください。"
            }
        ]
        
        # 履歴が長すぎる場合は最新の5つに制限
        if len(chat_history) > 10:
            chat_history = chat_history[-5:]
        
        # チャット履歴を追加
        messages.extend(chat_history)
        
        try:
            # LLMに送信
            completion = self.client.chat.completions.create(
                model=self.model,
                messages=messages
            )
            
            return completion.choices[0].message.content
        
        except Exception as e:
            # エラーログを出力
            print(f"LLM API Error: {str(e)}")
            return "申し訳ありません、エラーが発生しました。もう一度お試しください。"


# シングルトンインスタンス
llm_service = LLMService()