package com.nexusmetrics.ai;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class NexusMetricsApplication {
    public static void main(String[] args) {
        SpringApplication.run(NexusMetricsApplication.class, args);
    }
}
