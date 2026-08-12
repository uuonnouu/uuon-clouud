from .artifact import create_artifact
from .asciii import assert_frame_matches_trace, frame_from_trace, render_trace
from .container import pack_artifact, unpack_and_verify
from .provenance import validate_provenance
from .verify import verify_artifact


def check(name, condition):
    if not condition:
        raise AssertionError(f"FAIL: {name}")
    print(f"PASS: {name}")


def main():
    print("=" * 45)
    print(" CLOUUD ARTIFACT KERNEL")
    print(" KERNEL-07 INTEGRATED GATE")
    print("=" * 45)

    original = (
        b"CLOUUD KERNEL-07\n"
        b"INTEGRATED ARTIFACT PIPELINE\n"
        b"ASCIII PROVENANCE MIRROR\n"
    ) * 100

    artifact = create_artifact(
        filename="kernel07.txt",
        original=original,
        media_type="text/plain",
    )

    verification = verify_artifact(artifact)

    check(
        "artifact verification",
        verification["sealed"] is True,
    )

    provenance = validate_provenance(artifact)

    check(
        "artifact provenance",
        provenance["valid"] is True,
    )

    frame = frame_from_trace(
        __import__(
            "kernel.topology",
            fromlist=["topology_for_algorithm"],
        ).topology_for_algorithm(artifact.algorithm)
    )

    assert_frame_matches_trace(
        frame,
        __import__(
            "kernel.topology",
            fromlist=["topology_for_algorithm"],
        ).topology_for_algorithm(artifact.algorithm),
    )

    check(
        "ASCIII execution mirror",
        frame.execution_path == artifact.execution_path,
    )

    container = pack_artifact(artifact)

    check(
        "container produced",
        isinstance(container, bytes) and len(container) > 0,
    )

    restored, unpacked_verification = unpack_and_verify(container)

    check(
        "container round trip",
        restored.artifact_id == artifact.artifact_id,
    )

    check(
        "container verification",
        unpacked_verification["sealed"] is True,
    )

    check(
        "execution path preserved",
        restored.execution_path == artifact.execution_path,
    )

    print()
    print(render_trace(
        __import__(
            "kernel.topology",
            fromlist=["topology_for_algorithm"],
        ).topology_for_algorithm(artifact.algorithm)
    ))

    print("=" * 45)
    print("PASS: ARTIFACT")
    print("PASS: VERIFICATION")
    print("PASS: PROVENANCE")
    print("PASS: CONTAINER")
    print("PASS: DESERIALIZATION")
    print("PASS: ASCIII")
    print("PASS: EXECUTION PATH PRESERVATION")
    print("KERNEL-07 INTEGRATED GATE COMPLETE")
    print("=" * 45)


if __name__ == "__main__":
    main()
