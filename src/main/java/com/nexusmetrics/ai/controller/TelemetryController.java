package com.nexusmetrics.ai.controller;

import com.nexusmetrics.ai.dto.ServerMetricsDto;
import com.nexusmetrics.ai.service.SystemMonitorService;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Flux;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/telemetry")
public class TelemetryController {

    private final SystemMonitorService monitorService;

    public TelemetryController(SystemMonitorService monitorService) {
        this.monitorService = monitorService;
    }

    @GetMapping(value = "/stream/{serverId}", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public Flux<ServerMetricsDto> streamTelemetry(@PathVariable Long serverId) {
        return monitorService.getMetricsStream()
                .map(metric -> {
                    if (metric.getServerId() == null || !metric.getServerId().equals(serverId)) {
                        metric.setServerId(serverId);
                    }
                    return metric;
                })
                .filter(m -> m.getServerId().equals(serverId));
    }

    @PostMapping("/simulate")
    public Map<String, Boolean> toggleSimulation(@RequestBody Map<String, Boolean> body) {
        boolean activate = body.getOrDefault("active", false);
        monitorService.setSimulationActive(activate);
        return Map.of("isSimulationActive", monitorService.isSimulationActive());
    }

    @PostMapping("/query")
    public Map<String, String> handleUserFollowUpQuery(@RequestBody Map<String, String> payload) {
        String customPrompt = payload.getOrDefault("question", "Optimize infrastructure allocation strategy.");
        monitorService.askFollowUpQuestion(customPrompt);
        return Map.of("status", "Prompt submitted to reactive processor core loop");
    }
}