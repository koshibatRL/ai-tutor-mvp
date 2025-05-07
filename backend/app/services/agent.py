"""
エージェントシステム - LLMを使った高度な分数学習サポート
"""
from typing import List, Dict, Any, Optional
import json

from openai import OpenAI
from app.config import get_settings


class FractionTeacherAgent:
    """
    分数問題を教えるエージェントシステム
    
    このエージェントは学習者の回答を分析し、最適なフィードバックを提供します。
    また、学習者の理解度に応じて説明の詳しさを調整します。
    """
    
    def __init__(self):
        """OpenAIクライアントの初期化"""
        settings = get_settings()
        # 明示的にパラメータを指定して初期化
        self.client = OpenAI(
            api_key=settings.OPENAI_API_KEY,
            base_url=settings.OPENAI_BASE_URL
        )
        self.model = settings.OPENAI_MODEL
    
    async def analyze_answer(
        self, 
        problem: str, 
        user_answer: str, 
        correct_answer: str
    ) -> Dict[str, Any]:
        """
        ユーザーの回答を分析し、エラーの種類と適切なヒントを提供
        
        Args:
            problem: 問題文
            user_answer: ユーザーの回答
            correct_answer: 正解
            
        Returns:
            Dict: 分析結果（エラータイプ、ヒント、説明など）
        """
        prompt = f"""
        # 分数計算の問題と回答の分析
        
        ## 問題
        {problem}
        
        ## ユーザーの回答
        {user_answer}
        
        ## 正解
        {correct_answer}
        
        ## 指示
        1. ユーザーの回答を分析し、どのような計算ミスがあるか特定してください
        2. 考えられるエラーの種類を特定してください（通分ミス、約分忘れ、演算ルール誤解など）
        3. 教育的なヒントを考えてください（直接答えは教えず、気づきを促す）
        4. JSONフォーマットで以下の情報を返してください:
        
        ```json
        {{
            "error_type": "エラーの種類（通分ミス、計算ミス、約分忘れなど）",
            "hint": "学習者が自分で気づくためのヒント",
            "explanation": "概念の説明（この問題の解き方の基本ルール）",
            "step_by_step": ["解法のステップ1", "ステップ2", "..."],
            "common_mistake": "よくある間違いの説明"
        }}
        ```
        
        レスポンスは有効なJSONフォーマットでなければなりません。
        """
        
        try:
            # LLMに分析リクエストを送信
            completion = self.client.chat.completions.create(
                model=self.model,
                response_format={"type": "json_object"},
                messages=[
                    {"role": "system", "content": "あなたは教育専門家で、特に数学の分数計算を教えることに長けています。"},
                    {"role": "user", "content": prompt}
                ]
            )
            
            # JSON応答を解析
            response_text = completion.choices[0].message.content
            analysis = json.loads(response_text)
            
            return analysis
        
        except Exception as e:
            # エラー時はデフォルトの分析結果を返す
            print(f"Agent analysis error: {str(e)}")
            return {
                "error_type": "不明",
                "hint": "分数計算では、演算子に応じた計算方法を使う必要があります。",
                "explanation": "分数の計算では、足し算・引き算は通分が必要です。かけ算は分子同士・分母同士、割り算は逆数をかけます。",
                "step_by_step": ["問題を読み解く", "適切な計算方法を選ぶ", "計算を実行する", "答えを約分する"],
                "common_mistake": "演算子ごとの計算ルールを混同することがよくある間違いです。"
            }
    
    async def generate_response(
        self,
        problem: str,
        user_question: str,
        user_answer: str,
        correct_answer: str,
        chat_history: List[Dict[str, str]],
        analysis: Optional[Dict[str, Any]] = None
    ) -> str:
        """
        分析結果とチャット履歴に基づいて最適な応答を生成
        
        Args:
            problem: 問題文
            user_question: ユーザーの質問
            user_answer: ユーザーの回答
            correct_answer: 正解
            chat_history: チャット履歴
            analysis: 回答分析結果（オプション）
            
        Returns:
            str: 生成された応答
        """
        # まだ分析が行われていない場合は分析を実行
        if analysis is None:
            analysis = await self.analyze_answer(problem, user_answer, correct_answer)
        
        # チャット履歴を処理（最新の5つに制限）
        if len(chat_history) > 5:
            chat_history = chat_history[-5:]
        
        # 会話の文脈情報を準備
        context = {
            "problem": problem,
            "user_question": user_question,
            "user_answer": user_answer,
            "correct_answer": correct_answer,
            "error_type": analysis.get("error_type", "不明"),
            "hint": analysis.get("hint", ""),
            "explanation": analysis.get("explanation", ""),
            "step_by_step": analysis.get("step_by_step", []),
            "common_mistake": analysis.get("common_mistake", "")
        }
        
        # プロンプト
        system_prompt = f"""
        あなたは親切な数学の先生です。分数の問題を教えています。
        
        # 現在の問題
        {context['problem']}
        
        # ユーザー情報
        - 回答: {context['user_answer']}
        - 正解: {context['correct_answer']}
        
        # 分析情報
        - エラータイプ: {context['error_type']}
        - 適切なヒント: {context['hint']}
        - 概念説明: {context['explanation']}
        - 解法ステップ: {', '.join(context['step_by_step'])}
        - よくある間違い: {context['common_mistake']}
        
        # 応答のガイドライン
        1. 常に励ましの言葉から始めてください
        2. ユーザーが自分で答えを見つけられるよう、直接答えは教えずヒントを与えてください
        3. 必要に応じて、分数計算の基本的な概念を思い出させてください
        4. 質問には具体的に答え、次のステップを提案してください
        5. 会話が進むにつれて、より具体的なヒントを提供してください
        
        回答は理解しやすく、友好的で、教育的なものにしてください。
        """
        
        messages = [
            {"role": "system", "content": system_prompt},
        ]
        
        # ユーザーからの質問があれば追加
        if user_question:
            messages.append({"role": "user", "content": user_question})
        
        # チャット履歴を追加
        messages.extend(chat_history)
        
        try:
            # LLMに応答リクエストを送信
            completion = self.client.chat.completions.create(
                model=self.model,
                messages=messages
            )
            
            return completion.choices[0].message.content
        
        except Exception as e:
            # エラー時は基本的なヒントを返す
            print(f"Agent response error: {str(e)}")
            return f"分数の問題「{problem}」で考えてみましょう。{analysis.get('hint', '分母に注目してみてください。')} もう一度挑戦してみませんか？"


# シングルトンインスタンス
fraction_agent = FractionTeacherAgent()