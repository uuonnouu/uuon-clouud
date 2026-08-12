import base64
import json
from typing import Any

from .artifact import AdaptiveArtifact, create_artifact
from .verify import verify_artifact

CONTAINER_VERSION = "0.1.0"


def serialize_artifact(artifact: AdaptiveArtifact) -> bytes:
    """
    Serialize an AdaptiveArtifact into a canonical deterministic container.
    """

    envelope = {
        "container_version": CONTAINER_VERSION,
        "artifact": artifact.metadata(),
        "payload_b64": base64.b64encode(artifact.payload).decode("ascii"),
    }

    return json.dumps(
        envelope,
        sort_keys=True,
        separators=(",", ":"),
        ensure_ascii=True,
    ).encode("utf-8")


def deserialize_artifact(data: bytes) -> AdaptiveArtifact:
    """
    Reconstruct an AdaptiveArtifact from a serialized container.
    """

    try:
        envelope: dict[str, Any] = json.loads(data.decode("utf-8"))
    except (UnicodeDecodeError, json.JSONDecodeError) as exc:
        raise ValueError("Invalid container encoding") from exc

    if envelope.get("container_version") != CONTAINER_VERSION:
        raise ValueError("Unsupported container version")

    metadata = envelope.get("artifact")
    if not isinstance(metadata, dict):
        raise ValueError("Missing artifact metadata")

    payload_b64 = envelope.get("payload_b64")
    if not isinstance(payload_b64, str):
        raise ValueError("Missing payload")

    try:
        payload = base64.b64decode(payload_b64, validate=True)
    except (ValueError, TypeError) as exc:
        raise ValueError("Invalid payload encoding") from exc

    execution_path = metadata.get("execution_path")
    if not isinstance(execution_path, list):
        raise ValueError("Missing execution path")

    return AdaptiveArtifact(
        artifact_id=str(metadata["artifact_id"]),
        filename=str(metadata["filename"]),
        media_type=str(metadata["media_type"]),
        algorithm=str(metadata["algorithm"]),
        original_size=int(metadata["original_size"]),
        payload_size=int(metadata["payload_size"]),
        reduction_percent=float(metadata["reduction_percent"]),
        original_sha256=str(metadata["original_sha256"]),
        payload_sha256=str(metadata["payload_sha256"]),
        merkle_root=str(metadata["merkle_root"]),
        payload=payload,
        execution_path=tuple(str(node) for node in execution_path),
    )


def pack_artifact(
    filename: str,
    original: bytes,
    media_type: str = "application/octet-stream",
) -> bytes:
    """
    Create an artifact and serialize it into a container.
    """

    artifact = create_artifact(
        filename=filename,
        original=original,
        media_type=media_type,
    )

    return serialize_artifact(artifact)


def unpack_and_verify(data: bytes) -> dict[str, Any]:
    """
    Deserialize a container and verify the reconstructed artifact.
    """

    artifact = deserialize_artifact(data)
    result = verify_artifact(artifact)

    return {
        "artifact": artifact,
        "verification": result,
    }
