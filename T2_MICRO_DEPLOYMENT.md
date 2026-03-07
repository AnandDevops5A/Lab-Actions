# t2.micro Deployment Guide - 2 Backends, Redis & Dozzle

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────┐
│                   t2.micro (1GB RAM)                │
├─────────────────────────────────────────────────────┤
│                                                      │
│  ┌──────────────────────────────────────────────┐  │
│  │          NGINX (Reverse Proxy)                │  │
│  │  • Load Balancing (2 backends)                │  │
│  │  • Rate Limiting (API protection)             │  │
│  │  • Caching (Static assets)                    │  │
│  └──────────────────────────────────────────────┘  │
│         ↓                          ↓                 │ 
│  ┌────────────────────┐    ┌────────────────────┐  │
│  │   BACKEND-1:8082   │    │   BACKEND-2:8083   │  │
│  │  (Spring Boot)     │    │  (Spring Boot)     │  │
│  │  • 300MB RAM limit │    │  • 300MB RAM limit │  │
│  │  • 0.4 CPU cores   │    │  • 0.4 CPU cores   │  │
│  └────────────────────┘    └────────────────────┘  │
│         ↓                          ↓                 │
│  ┌──────────────────────────────────────────────┐  │
│  │         REDIS (In-Memory Cache)              │  │
│  │  • 256MB RAM limit                           │  │
│  │  • LRU eviction policy                       │  │
│  │  • AOF persistence (optional)                │  │
│  └──────────────────────────────────────────────┘  │
│                                                      │
│  ┌──────────────────────────────────────────────┐  │
│  │      DOZZLE (Log Aggregation - Port 9999)    │  │
│  │  • Monitor all containers                    │  │
│  │  • 100MB RAM limit                           │  │
│  └──────────────────────────────────────────────┘  │
│                                                      │
│  External Services:                                  │
│  • MongoDB (cloud-hosted)                           │
│  • Mail service                                     │
│  • Payment gateway                                  │
└─────────────────────────────────────────────────────┘
```

---

## 📋 Resource Allocation (Total ~1GB)

| Service | CPU | Memory | Purpose |
|---------|-----|--------|---------|
| Redis | 0.3 | 256MB | In-memory caching |
| Backend-1 | 0.4 | 300MB | Primary API instance |
| Backend-2 | 0.4 | 300MB | Secondary API instance |
| Dozzle | 0.2 | 100MB | Log monitoring |
| Nginx | 0.2 | 100MB | Load balancer |
| **System Buffer** | - | **~150MB** | OS & overhead |
| **TOTAL** | **1.5** | **~1154MB** | - |

> ⚠️ **Note**: Total exceeds 1GB because some services share OS resources. Docker will manage bursting.

---

## 🚀 Quick Start Commands

### 1. Pull Images (Optional, saves startup time)
```bash
docker pull redis:7-alpine
docker pull anand7254/golden-pearl-backend:latest
docker pull amir20/dozzle:latest
docker pull nginx:alpine
```

### 2. Start Services
```bash
# Start all services
docker-compose up -d

# View logs in real-time
docker-compose logs -f

# View specific service logs
docker-compose logs -f backend-1
docker-compose logs -f backend-2
docker-compose logs -f redis
```

### 3. Monitor with Dozzle
Open browser: `http://<your-ec2-ip>:9999`

### 4. Health Checks
```bash
# Check all services
docker-compose ps

# Check backend-1 health
curl http://localhost:8082/actuator/health

# Check backend-2 health
curl http://localhost:8083/actuator/health

# Check Redis
docker exec redis redis-cli ping
```

---

## 🔧 Key Improvements for t2.micro

### 1. **Resource Limits**
```yaml
deploy:
  resources:
    limits:
      cpus: '0.4'        # Prevent CPU hogging
      memory: 300M       # Memory boundary
    reservations:
      cpus: '0.2'        # Guaranteed minimum
      memory: 200M       # Guaranteed minimum
```

### 2. **Java Memory Optimization**
```bash
JAVA_OPTS=-Xmx256m -Xms128m
# -Xmx: Maximum heap size (256MB)
# -Xms: Initial heap size (128MB)
# Reduces startup time and memory footprint
```

### 3. **Redis Optimization**
```bash
--maxmemory 256mb --maxmemory-policy allkeys-lru
# LRU: Evict least recently used keys when memory is full
# Prevents Redis OOM crashes
```

