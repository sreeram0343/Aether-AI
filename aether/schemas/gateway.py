from __future__ import annotations

from typing import Any, Dict, Optional

from pydantic import BaseModel, Field


class GatewayRequest(BaseModel):
    """Standardized request payload for gateway routing."""

    provider: str = "openai"
    message: str = Field(..., min_length=1)
    metadata: Optional[Dict[str, Any]] = None


class GatewayResponse(BaseModel):
    """Standardized response payload produced by gateway providers."""

    provider: str
    response: str
    metadata: Optional[Dict[str, Any]] = None
