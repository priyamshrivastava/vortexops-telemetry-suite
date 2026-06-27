-- Table 1: monitored_servers
CREATE TABLE IF NOT EXISTS monitored_servers (
    id SERIAL PRIMARY KEY,
    server_name VARCHAR(255) NOT NULL,
    ip_address VARCHAR(255),
    status VARCHAR(50)
);

-- Table 2: server_metrics
CREATE TABLE IF NOT EXISTS server_metrics (
    id BIGSERIAL PRIMARY KEY,
    server_id INT REFERENCES monitored_servers(id) ON DELETE CASCADE,
    cpu_usage NUMERIC(5,2),
    memory_usage NUMERIC(5,2),
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Performance Requirement: Composite Index for timeline graphing
CREATE INDEX IF NOT EXISTS idx_metrics_timeline ON server_metrics (server_id, recorded_at DESC);

-- Insert local default server for monolith deployment if it doesn't exist
INSERT INTO monitored_servers (id, server_name, ip_address, status)
VALUES (1, 'Local-Host-Machine', '127.0.0.1', 'HEALTHY')
ON CONFLICT DO NOTHING;
