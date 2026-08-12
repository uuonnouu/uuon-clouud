from .artifact import create_artifact
from .provenance import validate_execution_path, ProvenanceError
from .verify import verify_artifact


def check(name: str, condition: bool) -> None:
    if not condition:
        raise AssertionError(f"FAIL: {name}")

    print(f"PASS: {name}")


def main() -> None:
    print("=" * 45)
    print(" CLOUUD ARTIFACT KERNEL")
    print(" KERNEL-04 PROVENANCE GATE")
    print("=" * 45)

    artifact = create_artifact(
        "provenance.txt",
        b"CLOUUD " * 1000,
        "text/plain",
    )

    print()
    print("=== VALID ARTIFACT ===")

    result = verify_artifact(artifact)

    check(
        "valid artifact provenance",
        result["provenance_valid"] is True,
    )

    check(
        "valid artifact sealed",
        result["sealed"] is True,
    )

    print(
        "path:",
        " -> ".join(artifact.execution_path),
    )

    print()
    print("=== TAMPER: WRONG ALGORITHM ===")

    try:
        validate_execution_path(
            artifact.execution_path,
            "store"
            if artifact.algorithm != "store"
            else "gzip",
        )
    except ProvenanceError:
        print("PASS: algorithm/path mismatch detected")
    else:
        raise AssertionError(
            "FAIL: algorithm/path mismatch not detected"
        )

    print()
    print("=== TAMPER: REMOVE ROUTER ===")

    bad_path = tuple(
        node
        for node in artifact.execution_path
        if node != "ROUTER"
    )

    try:
        validate_execution_path(
            bad_path,
            artifact.algorithm,
        )
    except ProvenanceError:
        print("PASS: missing ROUTER detected")
    else:
        raise AssertionError(
            "FAIL: missing ROUTER not detected"
        )

    print()
    print("=== TAMPER: WRONG BRANCH ===")

    wrong_branch = list(artifact.execution_path)

    algorithm_index = 2

    wrong_branch[algorithm_index] = (
        "STORE"
        if wrong_branch[algorithm_index] != "STORE"
        else "GZIP"
    )

    try:
        validate_execution_path(
            wrong_branch,
            artifact.algorithm,
        )
    except ProvenanceError:
        print("PASS: wrong branch detected")
    else:
        raise AssertionError(
            "FAIL: wrong branch not detected"
        )

    print()
    print("=== TAMPER: INVALID EDGE ===")

    invalid_edge = list(artifact.execution_path)

    invalid_edge[3] = "VERIFY"

    try:
        validate_execution_path(
            invalid_edge,
            artifact.algorithm,
        )
    except ProvenanceError:
        print("PASS: invalid edge detected")
    else:
        raise AssertionError(
            "FAIL: invalid edge not detected"
        )

    print()
    print("=== TAMPER: UNSEALED PATH ===")

    unsealed = artifact.execution_path[:-1]

    try:
        validate_execution_path(
            unsealed,
            artifact.algorithm,
        )
    except ProvenanceError:
        print("PASS: unsealed path detected")
    else:
        raise AssertionError(
            "FAIL: unsealed path not detected"
        )

    print()
    print("=" * 45)
    print("PASS: EXECUTION PROVENANCE")
    print("PASS: ALGORITHM/PATH INTEGRITY")
    print("PASS: ROUTER INTEGRITY")
    print("PASS: EDGE INTEGRITY")
    print("PASS: SEALED STATE")
    print("PASS: TAMPER DETECTION")
    print("KERNEL-04 PROVENANCE GATE COMPLETE")
    print("=" * 45)


if __name__ == "__main__":
    main()
