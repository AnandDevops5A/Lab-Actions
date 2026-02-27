// Docker Buildx bake file for rapid frontend & backend image builds

group "default" {
  targets = ["backend", "frontend"]
}

// Backend image (Spring Boot)
target "backend" {
  // Use backend folder as build context so Dockerfile paths (pom.xml, src/) resolve correctly
  context    = "backend"
  dockerfile = "Dockerfile"

  // Local dev tag
  tags = ["lab-actions-backend:dev"]
}

// Frontend image (Next.js)
target "frontend" {
  context    = "."
  dockerfile = "Dockerfile"

  // Local dev tag
  tags = ["lab-actions-frontend:dev"]

  // Default API URL for local dev builds; override with:
  //   docker buildx bake frontend --set frontend.args.NEXT_PUBLIC_API_URL=http://host.docker.internal:8082
  args = {
    NEXT_PUBLIC_API_URL = "http://localhost:8082"
  }
}

