from pathlib import Path
import tempfile

from adaptive_container import (
    create_artifact,
    restore_artifact,
    verify_artifact,
)


def test_lossless_round_trip():
    with tempfile.TemporaryDirectory() as tmp:
        root = Path(tmp)

        source = root / "example.json"
        source.write_bytes(
            b'{"hello":"CLOUUD","values":[1,2,3,4,5]}'
        )

        artifacts = root / "artifacts"
        restored = root / "restored.json"

        metadata = create_artifact(source, artifacts)

        result = restore_artifact(
            artifacts / metadata["artifact_id"],
            restored,
        )

        assert result["lossless_restore"] is True
        assert restored.read_bytes() == source.read_bytes()


def test_adaptive_stored_for_incompressible():
    with tempfile.TemporaryDirectory() as tmp:
        root = Path(tmp)

        source = root / "tiny.py"
        source.write_bytes(b"print('x')")

        metadata = create_artifact(
            source,
            root / "artifacts",
        )

        assert metadata["algorithm"] in ("stored", "zlib")


def test_sealed_proof():
    with tempfile.TemporaryDirectory() as tmp:
        root = Path(tmp)

        source = root / "page.html"
        source.write_bytes(
            b"<html><body>" + (b"CLOUUD" * 1000) + b"</body></html>"
        )

        artifacts = root / "artifacts"

        metadata = create_artifact(source, artifacts)

        result = verify_artifact(
            artifacts / metadata["artifact_id"]
        )

        assert result["sealed"] is True
        assert result["payload_valid"] is True
        assert result["proof_valid"] is True
