from __future__ import annotations

from .artifact import AdaptiveArtifact, merkle_root, restore_artifact, sha256


def verify_artifact(
    artifact: AdaptiveArtifact,
) -> dict[str, bool | str]:
    payload_valid = (
        sha256(artifact.payload)
        == artifact.payload_sha256
    )

    expected_merkle = merkle_root([
        artifact.original_sha256,
        artifact.payload_sha256,
    ])

    merkle_valid = (
        expected_merkle == artifact.merkle_root
    )

    restored_result = restore_artifact(artifact)

    lossless_restore = restored_result["lossless_restore"]

    sealed = (
        payload_valid
        and merkle_valid
        and lossless_restore
    )

    return {
        "payload_valid": payload_valid,
        "merkle_valid": merkle_valid,
        "proof_valid": payload_valid and merkle_valid,
        "lossless_restore": lossless_restore,
        "restored_sha256": restored_result["restored_sha256"],
        "sealed": sealed,
    }
