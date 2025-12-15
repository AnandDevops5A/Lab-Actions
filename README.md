# lab-backend (MongoDB)

Spring Boot backend for the Lab-Actions static website using MongoDB and mongo-express in Docker.

To run locally with Docker:

1. Build and start services:

   docker-compose up --build

2. Backend API: http://localhost:8080/api/tournaments
   Mongo Express UI: http://localhost:8081

Notes:
- The compose file seeds sample data into the `labdb` database using `docker/mongo-init.js`.
- To serve your static site from Spring Boot, place files under `src/main/resources/static/`.
