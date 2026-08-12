from .topology import (
    EDGES,
    NODES,
    assert_path_matches_algorithm,
    render_ascii,
    topology_for_algorithm,
)


def check(name, condition):
    if not condition:
        raise AssertionError(f"FAIL: {name}")

    print(f"PASS: {name}")


def main():
    print("=" * 45)
    print(" CLOUUD ARTIFACT KERNEL")
    print(" KERNEL-03 GRAPH EXECUTION GATE")
    print("=" * 45)

    for algorithm in ("store", "gzip", "zstd"):
        print(f"\n=== {algorithm.upper()} ===")

        trace = topology_for_algorithm(algorithm)

        check(
            f"{algorithm}: graph nodes valid",
            all(node in NODES for node in trace.path),
        )

        check(
            f"{algorithm}: starts at INPUT",
            trace.path[0] == "INPUT",
        )

        check(
            f"{algorithm}: ends at SEALED",
            trace.path[-1] == "SEALED",
        )

        check(
            f"{algorithm}: selected algorithm appears in path",
            {
                "store": "STORE",
                "gzip": "GZIP",
                "zstd": "ZSTD",
            }[algorithm] in trace.path,
        )

        check(
            f"{algorithm}: execution edges valid",
            all(
                edge in EDGES
                for edge in zip(trace.path, trace.path[1:])
            ),
        )

        assert_path_matches_algorithm(trace, algorithm)
        check(
            f"{algorithm}: algorithm/path correspondence",
            True,
        )

        rendered = render_ascii(trace)

        check(
            f"{algorithm}: ASCII graph rendered",
            "ACTUAL EXECUTION PATH" in rendered,
        )

        print()
        print(rendered)

    print("=" * 45)
    print("PASS: STATIC GRAPH")
    print("PASS: EXECUTION TRACE")
    print("PASS: ALGORITHM/PATH CORRESPONDENCE")
    print("PASS: ASCII GRAPH RENDER")
    print("KERNEL-03 GRAPH EXECUTION GATE COMPLETE")
    print("=" * 45)


if __name__ == "__main__":
    main()
