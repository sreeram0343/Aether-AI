from __future__ import annotations

import logging
from typing import Any


def build_logger(name: str = "aether", level: int = logging.INFO) -> logging.Logger:
    """Create a structured logging setup for the platform."""

    logger = logging.getLogger(name)
    logger.setLevel(level)

    if logger.handlers:
        return logger

    handler = logging.StreamHandler()
    handler.setFormatter(
        logging.Formatter(
            "%(asctime)s %(levelname)s %(name)s %(message)s",
            datefmt="%Y-%m-%d %H:%M:%S",
        )
    )
    logger.addHandler(handler)
    return logger


def log_event(logger: logging.Logger, event: str, **context: Any) -> None:
    """Emit a structured log payload using the logger's extra context."""

    payload = {"event": event, **context}
    logger.info(payload)
