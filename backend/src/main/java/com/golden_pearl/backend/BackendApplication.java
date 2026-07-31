package com.golden_pearl.backend;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;
import org.springframework.scheduling.annotation.EnableAsync;

import lombok.extern.slf4j.Slf4j;

@SpringBootApplication
@EnableMongoRepositories
@EnableAsync
@Slf4j
public class BackendApplication {

	public static void main(String[] args) {
		log.info("Backend application is starting...");
		SpringApplication.run(BackendApplication.class, args);
		log.info("Backend application started successfully.");
	}

}
