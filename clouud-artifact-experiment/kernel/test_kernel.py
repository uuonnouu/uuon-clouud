from kernel.artifact import create_artifact, restore_artifact
from kernel.verify import verify_artifact


def check(name, condition):
    if not condition:
        raise AssertionError(f"FAIL: {name}")
    print(f"PASS: {name}")


def run_case(name, filename, payload, media_type):
    print()
    print(f"=== {name} ===")

    artifact = create_artifact(filename, payload, media_type)
    restored = restore_artifact(artifact)
    verified = verify_artifact(artifact)

    check(
        "original size recorded",
        artifact.original_size == len(payload),
    )

    check(
        "payload size recorded",
        artifact.payload_size == len(artifact.payload),
    )

    check(
        "SHA256 restored",
        artifact.original_sha256 == restored["restored_sha256"],
    )

    check(
        "lossless restoration",
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

    if artifact.algorithm == "store":
        check(
            "store selected when compression is not beneficial",
            artifact.payload_size >= artifact.original_size,
        )
    else:
        check(
            "compression selected when beneficial",
            artifact.payload_size < artifact.original_size,
        )

    print("algorithm:", artifact.algorithm)
    print("original_size:", artifact.original_size)
    print("payload_size:", artifact.payload_size)
    print("reduction_percent:", artifact.reduction_percent)


def main():
    print()
    print("==============================================")
    print(" CLOUUD ARTIFACT KERNEL")
    print(" KERNEL-01 VERIFICATION")
    print("==============================================")

    run_case(
        "TINY",
        "tiny.txt",
        b"x",
        "text/plain",
    )

    run_case(
        "REPETITIVE TEXT",
        "repetitive.txt",
        b"CLOUUD adaptive artifact container " * 1000,
        "text/plain",
    )

    run_case(
        "JSON",
        "payload.json",
        (
            b'{"name":"CLOUUD","version":"1.0.0",'
            b'"enabled":true}'
        ) * 100,
        "application/json",
    )

    run_case(
        "BINARY",
        "payload.bin",
        bytes(range(256)) * 100,
        "application/octet-stream",
    )

    run_case(
        "EMPTY",
        "empty.bin",
        b"",
        "application/octet-stream",
    )

    print()
    print("==============================================")
    print(" KERNEL-01 COMPLETE")
    print("==============================================")


if __name__ == "__main__":
    main()
