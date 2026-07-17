# Brain Compression System - Operations & Deployment Guide

## Production Deployment

### Prerequisites
- PostgreSQL 12+
- Node.js 18+
- 2GB+ available disk space
- Network access to /Brain/raw directory

### Environment Variables
```bash
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/uuon_brain

# Server
NODE_ENV=production
PORT=5000

# Optional: Brain configuration
BRAIN_MAX_FILE_SIZE=10485760  # 10MB
BRAIN_COMPRESSION_THRESHOLD=0.1  # Don't compress if < 10% reduction
BRAIN_CONCURRENCY=5  # Max concurrent compressions
```

### Setup Steps

#### 1. Initialize Database
```bash
# Apply migrations
npx drizzle-kit push

# Verify tables created
psql $DATABASE_URL -c "\dt brain_*"
```

#### 2. Build Application
```bash
npm run build

# Verify build
ls -la dist/
```

#### 3. Start Service
```bash
# Development
npm run dev

# Production
npm run start

# With PM2
pm2 start npm --name "brain-compression" -- start
```

#### 4. Verify Health
```bash
curl http://localhost:5000/api/brain/status

# Should return:
# { "status": "operational", "ready": true, ... }
```

---

## Operational Tasks

### Initial Brain File Compression

#### Option 1: Process All Files
```bash
curl -X POST http://localhost:5000/api/brain/scan

# Then use batch worker (to be created)
curl -X POST http://localhost:5000/api/brain/batch/process
```

#### Option 2: Process by Priority
```bash
# HIGH priority first
curl -X POST http://localhost:5000/api/brain/batch/process-high

# Then MEDIUM
curl -X POST http://localhost:5000/api/brain/batch/process-medium

# Then LOW
curl -X POST http://localhost:5000/api/brain/batch/process-low
```

### Monitoring

#### Real-time Metrics
```bash
watch -n 5 'curl http://localhost:5000/api/brain/dashboard | jq .overall'
```

#### Check System Status
```bash
curl http://localhost:5000/api/brain/status | jq .
```

#### View Compression Performance
```bash
curl http://localhost:5000/api/brain/metrics | jq '.byTechnique'
```

#### Track Storage Savings
```bash
curl http://localhost:5000/api/brain/dashboard | jq '.costAnalysis'
```

### Maintenance

#### Backup Rules Database
```bash
# Daily backup
pg_dump $DATABASE_URL > brain_rules_$(date +%Y%m%d).sql

# Verify backup
psql < brain_rules_*.sql --dry-run
```

#### Clean Up Failed Rules
```bash
# Identify failed compressions
SELECT * FROM brain_rules WHERE verified = FALSE;

# Delete failed rules (optional)
DELETE FROM brain_rules WHERE verified = FALSE AND created_at < NOW() - INTERVAL '7 days';
```

#### Verify Compression Integrity
```bash
# Run reconstruction verification on sample
npm run verify-brain

# Checks: hash matching, reconstruction correctness
```

---

## Troubleshooting

### Issue: "Brain directory not found"

**Diagnosis:**
```bash
ls -la "/:Brain/:Raw"
```

**Solution:**
- Ensure /Brain/raw exists and is accessible
- Check file permissions
- Verify DATABASE_URL is correct

### Issue: Compression taking too long

**Diagnosis:**
```bash
curl http://localhost:5000/api/brain/timeline | jq '.timeline[] | select(.avgTimeMs > 100)'
```

**Solution:**
- Reduce concurrency: `BRAIN_CONCURRENCY=2`
- Identify slow files: check metrics by domain
- Consider parallel processing: split by domain

### Issue: Low compression ratios

**Diagnosis:**
```bash
curl http://localhost:5000/api/brain/distribution | jq '.distribution'
```

**Solution:**
- Check file formats (PDFs compress poorly)
- Verify correct handlers are applied
- Review underperforming technique parameters

### Issue: Database connection errors

**Diagnosis:**
```bash
psql $DATABASE_URL -c "SELECT 1"
```

**Solution:**
- Verify DATABASE_URL syntax
- Check PostgreSQL is running
- Verify network connectivity
- Check firewall rules

---

## Performance Tuning

### Optimize Compression Concurrency
```bash
# For 4-core CPU
BRAIN_CONCURRENCY=4

# For 8+ core CPU
BRAIN_CONCURRENCY=8

# For limited resources
BRAIN_CONCURRENCY=2
```

### Optimize Memory Usage
```bash
# Increase Node.js memory
NODE_OPTIONS=--max-old-space-size=4096 npm start

# Monitor memory
ps aux | grep node
```

### Optimize Database Queries
```bash
# Add indexes for frequent queries
CREATE INDEX idx_brain_rules_created ON brain_rules(created_at);
CREATE INDEX idx_brain_inventory_compressed ON brain_inventory(compressed);

# Analyze query performance
EXPLAIN ANALYZE SELECT * FROM brain_rules WHERE verified = TRUE;
```

---

## Scaling Considerations

### Horizontal Scaling

**Current:** Single instance processes files sequentially

**To Scale:**
1. Use message queue (RabbitMQ, Kafka)
2. Multiple workers consume from queue
3. Each worker processes files independently
4. Central database for coordination

```
Client → Queue → Worker 1
              → Worker 2
              → Worker 3
              → Database
```

### Vertical Scaling

**Increase single instance capacity:**
- More CPU cores (use higher concurrency)
- More RAM (larger cache, parallel processing)
- Faster disk (SSD for reads/writes)
- Database optimization (dedicated server)

