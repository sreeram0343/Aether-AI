from aether.gateway.providers.anthropic import AnthropicProvider
from aether.gateway.providers.openai import OpenAIProvider
from aether.gateway.router import GatewayRouter
from aether.schemas.gateway import GatewayRequest


def test_openai_provider_stub():
    provider = OpenAIProvider()
    response = provider.generate({"message": "hello"})

    assert response["provider"] == "openai"
    assert response["response"] == "hello"


def test_router_routes_to_registered_provider():
    router = GatewayRouter()
    router.register(OpenAIProvider)
    router.register(AnthropicProvider)

    result = router.route("anthropic", {"message": "hello"})

    assert result["provider"] == "anthropic"
    assert result["response"] == "hello"


def test_gateway_request_validation():
    request = GatewayRequest(provider="openai", message="hello")

    assert request.provider == "openai"
    assert request.message == "hello"
