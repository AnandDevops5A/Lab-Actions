# Stage 1: Build the application with Maven, optimizing for layer caching
FROM maven:3.9.6-eclipse-temurin-17 AS build
LABEL stage="builder"
WORKDIR /app

# Create a dedicated layer for dependencies. This layer is only rebuilt when pom.xml changes.
COPY pom.xml .
RUN mvn dependency:go-offline

# Copy source code and build the application. This layer is rebuilt on source changes.
COPY src ./src
RUN mvn clean package -DskipTests

# Stage 2: Create the final, lightweight, and secure image
FROM eclipse-temurin:17-jre-jammy
LABEL maintainer="your-team@example.com"

ARG APP_USER=appuser
ARG APP_GROUP=appgroup
ARG APP_PORT=8080

# Create a non-root user for security and install necessary tools in a single layer.
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/* && \
    groupadd -r ${APP_GROUP} && useradd --no-log-init -r -g ${APP_GROUP} ${APP_USER}

WORKDIR /app

# Copy the application JAR from the build stage and set permissions
COPY --from=build --chown=${APP_USER}:${APP_GROUP} /app/target/*.jar app.jar

# Switch to the non-root user
USER ${APP_USER}

# Expose the application port for documentation and interoperability
EXPOSE ${APP_PORT}

# Add a healthcheck to ensure the application is running correctly.
# This is crucial for container orchestrators to manage the application's lifecycle.
# Assumes a Spring Boot actuator endpoint is available at /actuator/health.
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:${APP_PORT}/actuator/health || exit 1

# Set the entrypoint to run the application.
# Consider externalizing JVM options via an environment variable (e.g., JAVA_OPTS) for production.
ENTRYPOINT ["java", "-jar", "app.jar"]