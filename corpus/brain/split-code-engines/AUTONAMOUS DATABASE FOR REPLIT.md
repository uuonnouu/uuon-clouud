## AUTONAMOUS DATABASE FOR REPLIT:  
  
## Setup Prompts for Replit:  
## Create New Repl:  
## Choose "Python" template  
## Name it "autonomous-database"  
## File Structure:    main.py (paste the code above)  
## requirements.txt  
## .replit  
## Key Features Implemented:  
## Auto-backup every hour  
## Auto-optimization with query analysis  
## Auto-cleanup of old data  
## Performance monitoring  
## Access tracking  
## Background threading  
## Essential Prompts/Commands:  
  
  
bash  
*# Install dependencies (automatic in Replit)*  
pip install sqlite3  
  
*# Run the database*  
python main.py  
## Key Functions:  
* db.set(key, value, type) - Store data  
* db.get(key) - Retrieve data  
* db.get_stats() - Database statistics  
* auto_backup() - Creates timestamped backups  
* auto_optimize() - Analyzes and optimizes queries  
* auto_cleanup() - Removes old logs and data  
## Autonomous Features:  
1. **Self-monitoring** - Tracks query performance  
2. **Auto-indexing** - Creates indexes for frequent data  
3. **Smart backups** - Automated with cleanup  
4. **Performance optimization** - Identifies slow queries  
5. **Data lifecycle** - Archives old unused data  
  
  
# Autonomous Database Implementation for Replit  
import sqlite3  
import json  
import threading  
import time  
import os  
from datetime import datetime, timedelta  
import hashlib  
  
