from __future__ import annotations

from typing import Any, Dict

from aether.gateway.base import BaseProvider


class OpenAIProvider(BaseProvider):
    """OpenAI provider adapter."""

    name = "openai"

    def generate(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        return {
            "provider": self.name,
            "response": payload.get("message", "OpenAI response stub"),
        }
