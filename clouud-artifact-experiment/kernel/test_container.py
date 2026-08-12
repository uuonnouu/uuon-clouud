from .artifact import create_artifact
from .container import (
    CONTAINER_VERSION,
    deserialize_artifact,
    pack_artifact,
    serialize_artifact,
    unpack_and_verify,
)


def check(name, condition):
    if not condition:
        raise AssertionError(f"FAIL: {name}")
    print(f"PASS: {name}")


def main():
    print("=" * 45)
    print(" CLOUUD ARTIFACT KERNEL")
    print(" KERNEL-05 CONTAINER GATE")
    print("=" * 45)

    original = (
        b"CLOUUD KERNEL-05\n"
        b"container provenance mirror\n"
    ) * 100

    artifact = create_artifact(
        filename="kernel05.txt",
        original=original,
        media_type="text/plain",
    )

    container = serialize_artifact(artifact)

    check(
        "canonical container produced",
        isinstance(container, bytes) and len(container) > 0,
    )

    restored = deserialize_artifact(container)

    check("artifact id preserved",
          restored.artifact_id == artifact.artifact_id)

    check("filename preserved",
          restored.filename == artifact.filename)

    check("media type preserved",
          restored.media_type == artifact.media_type)

    check("algorithm preserved",
          restored.algorithm == artifact.algorithm)

    check("original size preserved",
          restored.original_size == artifact.original_size)

    check("payload size preserved",
          restored.payload_size == artifact.payload_size)

    check("SHA256 preserved",
          restored.original_sha256 == artifact.original_sha256)

    check("payload SHA256 preserved",
          restored.payload_sha256 == artifact.payload_sha256)

    check("Merkle root preserved",
          restored.merkle_root == artifact.merkle_root)

    check("execution path preserved",
          restored.execution_path == artifact.execution_path)

    check("payload preserved",
          restored.payload == artifact.payload)

    verification = unpack_and_verify(container)["verification"]

    check("payload integrity after deserialize",
          verification["payload_valid"])

    check("Merkle integrity after deserialize",
          verification["merkle_valid"])

    check("proof valid after deserialize",
          verification["proof_valid"])

    check("lossless restore after deserialize",
          verification["lossless_restore"])

    check("artifact sealed after deserialize",
          verification["sealed"])

    packed = pack_artifact(
        "packed.txt",
        original,
        "text/plain",
    )

    unpacked = deserialize_artifact(packed)

    check(
        "pack/unpack round trip",
        unpacked.original_sha256 == artifact.original_sha256,
    )

    check(
        "container version",
        CONTAINER_VERSION == "0.1.0",
    )

    print("=" * 45)
    print("PASS: CANONICAL SERIALIZATION")
    print("PASS: ARTIFACT RECONSTRUCTION")
    print("PASS: PROVENANCE PRESERVATION")
    print("PASS: POST-DESERIALIZATION VERIFICATION")
    print("PASS: LOSSLESS CONTAINER ROUND TRIP")
    print("KERNEL-05 CONTAINER GATE COMPLETE")
    print("=" * 45)


if __name__ == "__main__":
    main()
