"""
Optional Celery worker for production (Redis broker).
The live app uses a Postgres-backed Node queue instead — same pipeline:
extract stream with yt-dlp (no download) → Hugging Face with 3× retry.

  redis-server
  celery -A workers.tasks worker --loglevel=info

Env: REDIS_URL, HF_TOKEN, DATABASE_URL
"""
from __future__ import annotations

import os
import subprocess
import time
from typing import Any
from urllib.parse import urlparse

import requests

try:
    from celery import Celery
except ImportError:  # pragma: no cover
    Celery = None  # type: ignore

REDIS_URL = os.environ.get("REDIS_URL", "redis://127.0.0.1:6379/0")
app = Celery("soccer_scouting", broker=REDIS_URL, backend=REDIS_URL) if Celery else None

FORMAT = (
    "best[height>=360][height<=720][ext=mp4][vcodec^=avc][acodec!=none]/"
    "best[height>=360][height<=720][ext=mp4][acodec!=none]/"
    "best[height>=360][height<=720][vcodec!=none]/"
    "best[height<=720][vcodec!=none]/best[vcodec!=none]/best"
)
ANDROID_UA = (
    "Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 "
    "(KHTML, like Gecko) Chrome/122.0.0.0 Mobile Safari/537.36"
)
HF_MODELS = [
    "Adit-jain/soccana",
    "aabyzov/easychamp-player-detection-yolov8",
]


def extract_stream(url: str) -> str:
    host = (urlparse(url).hostname or "").replace("www.", "").lower()
    origin = f"{urlparse(url).scheme}://{urlparse(url).netloc}"
    args = [
        "python3",
        "-m",
        "yt_dlp",
        "--no-download",
        "--no-playlist",
        "--geo-bypass",
        "--force-ipv4",
        "--no-check-certificates",
        "--socket-timeout",
        "20",
        "--retries",
        "5",
        "--user-agent",
        ANDROID_UA,
        "-S",
        "res:720,codec:h264,ext:mp4,proto:https,fps:30",
        "-f",
        FORMAT,
        "--referer",
        f"{origin}/",
        "-g",
        url,
    ]
    if host.endswith("aparat.com") or "namasha" in host:
        args.extend(["--geo-bypass-country", "IR"])
    if "youtu" in host:
        args.extend(
            ["--extractor-args", "youtube:player_client=android,ios,mweb;player_skip=webpage,configs"]
        )
    proc = subprocess.run(args, capture_output=True, text=True, timeout=60)
    lines = [l.strip() for l in proc.stdout.splitlines() if l.strip().startswith("http")]
    if proc.returncode != 0 or not lines:
        raise RuntimeError((proc.stderr or "")[-500:] or "yt-dlp returned no stream")
    return lines[0]


def _post(url: str, payload: dict[str, Any], token: str, timeout: int = 25) -> requests.Response:
    headers = {"Content-Type": "application/json"}
    if token:
        headers["Authorization"] = f"Bearer {token}"
    return requests.post(url, json=payload, headers=headers, timeout=timeout)


def call_hf(stream_url: str, page_url: str) -> dict[str, Any]:
    token = (os.environ.get("HF_TOKEN") or os.environ.get("HUGGING_FACE_HUB_TOKEN") or "").strip()
    if not token:
        raise RuntimeError("HF_TOKEN is not configured")
    last_err = "no model responded"
    for model in HF_MODELS:
        delay = 1.0
        for attempt in range(3):
            try:
                res = _post(
                    f"https://router.huggingface.co/hf-inference/models/{model}",
                    {"inputs": stream_url, "parameters": {"source_url": page_url}},
                    token,
                )
                if res.status_code >= 500 or res.status_code == 429:
                    raise RuntimeError(f"HF {res.status_code}")
                if res.ok:
                    return {"model": model, "json": res.json() if res.content else {}}
                last_err = f"HF {model} HTTP {res.status_code}"
                break
            except Exception as exc:  # noqa: BLE001
                last_err = str(exc)
                time.sleep(delay)
                delay *= 2
    raise RuntimeError(last_err)


if app is not None:

    @app.task(name="workers.tasks.analyse_video", bind=True, max_retries=0)
    def analyse_video(self, video_id: int, video_url: str) -> dict[str, Any]:  # type: ignore[no-untyped-def]
        try:
            stream = extract_stream(video_url)
        except Exception as exc:  # noqa: BLE001
            return {"video_id": video_id, "status": "Extraction_Failed", "error": str(exc)}
        try:
            result = call_hf(stream, video_url)
            return {"video_id": video_id, "status": "Analyzed", "stream": stream, **result}
        except Exception as exc:  # noqa: BLE001
            return {"video_id": video_id, "status": "failed", "error": str(exc)}
