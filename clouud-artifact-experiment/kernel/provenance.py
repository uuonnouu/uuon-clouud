from __future__ import annotations

from .topology import EDGES, NODES

ALGORITHM_NODES = {
    "store": "STORE",
    "gzip": "GZIP",
    "zstd": "ZSTD",
}


class ProvenanceError(ValueError):
    """Raised when an artifact execution path is invalid."""


def validate_execution_path(
    path: tuple[str, ...] | list[str],
    algorithm: str,
) -> bool:
    path = tuple(path)

    if not path:
        raise ProvenanceError("Execution path is empty")

    if algorithm not in ALGORITHM_NODES:
        raise ProvenanceError(
            f"Unsupported algorithm: {algorithm}"
        )

    if path[0] != "INPUT":
        raise ProvenanceError(
            "Execution path must start at INPUT"
        )

    if path[-1] != "SEALED":
        raise ProvenanceError(
            "Execution path must end at SEALED"
        )

    for node in path:
        if node not in NODES:
            raise ProvenanceError(
                f"Unknown topology node: {node}"
            )

    for left, right in zip(path, path[1:]):
        if (left, right) not in EDGES:
            raise ProvenanceError(
                f"Invalid execution edge: {left} -> {right}"
            )

    expected_algorithm_node = ALGORITHM_NODES[algorithm]

    if expected_algorithm_node not in path:
        raise ProvenanceError(
            f"Algorithm node {expected_algorithm_node} "
            "missing from execution path"
        )

    if path.index(expected_algorithm_node) != 2:
        raise ProvenanceError(
            "Algorithm node is not immediately after ROUTER"
        )

    algorithm_nodes = set(ALGORITHM_NODES.values())

    selected_nodes = [
        node for node in path
        if node in algorithm_nodes
    ]

    if selected_nodes != [expected_algorithm_node]:
        raise ProvenanceError(
            "Execution path contains an incorrect "
            "algorithm branch"
        )

    return True


def provenance_status(
    path: tuple[str, ...] | list[str],
    algorithm: str,
) -> dict[str, bool | str]:
    try:
        valid = validate_execution_path(
            path,
            algorithm,
        )
    except ProvenanceError as exc:
        return {
            "provenance_valid": False,
            "error": str(exc),
        }

    return {
        "provenance_valid": valid,
        "algorithm": algorithm,
        "algorithm_node": ALGORITHM_NODES[algorithm],
        "execution_path": " -> ".join(path),
    }
