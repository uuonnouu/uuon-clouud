# UUON Naming Convention Migration Plan

## Convention Format
- Pattern: `uuon-category-descriptor`
- Case: kebab-case (lowercase with hyphens)
- Length: 2-4 words after `uuon-`

---

## Phase 1: localStorage Keys - COMPLETED ✅

All localStorage keys have been migrated with automatic migration from old keys:

| Old Key | New UUON Key | Status |
|---------|--------------|--------|
| `dmension-welcome-seen` | `uuon-welcome-seen` | ✅ Migrated |
| `customTextures` | `uuon-custom-textures` | ✅ Migrated |
| `accessibility-theme` | `uuon-accessibility-theme` | ✅ Migrated |
| `accessibility-settings` | `uuon-accessibility-settings` | ✅ Migrated |
| `dimensional-math-community` | `uuon-community-data` | ✅ Migrated |
| `dimensional-math-favorites` | `uuon-community-favorites` | ✅ Migrated |
| `sharedSessions` | `uuon-shared-sessions` | ✅ Migrated |
| `dimensional-math-preferences` | `uuon-user-preferences` | ✅ Migrated |
| `philTokenEconomy` | `uuon-token-portfolio` | ✅ Migrated |
| `uuon_intelligence_metrics` | `uuon-intelligence-metrics` | ✅ Migrated |

**Migration Strategy**: Each component includes automatic migration code that:
1. Checks for old key on load
2. Migrates data to new UUON key if old key exists
3. Removes old key after migration
4. Uses new key for all subsequent operations

---

## Current State Audit

### Database Tables

#### Already Compliant (5 tables)
| Current Name | Status |
|-------------|--------|
| `uuon-blockchain-algorithms` | ✅ Compliant |
| `uuon-algorithm-metrics` | ✅ Compliant |
| `uuon-proof-verifications` | ✅ Compliant |
| `uuon-users` | ✅ Compliant |
| `uuon-custom-fused-shapes` | ✅ Compliant |

#### Needs Migration (20+ tables)
| Current Name | Proposed Name | Risk Level |
|-------------|---------------|------------|
| `user_saved_visualizations` | `uuon-user-visualizations` | HIGH |
| `ai_interactions` | `uuon-ai-interactions` | HIGH |
| `ai_learning_patterns` | `uuon-ai-patterns` | HIGH |
| `mathematical_patterns` | `uuon-math-patterns` | HIGH |
| `discovered_shapes` | `uuon-discovered-shapes` | HIGH |
| `quantum_constants` | `uuon-quantum-constants` | HIGH |
| `mathematical_constants` | `uuon-math-constants` | HIGH |
| `formula_implementations` | `uuon-formula-impl` | HIGH |
| `surface_presets` | `uuon-surface-presets` | HIGH |
| `shape_embeddings` | `uuon-shape-embeddings` | HIGH |
| `ml_asset_storage` | `uuon-ml-assets` | HIGH |
| `ai_ml_models` | `uuon-ai-models` | HIGH |

### API Endpoints - Phase 4 IN PROGRESS

#### Fused Shapes Routes (COMPLETED ✅)
| Old Route | New UUON Route | Status |
|-----------|----------------|--------|
| `POST /api/fused-shapes` | `POST /api/uuon-fused-shapes` | ✅ |
| `GET /api/fused-shapes` | `GET /api/uuon-fused-shapes` | ✅ |
| `GET /api/fused-shapes/:id` | `GET /api/uuon-fused-shapes/:id` | ✅ |
| `DELETE /api/fused-shapes/:id` | `DELETE /api/uuon-fused-shapes/:id` | ✅ |

#### Autonomous Contracts Routes (COMPLETED ✅)
| Old Route | New UUON Route | Status |
|-----------|----------------|--------|
| `POST /api/autonomous/emergency-stop` | `POST /api/uuon-autonomous/emergency-stop` | ✅ |
| `POST /api/autonomous/emergency-resume` | `POST /api/uuon-autonomous/resume` | ✅ |
| `GET /api/autonomous/status` | `GET /api/uuon-autonomous/status` | ✅ |

