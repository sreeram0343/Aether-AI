class AetherError(Exception):
    """Base exception for the Aether platform."""


class ConfigurationError(AetherError):
    """Raised when application configuration is invalid."""


class ProviderError(AetherError):
    """Raised when a gateway provider fails to complete a request."""


class RouteNotFoundError(AetherError):
    """Raised when a requested provider route cannot be resolved."""
