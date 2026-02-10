package com.golden_pearl.backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.AsyncConfigurer;
import org.springframework.scheduling.annotation.EnableAsync;

@Configuration
@EnableAsync
public class AsyncConfig implements AsyncConfigurer {
    // This class enables Spring's asynchronous method execution capability.
    // By adding @EnableAsync, any method in the application annotated with @Async
    // will be executed in a background thread pool, making the operation non-blocking.
}