import os


class Settings:
    PROJECT_NAME: str = "TaskFlow"
    SECRET_KEY: str = os.getenv("SECRET_KEY", "18136b92030d2b0127609e9173dfdb6ecc90c9f52e88118fbef8c3e287b8b557")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 hours


settings = Settings()