#### Symbol Routes (COMPLETED ✅)
| Old Route | New UUON Route | Status |
|-----------|----------------|--------|
| `GET /api/symbols` | `GET /api/uuon-symbols` | ✅ |
| `GET /api/symbol/:name` | `GET /api/uuon-symbol/:name` | ✅ |
| `GET /api/symbol/categories` | `GET /api/uuon-symbol/categories` | ✅ |
| `POST /api/symbol/:name/render3d` | `POST /api/uuon-symbol/:name/render3d` | ✅ |
| `POST /api/symbols/render3d/batch` | `POST /api/uuon-symbols/render3d/batch` | ✅ |
| `GET /api/symbol/:name/formats` | `GET /api/uuon-symbol/:name/formats` | ✅ |
| `GET /api/symbols/stats` | `GET /api/uuon-symbols/stats` | ✅ |

#### ML Data Routes (COMPLETED ✅)
| Old Route | New UUON Route | Status |
|-----------|----------------|--------|
| `POST /api/ml-data/store-model` | `POST /api/ml-data/uuon-store-model` | ✅ |
| `GET /api/ml-data/load-model/:name` | `GET /api/ml-data/uuon-load-model/:name` | ✅ |
| `POST /api/ml-data/store-embeddings` | `POST /api/ml-data/uuon-store-embeddings` | ✅ |
| `GET /api/ml-data/embeddings/:type` | `GET /api/ml-data/uuon-embeddings/:type` | ✅ |
| `POST /api/ml-data/store-asset` | `POST /api/ml-data/uuon-store-asset` | ✅ |
| `GET /api/ml-data/load-asset/:name` | `GET /api/ml-data/uuon-load-asset/:name` | ✅ |
| `GET /api/ml-data/storage-stats` | `GET /api/ml-data/uuon-storage-stats` | ✅ |
| `POST /api/ml-data/cleanup` | `POST /api/ml-data/uuon-cleanup` | ✅ |
| `POST /api/ml-data/migrate-assets` | `POST /api/ml-data/uuon-migrate-assets` | ✅ |

#### Pending Migration
| Current | Proposed | Risk |
|---------|----------|------|
| `/api/emergency/*` | `/api/uuon-emergency/*` | LOW |
| `/api/blockchain/algorithms` | `/api/uuon-blockchain-algo` | MEDIUM |
| `/api/compute/*` | `/api/uuon-compute/*` | LOW |

### localStorage Keys

#### Needs Migration
| Current | Proposed |
|---------|----------|
| `customTextures` | `uuon-custom-textures` |
| `dmension-welcome-seen` | `uuon-welcome-seen` |
| `accessibility-theme` | `uuon-accessibility-theme` |
| `dimensional-math-community` | `uuon-community-data` |
| `accessibility-settings` | `uuon-accessibility-settings` |
| `sharedSessions` | `uuon-shared-sessions` |

## Risk Assessment

### HIGH RISK - Database Schema Changes
- **Impact**: Data loss if migration fails
- **Dependencies**: All queries, ORM mappings, seeder
- **Recommendation**: Defer until Phase 6, requires backup strategy

### MEDIUM RISK - API Endpoint Changes  
- **Impact**: Frontend breaks, external integrations fail
- **Dependencies**: Frontend API calls
- **Recommendation**: Update frontend simultaneously

### LOW RISK - localStorage Keys
- **Impact**: User preferences reset (acceptable)
- **Dependencies**: None critical
- **Recommendation**: Safe to update, add migration helper

## Recommended Execution Order

1. **Phase 1**: localStorage keys (LOW risk, easy rollback)
2. **Phase 2**: New code convention enforcement (no breaking changes)
3. **Phase 3**: API endpoints with frontend sync (MEDIUM risk)
4. **Phase 4**: Database schemas (HIGH risk, requires migration)

## PostgreSQL Consideration

⚠️ **Important**: PostgreSQL with kebab-case column names requires:
- Column names must be quoted: `"column-name"`
- May cause ORM compatibility issues
- Consider: Keep columns as snake_case, only table names use kebab-case

## Decision Required

Before proceeding, confirm:
1. Should column names also use kebab-case? (Not recommended)
2. Is data loss acceptable for localStorage migration?
3. Should we maintain backward compatibility for APIs?
