from .compression_bottleneck import analyze_compression, render_asciii


def main() -> None:
    corpus = {
        "python": (
            b"def compress(data):\n"
            b"    return compress(data)\n"
        ) * 1000,
        "javascript": (
            b"function compress(data) { return compress(data); }\n"
        ) * 1000,
        "json": (
            b'{"artifact":"UUON","status":"active","type":"data"}\n'
        ) * 1000,
        "csv": (
            b"id,name,status\n1,UUON,active\n"
        ) * 3000,
        "text": (
            b"UUON CLOUUD adaptive artifact compression system.\n"
        ) * 3000,
        "random": bytes(range(256)) * 1000,
    }

    print("==============================================")
    print(" CLOUUD ARTIFACT KERNEL")
    print(" KERNEL-08 COMPRESSION BOTTLENECK GATE")
    print("==============================================")

    for content_type, payload in corpus.items():
        print()
        print(render_asciii(
            analyze_compression(
                payload,
                content_type,
            )
        ))


if __name__ == "__main__":
    main()
