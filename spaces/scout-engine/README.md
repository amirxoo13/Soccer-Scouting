---
title: Soccer Scout Engine
emoji: ⚽
colorFrom: green
colorTo: yellow
sdk: docker
app_port: 7860
pinned: false
license: mit
short_description: On-demand match clip scouting. Sleeps when idle.
---

# Soccer Scout Engine

Wakes on an analyse request, reads a short slice of the match with ffmpeg,
tracks players, then Hugging Face puts the Space back to sleep.
