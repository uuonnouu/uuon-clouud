from __future__ import annotations

from dataclasses import dataclass
from .algorithms import compress_candidates, decompress_payload


@dataclass(frozen=True)
class CompressionReport:
    content_type: str
    original_size: int
    best_algorithm: str
    compressed_size: int
    reduction_percent: float
    compression_ratio: float
    overhead_bytes: int
    net_reduction_percent: float
    lossless: bool
    bottleneck: str


def analyze_compression(
    original: bytes,
    content_type: str = "unknown",
) -> CompressionReport:
    original_size = len(original)

    if original_size == 0:
        return CompressionReport(
            content_type,
            0,
            "store",
            0,
            0.0,
            1.0,
            0,
            0.0,
            True,
            "EMPTY_INPUT",
        )

    candidates = compress_candidates(original)
    algorithm = min(candidates, key=lambda name: len(candidates[name]))
    payload = candidates[algorithm]

    compressed_size = len(payload)
    reduction = (
        1.0 - compressed_size / original_size
    ) * 100.0

    ratio = (
        original_size / compressed_size
        if compressed_size
        else 1.0
    )

    restored = decompress_payload(
        algorithm,
        payload,
    )

    lossless = restored == original

    if not lossless:
        bottleneck = "LOSSLESS_FAILURE"
    elif compressed_size >= original_size:
        bottleneck = "NO_COMPRESSION_GAIN"
    elif original_size < 256:
        bottleneck = "SMALL_PAYLOAD_OVERHEAD"
    elif reduction < 10:
        bottleneck = "HIGH_ENTROPY_OR_LOW_REDUNDANCY"
    else:
        bottleneck = "COMPRESSIBLE_STRUCTURE"

    return CompressionReport(
        content_type=content_type,
        original_size=original_size,
        best_algorithm=algorithm,
        compressed_size=compressed_size,
        reduction_percent=round(reduction, 3),
        compression_ratio=round(ratio, 4),
        overhead_bytes=0,
        net_reduction_percent=round(reduction, 3),
        lossless=lossless,
        bottleneck=bottleneck,
    )


def render_asciii(report: CompressionReport) -> str:
    width = 36

    if report.original_size:
        filled = max(
            0,
            min(
                width,
                round(
                    width
                    * report.compressed_size
                    / report.original_size
                ),
            ),
        )
    else:
        filled = 0

    bar = "█" * filled + " " * (width - filled)

    return "\n".join(
        [
            "╭──────────────────────────────────────────────╮",
            "│ ASCIII·COMPRESSION                         │",
            "├──────────────────────────────────────────────┤",
            f"│ TYPE       {report.content_type:<30}│",
            f"│ ALGORITHM  {report.best_algorithm:<30}│",
            f"│ ORIGINAL   {report.original_size:>10} bytes              │",
            f"│ PAYLOAD    {report.compressed_size:>10} bytes              │",
            f"│ DATA       {bar} │",
            f"│ REDUCTION  {report.reduction_percent:>9.3f}%              │",
            f"│ RATIO      {report.compression_ratio:>9.4f}×              │",
            f"│ NET        {report.net_reduction_percent:>9.3f}%              │",
            f"│ LOSSLESS   {'PASS' if report.lossless else 'FAIL':<30}│",
            f"│ BOTTLENECK {report.bottleneck:<30}│",
            "╰──────────────────────────────────────────────╯",
        ]
    )
