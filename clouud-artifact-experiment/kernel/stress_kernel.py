import hashlib
import os
import random
import time

from kernel.artifact import create_artifact, restore_artifact
from kernel.verify import verify_artifact


def sha256(data):
    return hashlib.sha256(data).hexdigest()


def check(name, condition):
    if not condition:
        raise AssertionError(f"FAIL: {name}")
    print(f"PASS: {name}")


def round_trip(name, payload):
    artifact = create_artifact(
        name,
        payload,
        "application/octet-stream",
    )

    restored = restore_artifact(artifact)
    verified = verify_artifact(artifact)

    check(
        f"{name}: lossless",
        restored["restored_sha256"] == sha256(payload),
    )

    check(
        f"{name}: payload integrity",
        verified["payload_valid"] is True,
    )

    check(
        f"{name}: Merkle integrity",
        verified["merkle_valid"] is True,
    )

    check(
        f"{name}: sealed",
        verified["sealed"] is True,
    )

    if artifact.algorithm == "store":
        check(
            f"{name}: store fallback valid",
            artifact.payload_size >= artifact.original_size,
        )
    else:
        check(
            f"{name}: compression beneficial",
            artifact.payload_size < artifact.original_size,
        )

    print("algorithm:", artifact.algorithm)
    print("original_size:", artifact.original_size)
    print("payload_size:", artifact.payload_size)
    print("reduction_percent:", artifact.reduction_percent)

    return artifact


def main():
    print()
    print("==============================================")
    print(" CLOUUD ARTIFACT KERNEL")
    print(" KERNEL-02 STRESS GATE")
    print("==============================================")

    print()
    print("=== EDGE SIZES ===")

    sizes = [
        0, 1, 2, 7, 8,
        15, 16, 31, 32,
        63, 64, 127, 128,
        255, 256, 511, 512,
        1023, 1024, 4096,
    ]

    for size in sizes:
        payload = os.urandom(size)

        round_trip(
            f"random-{size}",
            payload,
        )

    print()
    print("=== HIGHLY COMPRESSIBLE ===")

    repetitive = b"A" * 100000

    artifact = round_trip(
        "repetitive-100k",
        repetitive,
    )

    check(
        "repetitive compression beneficial",
        artifact.payload_size < artifact.original_size,
    )

    print()
    print("=== STRUCTURED DATA ===")

    json_payload = (
        b'{"artifact":"CLOUUD","enabled":true,'
        b'"values":[1,2,3,4,5]}'
    ) * 5000

    round_trip(
        "structured-json",
        json_payload,
    )

    print()
    print("=== BINARY PATTERN ===")

    binary = bytes(range(256)) * 1000

    round_trip(
        "binary-pattern",
        binary,
    )

    print()
    print("=== RANDOM DATA ===")

    random_payload = os.urandom(100000)

    round_trip(
        "random-100k",
        random_payload,
    )

    print()
    print("=== PROPERTY TEST ===")

    random.seed(42)
    iterations = 500

    start = time.perf_counter()

    for i in range(iterations):
        size = random.randint(0, 4096)
        payload = os.urandom(size)

        artifact = create_artifact(
            f"property-{i}",
            payload,
        )

        restored = restore_artifact(artifact)

        if restored["restored_sha256"] != sha256(payload):
            raise AssertionError(
                f"FAIL: property test iteration {i}"
            )

    elapsed = time.perf_counter() - start

    print(f"PASS: {iterations} randomized round trips")
    print(f"elapsed_seconds: {elapsed:.3f}")

    print()
    print("==============================================")
    print(" KERNEL-02 STRESS GATE COMPLETE")
    print("==============================================")


if __name__ == "__main__":
    main()
