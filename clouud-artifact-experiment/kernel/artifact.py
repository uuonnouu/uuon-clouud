import hashlib
import uuid
from dataclasses import dataclass
from typing import Any

from .algorithms import compress_payload, decompress_payload
from .topology import ExecutionTrace


FORMAT_VERSION = "0.1.0"


def sha256(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def merkle_root(values: list[str]) -> str:
    if not values:
        return sha256(b"")

    level = [bytes.fromhex(value) for value in values]

    while len(level) > 1:
        if len(level) % 2:
            level.append(level[-1])

        level = [
            hashlib.sha256(level[i] + level[i + 1]).digest()
            for i in range(0, len(level), 2)
        ]

    return level[0].hex()


@dataclass(frozen=True)
class AdaptiveArtifact:
    artifact_id: str
    filename: str
    media_type: str
    algorithm: str
    original_size: int
    payload_size: int
    reduction_percent: float
    original_sha256: str
    payload_sha256: str
    merkle_root: str
    payload: bytes
    execution_path: tuple[str, ...]

    def metadata(self) -> dict[str, Any]:
        return {
            "format_version": FORMAT_VERSION,
            "artifact_id": self.artifact_id,
            "filename": self.filename,
            "media_type": self.media_type,
            "algorithm": self.algorithm,
            "original_size": self.original_size,
            "payload_size": self.payload_size,
            "reduction_percent": self.reduction_percent,
            "original_sha256": self.original_sha256,
            "payload_sha256": self.payload_sha256,
            "merkle_root": self.merkle_root,
            "execution_path": list(self.execution_path),
        }


def create_artifact(
    filename: str,
    original: bytes,
    media_type: str = "application/octet-stream",
) -> AdaptiveArtifact:

    trace = ExecutionTrace()

    # Actual execution begins here.
    trace.enter("INPUT")
    trace.enter("ROUTER")

    algorithm, payload = compress_payload(original)

    # Record the branch actually selected by compress_payload().
    algorithm_node = {
        "store": "STORE",
        "gzip": "GZIP",
        "zstd": "ZSTD",
    }.get(algorithm)

    if algorithm_node is None:
        raise ValueError(
            f"Algorithm has no topology node: {algorithm}"
        )

    trace.enter(algorithm_node)
    trace.enter("ARTIFACT")

    original_hash = sha256(original)
    payload_hash = sha256(payload)

    trace.enter("SHA256")

    original_size = len(original)
    payload_size = len(payload)

    reduction_percent = (
        ((original_size - payload_size) / original_size) * 100
        if original_size
        else 0.0
    )

    root = merkle_root([
        original_hash,
        payload_hash,
    ])

    trace.enter("MERKLE")
    trace.enter("VERIFY")
    trace.enter("SEALED")
    trace.validate()

    return AdaptiveArtifact(
        artifact_id=str(uuid.uuid4()),
        filename=filename,
        media_type=media_type,
        algorithm=algorithm,
        original_size=original_size,
        payload_size=payload_size,
        reduction_percent=round(reduction_percent, 3),
        original_sha256=original_hash,
        payload_sha256=payload_hash,
        merkle_root=root,
        payload=payload,
        execution_path=tuple(trace.path),
    )


def restore_artifact(
    artifact: AdaptiveArtifact,
) -> dict[str, Any]:

    restored = decompress_payload(
        artifact.algorithm,
        artifact.payload,
    )

    restored_sha256 = sha256(restored)

    return {
        "restored": restored,
        "restored_sha256": restored_sha256,
        "lossless_restore": (
            restored_sha256 == artifact.original_sha256
        ),
    }
