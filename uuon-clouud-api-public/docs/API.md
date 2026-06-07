# UUON Clouud API Reference

UUON Clouud is accessed through a secure API layer.

The core reasoning engine remains closed source.

## Reasoning

### Create Conversation

POST /api/conversations

Creates a new reasoning session.

### Send Message

POST /api/conversations/{id}/messages

Primary Clouud interaction endpoint.

Provides:

- response generation
- provenance metadata
- assessment signals
- version tracking


## Provenance

### Verify Response

POST /api/provenance/verify

Validates generated output.

### Ellomental Verification

POST /api/ellomental/verify

Provides response integrity verification.


## Mathematical Layer

GET /api/lattice/report

Returns lattice metadata.

GET /api/lattice/value/{position}

Returns position data.


## Assessment

GET /api/self-assessment

Returns assessment information.


## Visualization Bridge

GET /api/dmension/status

Checks Dmension connection state.

GET /api/dmension/shapes

Queries available mathematical structures.


## System

GET /api/health

Checks service availability.


---

Internal administration endpoints are not part of public API access.

