from __future__ import annotations

from dataclasses import dataclass

from .topology import EDGES, NODES, ExecutionTrace


ALGORITHM_NODES = ("STORE", "GZIP", "ZSTD")


@dataclass(frozen=True)
class ASCIIIFrame:
    nodes: tuple[str, ...]
    active_node: str | None
    execution_path: tuple[str, ...]
    sealed: bool

    def text(self) -> str:
        lines: list[str] = []

        lines.append("INPUT")
        lines.append("|")
        lines.append("v")
        lines.append("ROUTER")
        lines.append("|")

        for node in ALGORITHM_NODES:
            marker = " <-- ACTIVE" if node == self.active_node else ""
            lines.append(f"+--> {node}{marker}")

        lines.append("|")
        lines.append("v")
        lines.append("ARTIFACT")
        lines.append("|")
        lines.append("v")
        lines.append("SHA256")
        lines.append("|")
        lines.append("v")
        lines.append("MERKLE")
        lines.append("|")
        lines.append("v")
        lines.append("VERIFY")
        lines.append("|")
        lines.append("v")

        sealed_marker = " [OK]" if self.sealed else ""
        lines.append(f"SEALED{sealed_marker}")

        lines.append("")
        lines.append("## ACTUAL EXECUTION PATH")
        lines.append("")
        lines.append(" -> ".join(self.execution_path))

        return "\n".join(lines)


def frame_from_trace(trace: ExecutionTrace) -> ASCIIIFrame:
    trace.validate()

    return ASCIIIFrame(
        nodes=tuple(NODES),
        active_node=trace.algorithm_node,
        execution_path=tuple(trace.path),
        sealed=bool(
            trace.path
            and trace.path[-1] == "SEALED"
        ),
    )


def render_trace(trace: ExecutionTrace) -> str:
    return frame_from_trace(trace).text()


def assert_frame_matches_trace(
    frame: ASCIIIFrame,
    trace: ExecutionTrace,
) -> None:
    if frame.execution_path != tuple(trace.path):
        raise AssertionError(
            "ASCIII execution path does not match kernel trace"
        )

    if frame.active_node != trace.algorithm_node:
        raise AssertionError(
            "ASCIII active node does not match kernel trace"
        )

    expected_sealed = bool(
        trace.path
        and trace.path[-1] == "SEALED"
    )

    if frame.sealed != expected_sealed:
        raise AssertionError(
            "ASCIII seal state does not match kernel trace"
        )

    if frame.nodes != tuple(NODES):
        raise AssertionError(
            "ASCIII topology does not match kernel topology"
        )

    for left, right in zip(
        trace.path,
        trace.path[1:],
    ):
        if (left, right) not in EDGES:
            raise AssertionError(
                f"{left} -> {right} is an invalid execution edge"
            )
