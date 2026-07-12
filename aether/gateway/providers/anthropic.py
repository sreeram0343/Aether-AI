from __future__ import annotations

from typing import Any, Dict

from aether.gateway.base import BaseProvider


class AnthropicProvider(BaseProvider):
    """Anthropic provider adapter."""

    name = "anthropic"

    def generate(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        return {
            "provider": self.name,
            "response": payload.get("message", "Anthropic response stub"),
        }
