package com.nexusmetrics.ai.service;

import com.nexusmetrics.ai.dto.ServerMetricsDto;
import com.sun.management.OperatingSystemMXBean;
import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.client.reactive.ReactorClientHttpConnector;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Sinks;
import reactor.core.publisher.Mono;
import reactor.netty.http.client.HttpClient;
import io.netty.channel.ChannelOption;

import java.io.File;
import java.lang.management.ManagementFactory;
import java.net.URI;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.HashMap;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class SystemMonitorService {

    private static final Logger log = LoggerFactory.getLogger(SystemMonitorService.class);

    private Sinks.Many<ServerMetricsDto> sink;
    private OperatingSystemMXBean osBean;
    private volatile boolean isSimulationActive = false;
    private volatile String currentAiDiagnostics = null;

    private final WebClient webClient;

    @Value("${app.openrouter.api-key}")
    private String openRouterApiKey;

    @Value("${app.openrouter.url}")
    private String openRouterUrl;

    public SystemMonitorService() {
        HttpClient httpClient = HttpClient.create()
                .option(ChannelOption.CONNECT_TIMEOUT_MILLIS, 10000)
                .responseTimeout(Duration.ofSeconds(15));

        this.webClient = WebClient.builder()
                .clientConnector(new ReactorClientHttpConnector(httpClient))
                .build();
    }

    @PostConstruct
    public void init() {
        this.sink = Sinks.many().multicast().onBackpressureBuffer();
        this.osBean = (OperatingSystemMXBean) ManagementFactory.getOperatingSystemMXBean();
    }

    public Flux<ServerMetricsDto> getMetricsStream() {
        return sink.asFlux();
    }

    public void setSimulationActive(boolean active) {
        this.isSimulationActive = active;
        if (active) {
            triggerAiDiagnostics("Provide a strict 3-bullet-point system remediation fix script in Markdown.");
        } else {
            this.currentAiDiagnostics = null;
        }
    }

    public boolean isSimulationActive() {
        return isSimulationActive;
    }

    public void askFollowUpQuestion(String userPrompt) {
        if (!isSimulationActive) {
            this.currentAiDiagnostics = "### 🎛️ System Standby\nPlease inject a hardware fault simulation benchmark before querying the assistant.";
            emitCurrentState();
            return;
        }
        this.currentAiDiagnostics = null;
        emitCurrentState();
        triggerAiDiagnostics(userPrompt + " Keep the solution highly technical, clean, and concise in Markdown layout formatting.");
    }

    @Scheduled(fixedRate = 2000)
    public void monitorAndEmit() {
        emitCurrentState();
    }

    private void emitCurrentState() {
        double cpuUsage;
        double memoryUsage;

        if (isSimulationActive) {
            cpuUsage = 98.5 + (Math.random() * 1.5);
            memoryUsage = 94.0 + (Math.random() * 5.0);
        } else {
            double load = osBean.getCpuLoad();
            cpuUsage = load < 0 ? 0.0 : load * 100;
            long totalMem = osBean.getTotalMemorySize();
            long freeMem = osBean.getFreeMemorySize();
            memoryUsage = ((double) (totalMem - freeMem) / totalMem) * 100;
        }

        List<Map<String, Object>> processesList = ProcessHandle.allProcesses()
                .filter(ph -> ph.info().command().isPresent())
                .<Map<String, Object>>map(ph -> {
                    String fullPath = ph.info().command().get();
                    String name = fullPath.substring(fullPath.lastIndexOf(File.separator) + 1);

                    double resourceWeight;
                    if (isSimulationActive && (name.toLowerCase().contains("idea") || name.toLowerCase().contains("java"))) {
                        resourceWeight = 84.6 + (Math.random() * 4.1);
                    } else {
                        resourceWeight = 0.5 + (Math.random() * 4.5);
                    }

                    Map<String, Object> procMap = new HashMap<>();
                    procMap.put("pid", ph.pid());
                    procMap.put("name", name);
                    procMap.put("cpu", Math.round(resourceWeight * 10.0) / 10.0);
                    procMap.put("status", resourceWeight > 50.0 ? "CRITICAL" : "RUNNING");
                    return procMap;
                })
                .sorted((a, b) -> Double.compare((Double) b.get("cpu"), (Double) a.get("cpu")))
                .limit(5)
                .collect(Collectors.toList());

        ServerMetricsDto metric = ServerMetricsDto.builder()
                .serverId(1L)
                .cpuUsage(Math.round(cpuUsage * 100.0) / 100.0)
                .memoryUsage(Math.round(memoryUsage * 100.0) / 100.0)
                .recordedAt(LocalDateTime.now())
                .isAnomaly(isSimulationActive)
                .aiDiagnostics(currentAiDiagnostics)
                .topProcesses(processesList)
                .build();

        sink.tryEmitNext(metric);
    }

    private void triggerAiDiagnostics(String dynamicInstruction) {
        String mockedErrorLog = "[ERROR] HikariPool-1 - Connection is not available, request timed out after 30000ms. Root cause: Thread starvation allocated during high workload.";
        String fullPrompt = "Context: You are monitoring a live system architecture showing 98.5% CPU overload crash parameters.\n" +
                "Log Exception: " + mockedErrorLog + "\n" +
                "User Command Instruction: " + dynamicInstruction;

        // FIXED: Using "openrouter/free" routes to the highest availability free model automatically, eliminating 404 errors entirely
        Map<String, Object> requestBody = Map.of(
                "model", "openrouter/free",
                "messages", List.of(Map.of("role", "user", "content", fullPrompt))
        );

        try {
            URI targetUri = new URI(openRouterUrl.trim());

            webClient.post()
                    .uri(targetUri)
                    .header(HttpHeaders.AUTHORIZATION, "Bearer " + openRouterApiKey.trim())
                    .header("HTTP-Referer", "http://localhost:8080")
                    .header("X-Title", "NexusMetricsAI")
                    .contentType(MediaType.APPLICATION_JSON)
                    .bodyValue(requestBody)
                    .retrieve()
                    .bodyToMono(Map.class)
                    .subscribe(
                            response -> {
                                try {
                                    List<Map<String, Object>> choices = (List<Map<String, Object>>) response.get("choices");
                                    Map<String, String> message = (Map<String, String>) choices.get(0).get("message");
                                    this.currentAiDiagnostics = message.get("content");
                                    emitCurrentState();
                                } catch (Exception e) {
                                    log.error("Failed to parse live AI response payload", e);
                                }
                            },
                            error -> {
                                if (error instanceof WebClientResponseException) {
                                    WebClientResponseException wcre = (WebClientResponseException) error;
                                    log.error("OpenRouter Error! Code: {} - Message: {}", wcre.getStatusCode(), wcre.getResponseBodyAsString());
                                    this.currentAiDiagnostics = "### ⚠️ Upstream Network Error (" + wcre.getStatusCode() + ")\n\n" + wcre.getResponseBodyAsString();
                                } else {
                                    log.error("Outbound pipeline failed", error);
                                    this.currentAiDiagnostics = "### ⚠️ Outbound Connection Pipeline Broke";
                                }
                                emitCurrentState();
                            }
                    );
        } catch (Exception ex) {
            log.error("URI framework execution fault", ex);
        }
    }
}