# CLOUUD Artifact Experiment

Purpose:
- Compare raw files against ZIP and CLOUUD representations.
- Verify exact lossless restoration with SHA-256.
- Establish a separate orchestrated reduction path for derived artifacts.
- Never overwrite source artifacts.

Modes:
1. LOSSLESS — exact restoration required.
2. REDUCTION — derived artifact; source remains immutable.

Every experiment records:
- source SHA-256
- source size
- transformed size
- restored SHA-256 where applicable
- reduction ratio
- transformation metadata
- artifact hash
