package com.nexusmetrics.ai.dto;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

public class ServerMetricsDto {
    private Long serverId;
    private double cpuUsage;
    private double memoryUsage;
    private LocalDateTime recordedAt;
    private boolean isAnomaly;
    private String aiDiagnostics;
    private List<Map<String, Object>> topProcesses;

    public ServerMetricsDto() {
    }

    public ServerMetricsDto(Long serverId, double cpuUsage, double memoryUsage, LocalDateTime recordedAt, boolean isAnomaly, String aiDiagnostics, List<Map<String, Object>> topProcesses) {
        this.serverId = serverId;
        this.cpuUsage = cpuUsage;
        this.memoryUsage = memoryUsage;
        this.recordedAt = recordedAt;
        this.isAnomaly = isAnomaly;
        this.aiDiagnostics = aiDiagnostics;
        this.topProcesses = topProcesses;
    }

    public Long getServerId() {
        return serverId;
    }

    public void setServerId(Long serverId) {
        this.serverId = serverId;
    }

    public double getCpuUsage() {
        return cpuUsage;
    }

    public void setCpuUsage(double cpuUsage) {
        this.cpuUsage = cpuUsage;
    }

    public double getMemoryUsage() {
        return memoryUsage;
    }

    public void setMemoryUsage(double memoryUsage) {
        this.memoryUsage = memoryUsage;
    }

    public LocalDateTime getRecordedAt() {
        return recordedAt;
    }

    public void setRecordedAt(LocalDateTime recordedAt) {
        this.recordedAt = recordedAt;
    }

    public boolean isAnomaly() {
        return isAnomaly;
    }

    public void setAnomaly(boolean anomaly) {
        isAnomaly = anomaly;
    }

    public String getAiDiagnostics() {
        return aiDiagnostics;
    }

    public void setAiDiagnostics(String aiDiagnostics) {
        this.aiDiagnostics = aiDiagnostics;
    }

    public List<Map<String, Object>> getTopProcesses() {
        return topProcesses;
    }

    public void setTopProcesses(List<Map<String, Object>> topProcesses) {
        this.topProcesses = topProcesses;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private Long serverId;
        private double cpuUsage;
        private double memoryUsage;
        private LocalDateTime recordedAt;
        private boolean isAnomaly;
        private String aiDiagnostics;
        private List<Map<String, Object>> topProcesses;

        public Builder serverId(Long serverId) {
            this.serverId = serverId;
            return this;
        }

        public Builder cpuUsage(double cpuUsage) {
            this.cpuUsage = cpuUsage;
            return this;
        }

        public Builder memoryUsage(double memoryUsage) {
            this.memoryUsage = memoryUsage;
            return this;
        }

        public Builder recordedAt(LocalDateTime recordedAt) {
            this.recordedAt = recordedAt;
            return this;
        }

        public Builder isAnomaly(boolean isAnomaly) {
            this.isAnomaly = isAnomaly;
            return this;
        }

        public Builder aiDiagnostics(String aiDiagnostics) {
            this.aiDiagnostics = aiDiagnostics;
            return this;
        }

        public Builder topProcesses(List<Map<String, Object>> topProcesses) {
            this.topProcesses = topProcesses;
            return this;
        }

        public ServerMetricsDto build() {
            return new ServerMetricsDto(serverId, cpuUsage, memoryUsage, recordedAt, isAnomaly, aiDiagnostics, topProcesses);
        }
    }
}