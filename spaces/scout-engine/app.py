import os
import traceback
from typing import Any

from fastapi import FastAPI, Header, HTTPException
from pydantic import BaseModel, HttpUrl

from tracker import analyse_url

app = FastAPI(title="Soccer Scout Engine", docs_url="/")
SECRET = (os.environ.get("SCOUT_ENGINE_KEY") or "").strip()


class AnalyseIn(BaseModel):
    video_url: HttpUrl


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/analyze")
def analyze(
    body: AnalyseIn,
    x_scout_key: str | None = Header(default=None),
    authorization: str | None = Header(default=None),
) -> dict[str, Any]:
    got = (x_scout_key or authorization or "").replace("Bearer ", "").strip()
    if SECRET and got != SECRET:
        raise HTTPException(status_code=401, detail="bad scout key")
    try:
        return analyse_url(str(body.video_url))
    except Exception as exc:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(exc)[:500]) from exc
