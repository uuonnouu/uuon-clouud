# CLOUUD Worker Integration

## Mission

Operate the worker as a lossless data-reduction and artifact-processing layer connected to CLOUUD.

The worker must identify valuable structure before reducing data.

Pipeline:

INGEST
→ ANALYZE
→ CLASSIFY
→ REDUCE
→ TOKENIZE
→ COMPRESS
→ STORE
→ VERIFY

Expansion:

REQUEST
→ LOCATE ARTIFACT
→ DECODE
→ DECOMPRESS
→ RECONSTRUCT
→ VERIFY

## Non-negotiable rules

1. Never overwrite original source data.
2. Preserve the original SHA-256 hash.
3. Measure original bytes before reduction.
4. Measure reduced/compressed bytes after reduction.
5. Never claim compression until measured.
6. Prefer lossless reduction whenever reconstruction is required.
7. Separate semantic reduction from byte compression.
8. Detect repeated structures, strings, fields, relationships, mathematical patterns,
   predictable sequences, duplicate data and reusable tokens.
9. Reuse existing CLOUUD compression handlers.
10. Do not create duplicate compression algorithms when an existing handler applies.
11. Record:
   - algorithm
   - original size
   - reduced size
   - compressed size
   - ratio
   - original hash
   - resulting hash
   - reversibility
   - reconstruction status
12. Verify reconstructed output against the original hash whenever reconstruction
    is possible.
13. Do not silently discard information.
14. If reduction is lossy, explicitly mark what was discarded and why.
15. Prefer compact representations that preserve computational meaning.
16. Minimize unnecessary transfer of raw data to CLOUUD.
17. Send metadata and reduced representations when they are sufficient.
18. Retrieve the original representation only when downstream computation requires it.

## Existing CLOUUD techniques

Use the existing handlers:

- parametric
- temporal
- relationship
- transformation
- functional
- constraints
- deterministic

The orchestrator must test applicable handlers and select the measured best result.

## CLOUUD connection

The worker should communicate with the CLOUUD API through an environment-configured endpoint.

Never hard-code credentials.

Expected environment variables:

CLOUUD_API_URL
CLOUUD_API_KEY

Optional:

CLOUUD_TIMEOUT_MS
CLOUUD_ENABLED

## Safety

If CLOUUD is unavailable:

- continue local processing when possible
- preserve source data
- record the connection failure
- never pretend synchronization succeeded

## Worker behavior

For each artifact:

1. Identify source.
2. Hash source.
3. Analyze structure.
4. Determine applicable reduction/compression strategies.
5. Execute candidates.
6. Measure each result.
7. Select the smallest verified representation.
8. Preserve reconstruction metadata.
9. Send the reduced artifact/metadata to CLOUUD.
10. Verify CLOUUD response.
11. Record synchronization status.
12. Keep the original available for exact reconstruction.

## Success condition

A worker operation is successful only when:

- source integrity is known
- reduction is measured
- selected representation is identified
- reconstruction metadata exists
- CLOUUD synchronization is confirmed OR explicitly recorded as unavailable
