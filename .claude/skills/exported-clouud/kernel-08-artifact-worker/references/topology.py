from __future__ import annotations

from dataclasses import dataclass, field

NODES = (
    "INPUT",
    "ROUTER",
    "STORE",
    "GZIP",
    "ZSTD",
    "ARTIFACT",
    "SHA256",
    "MERKLE",
    "VERIFY",
    "SEALED",
)

ALGORITHMS = {
    "store": "STORE",
    "gzip": "GZIP",
    "zstd": "ZSTD",
}

EDGES = (
    ("INPUT", "ROUTER"),
    ("ROUTER", "STORE"),
    ("ROUTER", "GZIP"),
    ("ROUTER", "ZSTD"),
    ("STORE", "ARTIFACT"),
    ("GZIP", "ARTIFACT"),
    ("ZSTD", "ARTIFACT"),
    ("ARTIFACT", "SHA256"),
    ("SHA256", "MERKLE"),
    ("MERKLE", "VERIFY"),
    ("VERIFY", "SEALED"),
)


@dataclass
class ExecutionTrace:
    path: list[str] = field(default_factory=list)

    def enter(self, node: str) -> None:
        if node not in NODES:
            raise ValueError(f"Unknown topology node: {node}")

        if self.path and self.path[-1] == node:
            return

        self.path.append(node)

    @property
    def algorithm_node(self) -> str | None:
        for node in ("STORE", "GZIP", "ZSTD"):
            if node in self.path:
                return node
        return None

    def validate(self) -> bool:
        if not self.path:
            return False

        if self.path[0] != "INPUT":
            return False

        if self.path[-1] != "SEALED":
            return False

        for left, right in zip(self.path, self.path[1:]):
            if (left, right) not in EDGES:
                return False

        return True

    def render(self) -> str:
        active = self.algorithm_node

        lines = [
            "INPUT",
            "|",
            "v",
            "ROUTER",
            "|",
            f"+--> STORE{' <-- ACTIVE' if active == 'STORE' else ''}",
            f"+--> GZIP{' <-- ACTIVE' if active == 'GZIP' else ''}",
            f"+--> ZSTD{' <-- ACTIVE' if active == 'ZSTD' else ''}",
            "|",
            "v",
            "ARTIFACT",
            "|",
            "v",
            "SHA256",
            "|",
            "v",
            "MERKLE",
            "|",
            "v",
            "VERIFY",
            "|",
            "v",
            "SEALED [OK]",
        ]

        return "\n".join(lines)

    def execution_path(self) -> str:
        return " -> ".join(self.path)


def trace_for_algorithm(algorithm: str) -> ExecutionTrace:
    try:
        selected = ALGORITHMS[algorithm]
    except KeyError:
        raise ValueError(f"Unsupported topology algorithm: {algorithm}")

    trace = ExecutionTrace()

    for node in (
        "INPUT",
        "ROUTER",
        selected,
        "ARTIFACT",
        "SHA256",
        "MERKLE",
        "VERIFY",
        "SEALED",
    ):
        trace.enter(node)

    return trace


def assert_path_matches_algorithm(
    path: list[str],
    algorithm: str,
) -> None:
    expected = ALGORITHMS.get(algorithm)

    if expected is None:
        raise ValueError(
            f"Unsupported topology algorithm: {algorithm}"
        )

    if len(path) < 3:
        raise AssertionError("Execution path is too short")

    if path[0] != "INPUT":
        raise AssertionError("Execution path must start at INPUT")

    if path[1] != "ROUTER":
        raise AssertionError("Execution path must pass through ROUTER")

    if path[2] != expected:
        raise AssertionError(
            f"Expected {expected} at algorithm position, "
            f"got {path[2]}"
        )

    if path[-1] != "SEALED":
        raise AssertionError("Execution path must end at SEALED")


def render_ascii(
    path: list[str],
    algorithm: str | None = None,
) -> str:
    """
    Render the CLOUUD execution topology as ASCII.

    The active algorithm is determined from the execution path unless
    explicitly supplied.
    """
    trace = ExecutionTrace()

    for node in path:
        trace.enter(node)

    if not trace.validate():
        raise AssertionError(
            "Cannot render invalid CLOUUD execution path"
        )

    if algorithm is not None:
        assert_path_matches_algorithm(path, algorithm)

    return trace.render()


def topology_for_algorithm(algorithm: str) -> ExecutionTrace:
    """
    Build an execution trace for a selected CLOUUD algorithm.
    """
    return trace_for_algorithm(algorithm)


def assert_path_matches_algorithm(
    trace: ExecutionTrace,
    algorithm: str,
) -> None:
    """
    Assert that an execution trace actually follows the selected
    compression algorithm branch.
    """
    expected = ALGORITHMS.get(algorithm)

    if expected is None:
        raise ValueError(
            f"Unsupported topology algorithm: {algorithm}"
        )

    if not isinstance(trace, ExecutionTrace):
        raise TypeError(
            "trace must be an ExecutionTrace"
        )

    if not trace.validate():
        raise AssertionError(
            "Execution trace contains invalid topology edges"
        )

    if trace.path[0] != "INPUT":
        raise AssertionError(
            "Execution trace must start at INPUT"
        )

    if trace.path[1] != "ROUTER":
        raise AssertionError(
            "Execution trace must pass through ROUTER"
        )

    if trace.path[2] != expected:
        raise AssertionError(
            f"Expected algorithm node {expected}, "
            f"got {trace.path[2]}"
        )

    if trace.path[-1] != "SEALED":
        raise AssertionError(
            "Execution trace must end at SEALED"
        )


def render_ascii(trace: ExecutionTrace) -> str:
    """
    Render a complete topology view including the actual execution path.
    """
    if not isinstance(trace, ExecutionTrace):
        raise TypeError(
            "trace must be an ExecutionTrace"
        )

    if not trace.validate():
        raise AssertionError(
            "Cannot render invalid execution trace"
        )

    return (
        trace.render()
        + "\n\n"
        + "## ACTUAL EXECUTION PATH\n\n"
        + trace.execution_path()
    )
