from .asciii import (
    assert_frame_matches_trace,
    frame_from_trace,
    render_trace,
)
from .topology import topology_for_algorithm


def check(name, condition):
    if not condition:
        raise AssertionError(f"FAIL: {name}")
    print(f"PASS: {name}")


def main():
    print("=" * 45)
    print(" CLOUUD ARTIFACT KERNEL")
    print(" KERNEL-06 ASCIII MIRROR GATE")
    print("=" * 45)

    for algorithm in ("store", "gzip", "zstd"):
        print(f"\n=== {algorithm.upper()} ===")

        trace = topology_for_algorithm(algorithm)
        frame = frame_from_trace(trace)

        assert_frame_matches_trace(frame, trace)

        check(
            f"{algorithm}: frame matches trace",
            frame.execution_path == tuple(trace.path),
        )

        check(
            f"{algorithm}: active node matches",
            frame.active_node == trace.algorithm_node,
        )

        check(
            f"{algorithm}: seal state matches",
            frame.sealed is True,
        )

        rendered = render_trace(trace)

        check(
            f"{algorithm}: INPUT rendered",
            "INPUT" in rendered,
        )

        check(
            f"{algorithm}: ROUTER rendered",
            "ROUTER" in rendered,
        )

        check(
            f"{algorithm}: active branch rendered",
            f"{frame.active_node} <-- ACTIVE" in rendered,
        )

        check(
            f"{algorithm}: execution path rendered",
            " -> ".join(trace.path) in rendered,
        )

        check(
            f"{algorithm}: SEALED rendered",
            "SEALED [OK]" in rendered,
        )

        print()
        print(rendered)

    print("=" * 45)
    print("PASS: KERNEL TRACE")
    print("PASS: ASCIII FRAME")
    print("PASS: ACTIVE BRANCH")
    print("PASS: EXECUTION PATH")
    print("PASS: SEAL STATE")
    print("PASS: ASCII RENDER")
    print("KERNEL-06 ASCIII MIRROR GATE COMPLETE")
    print("=" * 45)


if __name__ == "__main__":
    main()