### 4. **Load Balancing Strategy**
```nginx
upstream backend_pool {
    least_conn;  # Routes to backend with fewer connections
    server backend-1:8082 max_fails=3 fail_timeout=30s;
    server backend-2:8083 max_fails=3 fail_timeout=30s;
}
```
- **least_conn** is better than round-robin for variable request processing times
- Automatic failover if one backend fails

### 5. **Rate Limiting**
```nginx
limit_req_zone $binary_remote_addr zone=api_limit:10m rate=10r/s;
# Protects API from abuse
# 10 requests per second per IP, burst up to 20
```

### 6. **Improved Healthchecks**
```yaml
healthcheck:
  test: ["CMD", "curl", "-f", "http://localhost:8082/actuator/health"]
  interval: 20s    # Check every 20 seconds
  timeout: 5s      # Timeout after 5 seconds
  retries: 3       # Fail after 3 consecutive failures
  start_period: 60s # Grace period on startup
```

---

## 📝 Configuration Files Summary

### docker-compose.yaml Changes
✅ Two backend instances (backend-1, backend-2) with separate ports
✅ Redis with memory limits and persistence volume
✅ Dozzle container for log aggregation (port 9999)
✅ Resource limits on all services
✅ Improved JVM arguments for Spring Boot
✅ Healthchecks with proper dependencies
✅ Redis data volume for persistence

### nginx.conf Changes
✅ Upstream block for load balancing
✅ least_conn algorithm for better distribution
✅ Rate limiting for API protection
✅ Proper timeout configuration
✅ Gzip compression enabled
✅ Cache management optimized for t2.micro
✅ Health check endpoints

---

## ⚠️ Important Considerations

### 1. **Startup Order**
```
Redis → Backend-1 & Backend-2 → Nginx → Dozzle
```
- Redis starts first (both backends depend on it)
- Backends can start in parallel
- Docker handles this via `depends_on`

### 2. **Memory Swapping**
If services crash unexpectedly, check swap usage:
```bash
free -h
swapon --show
```
If using swap, you may need to optimize further.

### 3. **Restart Policy**
All services set to `restart: always` for reliability.

### 4. **Logs Location**
```bash
# View service logs
docker-compose logs backend-1
docker-compose logs backend-2

# Persistent logs (in container)
docker exec backend-1 tail -f /var/log/app.log
```

### 5. **CPU Throttling**
t2.micro has burst capabilities but limited baseline. If load is consistent, you may hit CPU limits. Monitor with:
```bash
docker stats
```

---

## 🔍 Monitoring Commands

```bash
# Container stats
docker stats

# Check memory usage
free -m

# Disk usage
df -h

# Process list
ps aux | grep docker

# Network connections
netstat -tulpn | grep LISTEN

# Check logs
journalctl -u docker -n 50 --no-pager
```

---

## ✅ Checklist Before Deployment

- [ ] `.env` file configured with all required variables
- [ ] MongoDB connection string is valid (cloud-hosted)
- [ ] Mail service credentials updated
- [ ] JWT_SECRET is strong and secure
- [ ] FRONTEND_URL points to your domain
- [ ] Backend images built and pushed to Docker Hub
- [ ] Nginx uncommented in docker-compose.yaml if needed
- [ ] Security groups allow ports: 80, 443, 9999, 8082, 8083
- [ ] Sufficient swap configured on EC2 instance

---

## 🆘 Troubleshooting

### All containers keep restarting
```bash
docker-compose logs --tail=50
# Check for OOM (Out of Memory) errors
```

### One backend not receiving traffic
```bash
# Check if healthy
curl http://localhost:8083/actuator/health
# Check nginx logs
docker exec nginx-proxy tail -f /var/log/nginx/access.log
```

### Redis memory full
```bash
docker exec redis redis-cli info memory
# Check eviction stats
docker exec redis redis-cli info stats | grep evicted
```

### High CPU usage
```bash
docker stats
# Reduce concurrency in Spring Boot application.yml
```

---

## 📚 Resources

- [Docker Compose Specification](https://docs.docker.com/compose/compose-file/)
- [Nginx Upstream Load Balancing](https://nginx.org/en/docs/http/ngx_http_upstream_module.html)
- [Redis Memory Management](https://redis.io/docs/management/admin/config/#maxmemory)
- [Spring Boot Actuator Health](https://spring.io/guides/gs/actuator-service/)

---

**Last Updated**: March 7, 2026
**Environment**: AWS t2.micro (1GB RAM, 1 vCPU)
