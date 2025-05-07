import os
from dotenv import load_dotenv
from functools import lru_cache

# 環境変数を.envファイルから読み込み
load_dotenv()

class Settings:
    """アプリケーション設定"""
    
    # API設定
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    OPENAI_BASE_URL: str = os.getenv("OPENAI_BASE_URL", "https://openrouter.ai/api/v1")
    OPENAI_MODEL: str = os.getenv("OPENAI_MODEL", "qwen/qwen3-0.6b-04-28:free")
    
    # アプリケーション設定
    DEBUG: bool = os.getenv("DEBUG", "False").lower() in ("true", "1", "t")
    
    # APIクライアント設定
    @property
    def api_client_kwargs(self):
        """OpenAI APIクライアントの設定を返す"""
        return {
            "base_url": self.OPENAI_BASE_URL,
            "api_key": self.OPENAI_API_KEY,
            # proxiesパラメータは使用しない
        }


@lru_cache()
def get_settings() -> Settings:
    """キャッシュされた設定を返す"""
    return Settings()