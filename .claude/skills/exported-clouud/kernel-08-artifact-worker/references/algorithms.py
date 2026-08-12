import gzip
from typing import Final

SUPPORTED_ALGORITHMS: Final = ("store", "gzip")


def compress_candidates(original: bytes) -> dict[str, bytes]:
    return {
        "store": original,
        "gzip": gzip.compress(original, compresslevel=9),
    }


def choose_algorithm(original: bytes) -> tuple[str, bytes]:
    candidates = compress_candidates(original)

    algorithm = min(
        candidates,
        key=lambda name: len(candidates[name]),
    )

    return algorithm, candidates[algorithm]


def compress_payload(original: bytes) -> tuple[str, bytes]:
    return choose_algorithm(original)


def decompress_payload(algorithm: str, payload: bytes) -> bytes:
    if algorithm == "store":
        return payload

    if algorithm == "gzip":
        return gzip.decompress(payload)

    raise ValueError(
        f"Unsupported CLOUUD algorithm: {algorithm}"
    )
