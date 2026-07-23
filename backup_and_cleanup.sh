#!/bin/bash
# Backup script for attached_assets
# Run this after verifying database migration is working correctly

echo "Creating backup of attached_assets..."
tar -czf attached_assets_backup_$(date +%Y%m%d_%H%M%S).tar.gz attached_assets/

echo "Backup created. To remove original files after verification:"
echo "rm -rf attached_assets/"
echo ""
echo "To restore if needed:"
echo "tar -xzf attached_assets_backup_*.tar.gz"