### Caching Strategy

```
Compressed Rules → Redis Cache
                 → Fast reconstruction
                 → Reduced DB load
```

---

## Monitoring & Alerting

### Key Metrics to Monitor
```
1. Compression Success Rate
   - Target: > 95%
   - Alert if < 90%

2. Average Compression Ratio
   - Target: < 0.05 (5%)
   - Alert if > 0.15 (15%)

3. Average Reconstruction Time
   - Target: < 10ms
   - Alert if > 50ms

4. Storage Savings
   - Track cumulative savings
   - Project cost reductions

5. Error Rate
   - Target: < 1%
   - Alert if > 5%
```

### Setup Monitoring with Prometheus
```yaml
# prometheus.yml
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'brain-compression'
    static_configs:
      - targets: ['localhost:5000']
    metrics_path: '/api/brain/metrics'
```

### Setup Alerts with AlertManager
```yaml
# alertmanager.yml
groups:
  - name: brain_compression
    rules:
      - alert: LowCompressionSuccessRate
        expr: brain_compression_success_rate < 0.9
        for: 5m
        annotations:
          summary: "Low compression success rate"

      - alert: HighCompressionRatio
        expr: brain_compression_avg_ratio > 0.15
        for: 5m
        annotations:
          summary: "Compression ratios declining"
```

---

## Backup & Recovery

### Full Backup Strategy
```bash
#!/bin/bash
# backup-brain.sh

BACKUP_DIR="/backups/brain"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

# Backup database
pg_dump $DATABASE_URL > $BACKUP_DIR/rules_$TIMESTAMP.sql

# Backup configuration
cp /etc/brain-compression.conf $BACKUP_DIR/config_$TIMESTAMP.conf

# Compress backup
gzip $BACKUP_DIR/rules_$TIMESTAMP.sql

# Upload to S3
aws s3 cp $BACKUP_DIR/rules_$TIMESTAMP.sql.gz s3://brain-backups/

# Cleanup old backups (keep 30 days)
find $BACKUP_DIR -name "*.sql.gz" -mtime +30 -delete
```

### Recovery Procedure
```bash
# 1. Restore database from backup
gunzip rules_20260708_120000.sql.gz
psql $DATABASE_URL < rules_20260708_120000.sql

# 2. Verify integrity
psql $DATABASE_URL -c "SELECT COUNT(*) FROM brain_rules;"

# 3. Re-run failed compressions
curl -X POST http://localhost:5000/api/brain/batch/process

# 4. Verify reconstruction
npm run verify-brain
```

---

## Security Considerations

### Access Control
```bash
# Restrict Brain directory permissions
chmod 755 /:Brain
chmod 755 /:Brain/:Raw

# Restrict database access
# In pg_hba.conf:
# local   brain_compression   app   trust
```

### Rate Limiting
```bash
# Default: 1000 req/min per IP
# Configure in middleware/rate-limit.ts

const rateLimit = {
  windowMs: 60000,  // 1 minute
  max: 1000,        // max requests per window
  message: "Too many requests"
};
```

### Data Validation
```bash
# All inputs validated with Zod
# File content: validated for format
# Compression ratios: checked for sanity
# Rule content: validated JSON schema
```

---

## Compliance & Audit

### Audit Trail
All compression operations logged:
```sql
SELECT * FROM brain_rules 
WHERE created_at > NOW() - INTERVAL '24 hours'
ORDER BY created_at DESC;
```

### Data Retention
- Rules stored indefinitely
- Audit logs retained 90 days
- Failed compression logs retained 30 days

### Blockchain Integration (Phase 2)
```bash
# Daily Merkle anchor
0: SHA256(rule_1, rule_2, ..., rule_N)

# Posted to Polygon mainnet
tx: 0x...

# Enables:
- Immutable audit trail
- Compliance verification
- Tamper detection
```

---

## Runbook: Daily Operations

### Morning
- [ ] Check system status: `curl /api/brain/status`
- [ ] Review error logs: `tail -100 app.log`
- [ ] Check storage savings: `curl /api/brain/dashboard`

### Hourly
- [ ] Monitor compression success rate
- [ ] Check for any failed compressions
- [ ] Verify database connectivity

### Daily
- [ ] Backup database
- [ ] Review top files being compressed
- [ ] Check memory usage
- [ ] Verify cache efficiency

### Weekly
- [ ] Run compression integrity check
- [ ] Analyze performance trends
- [ ] Review compression metrics by domain
- [ ] Plan optimization updates

### Monthly
- [ ] Full backup and recovery test
- [ ] Security audit
- [ ] Capacity planning
- [ ] Technology updates

---

## Incident Response

### Compression Failure
1. Check recent errors: `SELECT * FROM brain_rules WHERE verified = FALSE`
2. Identify pattern: domain, file type, size
3. Retry: `curl -X POST /api/brain/batch/retry-failed`
4. If persists: disable handler, review code

### Database Issues
1. Check connectivity: `psql $DATABASE_URL -c "SELECT 1"`
2. Check disk space: `df -h`
3. Check table size: `SELECT pg_size_pretty(pg_total_relation_size('brain_rules'))`
4. If needed: archive old rules, vacuum database

### Performance Degradation
1. Check CPU usage: `top`
2. Check disk I/O: `iostat 1`
3. Check DB slow queries: `pg_stat_statements`
4. Reduce concurrency, add resources, optimize queries

---

**Brain Compression Operations Guide v1.0**  
*Complete operations manual for production deployment*
