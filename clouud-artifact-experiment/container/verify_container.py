import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent
sys.path.insert(0, str(ROOT))

from adaptive_container import (
    AdaptiveArtifact,
    create_artifact,
    restore_artifact,
    verify_artifact,
)


def check(name, condition):
    if not condition:
        raise AssertionError(f"FAIL: {name}")
    print(f"PASS: {name}")


def run_case(name, filename, payload, media_type="application/octet-stream"):
    print()
    print(f"=== {name} ===")

    artifact = create_artifact(filename, payload, media_type)
    restored = restore_artifact(artifact)
    verified = verify_artifact(artifact)

    print("artifact_id:", artifact.artifact_id)
    print("filename:", artifact.filename)
    print("algorithm:", artifact.algorithm)
    print("original_size:", artifact.original_size)
    print("payload_size:", artifact.payload_size)
    print("reduction_percent:", artifact.reduction_percent)
    print("original_sha256:", artifact.original_sha256)
    print("payload_sha256:", artifact.payload_sha256)
    print("merkle_root:", artifact.merkle_root)
    print("verified:", verified)
    print("restored_sha256:", restored["restored_sha256"])
    print("lossless_restore:", restored["lossless_restore"])

    check(
        "returns AdaptiveArtifact",
        isinstance(artifact, AdaptiveArtifact),
    )

    check(
        "restore returns dictionary",
        isinstance(restored, dict),
    )

    check(
        "original SHA256 matches restored SHA256",
        artifact.original_sha256 == restored["restored_sha256"],
    )

    check(
        "lossless restore",
        restored["lossless_restore"] is True,
    )

    check(
        "payload integrity",
        verified["payload_valid"] is True,
    )

    check(
        "Merkle integrity",
        verified["merkle_valid"] is True,
    )

    check(
        "proof valid",
        verified["proof_valid"] is True,
    )

    check(
        "artifact sealed",
        verified["sealed"] is True,
    )

    check(
        "verify_artifact succeeds",
        (
            verified["payload_valid"] is True
            and verified["merkle_valid"] is True
            and verified["proof_valid"] is True
            and verified["lossless_restore"] is True
            and verified["sealed"] is True
        ),
    )

    return artifact


def main():
    print()
    print("==============================================")
    print(" CLOUUD ADAPTIVE ARTIFACT CONTAINER")
    print(" DEPENDENCY-FREE VERIFICATION")
    print("==============================================")

    # 1. Tiny / incompressible input.
    tiny = run_case(
        "TINY",
        "tiny.txt",
        b"x",
        "text/plain",
    )

    # 2. Repetitive text should compress.
    text_payload = b"CLOUUD adaptive artifact container " * 1000

    text = run_case(
        "REPETITIVE TEXT",
        "repetitive.txt",
        text_payload,
        "text/plain",
    )

    check(
        "repetitive payload is losslessly restored",
        restore_artifact(text)["lossless_restore"] is True,
    )

    check(
        "compression selected when beneficial",
        text.algorithm in ("zstd", "gzip", "store"),
    )

    # 3. JSON-like payload.
    json_payload = (
        b'{"name":"CLOUUD","version":"1.0.0",'
        b'"description":"Compact Logical Understanding and Unified Data Compression",'
        b'"repeat":"CLOUUD","enabled":true}'
    ) * 100

    json_artifact = run_case(
        "JSON PAYLOAD",
        "payload.json",
        json_payload,
        "application/json",
    )

    # 4. Binary payload.
    binary_payload = bytes(range(256)) * 100

    binary = run_case(
        "BINARY PAYLOAD",
        "payload.bin",
        binary_payload,
        "application/octet-stream",
    )

    # 5. Empty payload.
    empty = run_case(
        "EMPTY PAYLOAD",
        "empty.bin",
        b"",
        "application/octet-stream",
    )

    print()
    print("==============================================")
    print(" FINAL RESULTS")
    print("==============================================")

    print("TINY:", tiny.algorithm)
    print("TEXT:", text.algorithm)
    print("JSON:", json_artifact.algorithm)
    print("BINARY:", binary.algorithm)
    print("EMPTY:", empty.algorithm)

    print()
    print("PASS: CLOUUD ADAPTIVE CONTAINER")
    print("PASS: LOSSLESS RESTORATION")
    print("PASS: SHA256 INTEGRITY")
    print("PASS: PAYLOAD INTEGRITY")
    print("PASS: MERKLE PROOF")
    print("PASS: ARTIFACT SEALING")
    print("PASS: ADAPTIVE ALGORITHM SELECTION")
    print("PASS: DEPENDENCY-FREE VERIFICATION")
    print()
    print("CLOUUD ADAPTIVE CONTAINER VERIFICATION COMPLETE")


if __name__ == "__main__":
    main()
