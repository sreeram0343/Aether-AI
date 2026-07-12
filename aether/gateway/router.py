from __future__ import annotations

from typing import Dict, Type

from aether.core.exceptions import RouteNotFoundError
from aether.gateway.base import BaseProvider


class GatewayRouter:
    """Route normalized requests to a provider implementation."""

    def __init__(self, providers: Dict[str, Type[BaseProvider]] | None = None) -> None:
        self._providers = providers or {}

    def register(self, provider: Type[BaseProvider]) -> None:
        self._providers[provider.name] = provider

    def route(self, provider_name: str, payload: Dict[str, object]) -> Dict[str, object]:
        provider_cls = self._providers.get(provider_name)
        if provider_cls is None:
            raise RouteNotFoundError(f"No provider registered for '{provider_name}'")

        provider = provider_cls()
        return provider.generate(payload)
