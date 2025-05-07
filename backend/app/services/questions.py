"""
質問サービス
"""
from app.data.questions import get_questions, get_question_by_id
from app.models.schemas import AnswerResponse

class QuestionService:
    """問題を管理するサービス"""
    
    async def get_all_questions(self):
        """すべての問題を取得"""
        return get_questions()
    
    async def check_answer(self, question_id: str, user_answer: str) -> AnswerResponse:
        """
        ユーザーの回答をチェック
        
        Args:
            question_id: 問題ID
            user_answer: ユーザーの回答
            
        Returns:
            AnswerResponse: 結果と必要に応じてヒント
        """
        # 問題を取得
        question = get_question_by_id(question_id)
        
        # 問題が見つからない場合
        if not question:
            return AnswerResponse(
                ok=False,
                hint="Question not found"
            )
        
        # 回答が正解の場合
        if user_answer == question["answer"]:
            return AnswerResponse(
                ok=True
            )
        
        # 回答が不正解の場合、ヒントを提供
        return AnswerResponse(
            ok=False,
            hint=self._generate_hint(question, user_answer)
        )
    
    def _generate_hint(self, question: dict, user_answer: str) -> str:
        """
        不正解の場合にヒントを生成
        
        Args:
            question: 問題
            user_answer: ユーザーの回答
            
        Returns:
            str: ヒント
        """
        # 問題タイプに基づいたヒント生成（今後拡張可能）
        problem_body = question["body"]
        
        if "+" in problem_body:
            return "足し算の分数では、通分して共通の分母を見つけることが重要です。"
        elif "-" in problem_body:
            return "引き算の分数では、通分して共通の分母を見つけることが重要です。"
        elif "×" in problem_body or "x" in problem_body:
            return "分数のかけ算は、分子同士・分母同士をかけます。"
        elif "÷" in problem_body:
            return "分数の割り算は、割る数（右側の分数）の逆数をかけます。"
        else:
            return "分母を確認して、計算の手順を見直してみましょう。"


# シングルトンインスタンス
question_service = QuestionService()