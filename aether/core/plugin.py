from __future__ import annotations

from abc import ABC, abstractmethod
from typing import Any, Dict, Iterable, List, Optional


class Plugin(ABC):
    """Common interface for pluggable Aether components."""

    name: str = "plugin"

    @abstractmethod
    def initialize(self) -> None:
        """Initialize plugin resources."""


class PluginRegistry:
    """Registry for plugin instances keyed by name."""

    def __init__(self) -> None:
        self._plugins: Dict[str, Plugin] = {}

    def register(self, plugin: Plugin) -> None:
        self._plugins[plugin.name] = plugin

    def get(self, name: str) -> Optional[Plugin]:
        return self._plugins.get(name)

    def list(self) -> Iterable[str]:
        return list(self._plugins.keys())

    def unregister(self, name: str) -> None:
        self._plugins.pop(name, None)
