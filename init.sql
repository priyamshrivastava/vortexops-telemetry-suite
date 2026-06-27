-- Create initial schema structures
CREATE TABLE IF NOT EXISTS server_profile (
                                              id BIGSERIAL PRIMARY KEY,
                                              server_name VARCHAR(100) NOT NULL,
    environment VARCHAR(50) DEFAULT 'PRODUCTION',
    region VARCHAR(50) DEFAULT 'ap-south-1',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

-- Seed baseline monitoring profile node
INSERT INTO server_profile (id, server_name, environment, region)
VALUES (1, 'VortexOps-Primary-Cluster', 'PRODUCTION', 'ap-south-1')
    ON CONFLICT (id) DO NOTHING;