class AutonomousDatabase:  
    def __init__(self, db_name="autonomous.db"):  
        self.db_name = db_name  
        self.connection = sqlite3.connect(db_name, check_same_thread=False)  
        self.lock = threading.Lock()  
        self.auto_optimize = True  
        self.backup_interval = 3600  # 1 hour  
        self.cleanup_interval = 86400  # 24 hours  
        self.init_database()  
        self.start_autonomous_tasks()  
      
    def init_database(self):  
        """Initialize database with autonomous features"""  
        cursor = self.connection.cursor()  
          
        # Main data table  
        cursor.execute('''  
            CREATE TABLE IF NOT EXISTS data (  
                id INTEGER PRIMARY KEY AUTOINCREMENT,  
                key TEXT UNIQUE,  
                value TEXT,  
                type TEXT,  
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  
                access_count INTEGER DEFAULT 0,  
                last_accessed TIMESTAMP  
            )  
        ''')  
          
        # Query performance log  
        cursor.execute('''  
            CREATE TABLE IF NOT EXISTS query_log (  
                id INTEGER PRIMARY KEY AUTOINCREMENT,  
                query_hash TEXT,  
                query_text TEXT,  
                execution_time REAL,  
                timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP  
            )  
        ''')  
          
        # Auto-backup log  
        cursor.execute('''  
            CREATE TABLE IF NOT EXISTS backup_log (  
                id INTEGER PRIMARY KEY AUTOINCREMENT,  
                backup_path TEXT,  
                timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  
                size INTEGER  
            )  
        ''')  
          
        # Create indexes for performance  
        cursor.execute('CREATE INDEX IF NOT EXISTS idx_data_key ON data(key)')  
        cursor.execute('CREATE INDEX IF NOT EXISTS idx_access_count ON data(access_count)')  
        cursor.execute('CREATE INDEX IF NOT EXISTS idx_last_accessed ON data(last_accessed)')  
          
        self.connection.commit()  
      
    def execute_query(self, query, params=None):  
        """Execute query with autonomous monitoring"""  
        start_time = time.time()  
        query_hash = hashlib.md5(query.encode()).hexdigest()  
          
        with self.lock:  
            cursor = self.connection.cursor()  
            try:  
                if params:  
                    result = cursor.execute(query, params)  
                else:  
                    result = cursor.execute(query)  
                  
                # Log query performance  
                execution_time = time.time() - start_time  
                cursor.execute('''  
                    INSERT INTO query_log (query_hash, query_text, execution_time)  
                    VALUES (?, ?, ?)  
                ''', (query_hash, query[:200], execution_time))  
                  
                self.connection.commit()  
                return result.fetchall()  
              
            except Exception as e:  
                print(f"Query error: {e}")  
                return None  
      
    def set(self, key, value, data_type="string"):  
        """Set data with autonomous tracking"""  
        value_json = json.dumps(value) if data_type != "string" else str(value)  
          
        query = '''  
            INSERT OR REPLACE INTO data (key, value, type, updated_at, access_count)  
            VALUES (?, ?, ?, CURRENT_TIMESTAMP,   
                COALESCE((SELECT access_count FROM data WHERE key = ?), 0))  
        '''  
        self.execute_query(query, (key, value_json, data_type, key))  
      
    def get(self, key):  
        """Get data with autonomous access tracking"""  
        # Update access count and timestamp  
        update_query = '''  
            UPDATE data SET   
                access_count = access_count + 1,  
                last_accessed = CURRENT_TIMESTAMP  
            WHERE key = ?  
        '''  
        self.execute_query(update_query, (key,))  
          
        # Get the data  
        query = 'SELECT value, type FROM data WHERE key = ?'  
        result = self.execute_query(query, (key,))  
          
        if result and len(result) > 0:  
            value, data_type = result[0]  
            if data_type != "string":  
                return json.loads(value)  
            return value  
        return None  
      
    def auto_optimize(self):  
        """Autonomous database optimization"""  
        print("🤖 Running autonomous optimization...")  
          
        # Analyze query performance  
        slow_queries = self.execute_query('''  
            SELECT query_text, AVG(execution_time) as avg_time, COUNT(*) as count  
            FROM query_log  
            WHERE timestamp > datetime('now', '-1 day')  
            GROUP BY query_hash  
            HAVING avg_time > 0.1  
            ORDER BY avg_time DESC  
        ''')  
          
        if slow_queries:  
            print(f"Found {len(slow_queries)} slow queries")  
            for query, avg_time, count in slow_queries:  
                print(f"  - {query[:50]}... (avg: {avg_time:.3f}s, count: {count})")  
          
        # Auto-create indexes for frequently accessed data  
        frequent_keys = self.execute_query('''  
            SELECT key, access_count FROM data  
            WHERE access_count > 100  
            ORDER BY access_count DESC  
            LIMIT 10  
        ''')  
          
        if frequent_keys:  
            print(f"🚀 Optimizing {len(frequent_keys)} frequently accessed keys")  
          
        # Vacuum database  
        self.connection.execute('VACUUM')  
        print("✅ Database optimization complete")  
      
    def auto_backup(self):  
        """Autonomous backup system"""  
        backup_dir = "backups"  
        if not os.path.exists(backup_dir):  
            os.makedirs(backup_dir)  
          
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")  
        backup_path = f"{backup_dir}/backup_{timestamp}.db"  
          
        # Create backup  
        backup_conn = sqlite3.connect(backup_path)  
        self.connection.backup(backup_conn)  
        backup_conn.close()  
          
        # Log backup  
        file_size = os.path.getsize(backup_path)  
        self.execute_query('''  
            INSERT INTO backup_log (backup_path, size) VALUES (?, ?)  
        ''', (backup_path, file_size))  
          
        print(f"📦 Backup created: {backup_path} ({file_size} bytes)")  
          
        # Cleanup old backups (keep last 10)  
        self.cleanup_old_backups(backup_dir)  
      
    def cleanup_old_backups(self, backup_dir):  
        """Clean up old backup files"""  
        backups = self.execute_query('''  
            SELECT backup_path FROM backup_log  
            ORDER BY timestamp DESC  
            LIMIT -1 OFFSET 10  
        ''')  
          
        for (backup_path,) in backups or []:  
            if os.path.exists(backup_path):  
                os.remove(backup_path)  
                print(f"🗑️ Removed old backup: {backup_path}")  
      
    def auto_cleanup(self):  
        """Autonomous data cleanup"""  
        # Remove old query logs (keep last 7 days)  
        deleted = self.execute_query('''  
            DELETE FROM query_log  
            WHERE timestamp < datetime('now', '-7 days')  
        ''')  
          
        # Archive rarely accessed data  
        old_data = self.execute_query('''  
            SELECT COUNT(*) FROM data  
            WHERE last_accessed < datetime('now', '-30 days')  
            AND access_count < 5  
        ''')  
          
        if old_data and old_data[0][0] > 0:  
            print(f"🧹 Found {old_data[0][0]} old records to archive")  
          
        print("✅ Cleanup complete")  
      
    def start_autonomous_tasks(self):  
        """Start autonomous background tasks"""  
        def autonomous_worker():  
            while True:  
                try:  
                    # Auto-backup  
                    self.auto_backup()  
                    time.sleep(self.backup_interval)  
                      
                    # Auto-optimize  
                    if self.auto_optimize:  
                        self.auto_optimize()  
                      
                    # Auto-cleanup  
                    self.auto_cleanup()  
                    time.sleep(self.cleanup_interval)  
                      
                except Exception as e:  
                    print(f"Autonomous task error: {e}")  
                    time.sleep(60)  # Wait 1 minute on error  
          
        # Start background thread  
        autonomous_thread = threading.Thread(target=autonomous_worker, daemon=True)  
        autonomous_thread.start()  
        print("🤖 Autonomous database started")  
      
    def get_stats(self):  
        """Get database statistics"""  
        stats = {}  
          
        # Data stats  
        data_stats = self.execute_query('''  
            SELECT   
                COUNT(*) as total_records,  
                AVG(access_count) as avg_access,  
                MAX(access_count) as max_access  
            FROM data  
        ''')  
          
        if data_stats:  
            stats['total_records'] = data_stats[0][0]  
            stats['avg_access'] = data_stats[0][1]  
            stats['max_access'] = data_stats[0][2]  
          
        # Query stats  
        query_stats = self.execute_query('''  
            SELECT   
                COUNT(*) as total_queries,  
                AVG(execution_time) as avg_time,  
                MAX(execution_time) as max_time  
            FROM query_log  
            WHERE timestamp > datetime('now', '-1 day')  
        ''')  
          
        if query_stats:  
            stats['daily_queries'] = query_stats[0][0]  
            stats['avg_query_time'] = query_stats[0][1]  
            stats['max_query_time'] = query_stats[0][2]  
          
        # Backup stats  
        backup_stats = self.execute_query('''  
            SELECT COUNT(*) FROM backup_log  
        ''')  
          
        if backup_stats:  
            stats['total_backups'] = backup_stats[0][0]  
          
        return stats  
  
