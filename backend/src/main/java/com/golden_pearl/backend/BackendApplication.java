package com.golden_pearl.backend;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class BackendApplication {

	public static void main(String[] args) {
		System.out.println("Backend application is starting...");
		SpringApplication.run(BackendApplication.class, args);
		System.out.println("Backend application started successfully.");
	}

}
