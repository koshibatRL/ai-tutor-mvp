"""
アプリケーションのメインエントリーポイント
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import router as api_router
from app.config import get_settings

# アプリケーション設定の取得
settings = get_settings()

# FastAPIアプリケーションの初期化
app = FastAPI(
    title="分数学習アプリAPI",
    description="分数問題を解くための学習支援APIサービス",
    version="0.1.0",
    debug=settings.DEBUG
)

# CORSミドルウェアの追加
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 本番環境では制限することを推奨
    allow_methods=["*"],
    allow_headers=["*"],
)

# APIルーターの登録
app.include_router(api_router)


@app.get("/")
async def root():
    """ルートエンドポイント - サービスの基本情報を提供"""
    return {
        "name": "分数学習アプリAPI",
        "version": "0.1.0",
        "status": "running"
    }


if __name__ == "__main__":
    import uvicorn
    # 開発サーバーの起動
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)