from __future__ import annotations

import gzip
import hashlib
import json
import uuid
from dataclasses import dataclass
from typing import Any

import zstandard as zstd


FORMAT_VERSION = "0.1.0"


def sha256(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def _json_bytes(value: Any) -> bytes:
    return json.dumps(
        value,
        sort_keys=True,
        separators=(",", ":"),
        ensure_ascii=False,
    ).encode("utf-8")


def _merkle_root(values: list[str]) -> str:
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


def _candidate_sizes(
    original: bytes,
) -> dict[str, bytes]:
    candidates = {
        "store": original,
        "gzip": gzip.compress(original, compresslevel=9),
        "zstd": zstd.ZstdCompressor(level=9).compress(original),
    }

    return candidates


def choose_algorithm(original: bytes) -> tuple[str, bytes]:
    candidates = _candidate_sizes(original)

    # The adaptive rule is deliberately simple:
    # choose the smallest payload representation.
    algorithm = min(
        candidates,
        key=lambda name: len(candidates[name]),
    )

    return algorithm, candidates[algorithm]


def compress_payload(original: bytes) -> tuple[str, bytes]:
    return choose_algorithm(original)


def decompress_payload(algorithm: str, payload: bytes) -> bytes:
    if algorithm == "store":
        return payload

    if algorithm == "gzip":
        return gzip.decompress(payload)

    if algorithm == "zstd":
        return zstd.ZstdDecompressor().decompress(payload)

    raise ValueError(f"Unsupported CLOUUD algorithm: {algorithm}")


@dataclass
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
        }


def create_artifact(
    filename: str,
    original: bytes,
    media_type: str = "application/octet-stream",
) -> AdaptiveArtifact:
    algorithm, payload = compress_payload(original)

    original_hash = sha256(original)
    payload_hash = sha256(payload)

    merkle_root = _merkle_root([
        original_hash,
        payload_hash,
    ])

    original_size = len(original)
    payload_size = len(payload)

    reduction_percent = (
        ((original_size - payload_size) / original_size) * 100
        if original_size
        else 0.0
    )

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
        merkle_root=merkle_root,
        payload=payload,
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


def verify_artifact(
    artifact: AdaptiveArtifact,
) -> dict[str, Any]:
    payload_valid = (
        sha256(artifact.payload)
        == artifact.payload_sha256
    )

    expected_merkle = _merkle_root([
        artifact.original_sha256,
        artifact.payload_sha256,
    ])

    merkle_valid = expected_merkle == artifact.merkle_root

    restored_result = restore_artifact(artifact)

    sealed = (
        payload_valid
        and merkle_valid
        and restored_result["lossless_restore"]
    )

    return {
        "payload_valid": payload_valid,
        "merkle_valid": merkle_valid,
        "proof_valid": payload_valid and merkle_valid,
        "lossless_restore": restored_result["lossless_restore"],
        "restored_sha256": restored_result["restored_sha256"],
        "sealed": sealed,
    }
