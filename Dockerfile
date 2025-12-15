# Builder
FROM maven:3.8.8-eclipse-temurin-17 AS builder
WORKDIR /build
COPY pom.xml .
COPY src ./src
RUN mvn -B package -DskipTests

# Runner
FROM eclipse-temurin:17-jre
ARG JAR_FILE=/build/target/*.jar
COPY --from=builder ${JAR_FILE} /app/app.jar
EXPOSE 8080
ENTRYPOINT ["java","-jar","/app/app.jar"]
