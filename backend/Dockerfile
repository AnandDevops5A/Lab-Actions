# Stage 1: Build
FROM maven:3.9.6-eclipse-temurin-17-alpine AS build
WORKDIR /app
COPY pom.xml .
RUN mvn dependency:go-offline
COPY src ./src
RUN mvn clean package -DskipTests

# Stage 2: Final Runtime
FROM eclipse-temurin:17-jre-alpine
RUN apk add --no-cache curl && \
    addgroup -S appgroup && adduser -S appuser -G appgroup

WORKDIR /app
# JAR file ko build stage se copy karna [cite: 4]
COPY --from=build --chown=appuser:appgroup /app/target/*.jar app.jar

USER appuser
EXPOSE 8082

# Healthcheck 
HEALTHCHECK --interval=30s --timeout=3s --start-period=60s --retries=3 \
  CMD curl -f http://localhost:8082/actuator/health || exit 1

# SMOOTH PERFORMANCE FIX: Added JVM Memory Options
# -Xmx512m: Maximum 512MB RAM use karega
# -Xms256m: Start 256MB se karega
ENTRYPOINT ["java", "-Xmx512m", "-Xms256m", "-jar", "app.jar"]