from __future__ import annotations

from abc import ABC, abstractmethod
from typing import Any, Dict


class BaseProvider(ABC):
    """Abstract base class for provider adapters."""

    name: str = "base"

    @abstractmethod
    def generate(self, payload: Dict[str, Any]) -> Dict[str, Any]:
        """Generate a provider response from a normalized payload."""
