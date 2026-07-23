
# Port Configuration Documentation

## Production Port Strategy

### Primary Application Port
- **Port 5000**: Main application server (Express + Vite)
  - **Usage**: All API routes, frontend serving, WebSocket connections
  - **Binding**: `0.0.0.0:5000` (external access enabled)
  - **Status**: ✅ Active
  - **Replit Mapping**: Automatically mapped to port 80 (HTTP) and 443 (HTTPS)

### Reserved System Ports
- **Port 22**: SSH (Replit internal, not forwardable)
- **Port 8283**: Replit internal services (not forwardable)
- **Port 443/80**: Handled by Replit proxy (external access)

### Available Expansion Ports (if needed)
- **Port 3001**: Database connections (internal only)
- **Port 3002**: AI/ML services (internal only) 
- **Port 3003**: Quantum computing integration (internal only)
- **Port 4200**: Development tools (internal only)
- **Port 6000**: Asset processing (internal only)
- **Port 8000**: Background services (internal only)
- **Port 8080**: Health monitoring (internal only)

## Architecture Decision
**Single Port Strategy**: All services run on port 5000 to:
- Eliminate port conflicts
- Simplify deployment on Replit
- Ensure consistent external access
- Maintain unified API structure

## Error Prevention
- Only ONE `app.listen()` call per server instance
- All routes registered BEFORE server starts
- Graceful shutdown handling prevents port holding
