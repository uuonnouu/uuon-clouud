# Clouud Python SDK

Example interface:

from clouud import Client

client = Client(api_key="KEY")

result = client.message(
    "Analyze this"
)

print(result)