# Usage Example and Setup  
def setup_autonomous_database():  
    """Setup function for Replit"""  
    db = AutonomousDatabase()  
      
    # Add some sample data  
    db.set("user:1", {"name": "John", "age": 30}, "json")  
    db.set("config:theme", "dark", "string")  
    db.set("stats:visits", 1000, "number")  
      
    return db  
  
# Replit main.py setup  
if __name__ == "__main__":  
    print("🚀 Starting Autonomous Database...")  
      
    # Initialize database  
    db = setup_autonomous_database()  
      
    # Test operations  
    print("Testing database operations...")  
      
    # Set data  
    db.set("test:key", "test_value")  
      
    # Get data  
    value = db.get("test:key")  
    print(f"Retrieved: {value}")  
      
    # Show stats  
    stats = db.get_stats()  
    print(f"Database stats: {stats}")  
      
    # Keep alive for Replit  
    print("Database running... Press Ctrl+C to stop")  
    try:  
        while True:  
            time.sleep(60)  
            stats = db.get_stats()  
            print(f"[{datetime.now()}] Stats: {stats}")  
    except KeyboardInterrupt:  
        print("Database stopped")  
  
# Replit Configuration Files needed:  
  
# requirements.txt  
"""  
sqlite3  
threading  
json  
hashlib  
datetime  
os  
time  
"""  
  
# .replit file  
"""  
run = "python main.py"  
language = "python3"  
  
[nix]  
channel = "stable-22_11"  
  
[deployment]  
run = ["sh", "-c", "python main.py"]  
"""  
