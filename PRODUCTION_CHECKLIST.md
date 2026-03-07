# t2.micro Production Deployment Checklist

## 🚀 Pre-Deployment

### Security
- [ ] Change default SSH key
- [ ] Enable Security Group rules (minimal ports)
- [ ] Set up CloudWatch alarms for CPU/Memory
- [ ] Enable VPC Flow Logs
- [ ] Use IAM roles instead of access keys
- [ ] Enable t2.micro detailed monitoring

### Environment
- [ ] `.env` file created with all secrets
- [ ] `.env` file NOT committed to git
- [ ] Backup MongoDB setup (Atlas recommended)
- [ ] Mail service tested and working
- [ ] DNS records pointing to EC2 instance

### Application
- [ ] Backend images pushed to Docker Hub
- [ ] All dependencies installed: `docker pull`
- [ ] Health endpoints working locally
- [ ] Unit/integration tests passing

### Infrastructure
- [ ] Swap configured on EC2 (`2-4GB` recommended for t2.micro)
- [ ] CloudWatch agent installed for monitoring
- [ ] Log rotation configured
- [ ] Backup strategy in place

---

## 📋 Startup Procedure

### Step 1: Connect to EC2
```bash
ssh -i your-key.pem ec2-user@your-instance-ip
```

### Step 2: Clone Repository
```bash
cd /home/ec2-user
git clone https://github.com/your-repo.git
cd Lab-Actions
```

### Step 3: Create .env File
```bash
cp .env.example .env
nano .env
# Edit with your actual values:
# - MongoDB URI
# - JWT_SECRET
# - Mail credentials
# - Frontend URL
# - Admin contacts
```

### Step 4: Create Swap (CRITICAL for t2.micro)
```bash
# Check if swap exists
swapon --show

# If no swap, create 2GB
sudo dd if=/dev/zero of=/swapfile bs=1G count=2
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile

# Make permanent
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

### Step 5: Start Services
```bash
# Start all containers
docker-compose up -d

# Wait 30-60 seconds for backends to initialize
sleep 45

# Check status
docker-compose ps
```

### Step 6: Verify Health
```bash
# All containers running?
docker-compose ps

# Backend-1 healthy?
curl http://localhost:8082/actuator/health

# Backend-2 healthy?
curl http://localhost:8083/actuator/health

# Redis responsive?
docker exec redis redis-cli ping

# Logs checking
docker-compose logs --tail=20
```

### Step 7: Test Load Balancing (Optional)
```bash
# Request 1
curl http://localhost/api/endpoint

# Check which backend served it
docker-compose logs nginx | tail -5
```

---

## 🔄 Restart Procedures

### Graceful Shutdown (preserve state)
```bash
# Stop all containers (data persisted)
docker-compose down

# Restart
docker-compose up -d

# Verify
docker-compose ps
```

### Force Rebuild (update images)
```bash
# Pull latest images
docker-compose pull

# Rebuild and restart
docker-compose up -d --force-recreate

# Check logs
docker-compose logs -f backend-1
```

### Emergency Restart (clear everything)
```bash
# CAUTION: This removes all containers and volumes
docker-compose down -v

# Start fresh
docker-compose up -d

# Verify
docker-compose ps
```

---

## 📊 Monitoring Commands

### Real-time Container Stats
```bash
# CPU, Memory, Network usage
docker stats

# CPU usage on EC2
top -b -n 1 | head -10

# Memory usage
free -h

# Disk usage
df -h

# Swap usage
swapon --show
```

### Service Health
```bash
# All services
docker-compose ps

# Specific service logs
docker-compose logs backend-1 --tail=50
docker-compose logs redis --tail=50

# Real-time logs
docker-compose logs -f backend-1
```

### Network Status
```bash
# Open ports
sudo ss -tulpn | grep LISTEN

# Active connections
sudo netstat -an | grep ESTABLISHED | wc -l
```

### Application Logs
```bash
# Backend logs
docker exec backend-1 tail -f /var/log/application.log

# Redis logs
docker exec redis redis-cli info stats

# Nginx access logs
docker exec nginx-proxy tail -f /var/log/nginx/access.log
```

---

## 📡 Monitoring URLs

| Service | URL | Purpose |
|---------|-----|---------|
| Dozzle Logs | `http://<ip>:9999` | View all container logs |
| Backend-1 Health | `http://<ip>:8082/actuator/health` | Backend status |
| Backend-2 Health | `http://<ip>:8083/actuator/health` | Backend status |
| Nginx Health | `http://<ip>/health` | Reverse proxy status |
| API Health | `http://<ip>/backend-health` | Upstream health |

---

## ⚠️ Common Issues on t2.micro

### Issue 1: Services Keep Restarting
```bash
# Check available memory
free -h

# Check disk space
df -h

# View error logs
docker-compose logs --tail=100
```
**Solution**: Increase swap or reduce resource allocation

### Issue 2: High CPU Usage
```bash
# Check which process
docker stats

# Check Java GC logs
docker exec backend-1 jps -l
docker exec backend-1 jstat -gc java_process_id
```
**Solution**: Tune JVM settings in JAVA_OPTS or upgrade instance

### Issue 3: One Backend Not Receiving Traffic
```bash
# Check if healthy
curl http://localhost:8083/actuator/health

# Check Nginx configuration
docker exec nginx-proxy nginx -t

# View upstream status
docker exec nginx-proxy cat /etc/nginx/conf.d/default.conf | grep -A 5 upstream
```
**Solution**: Restart failed backend or check application logs

### Issue 4: Redis OOM Errors
```bash
# Check memory usage
docker exec redis redis-cli info memory

# Check eviction stats
docker exec redis redis-cli info stats | grep evicted
```
**Solution**: Increase maxmemory or optimize data structure

### Issue 5: Slow Response Times
```bash
# Check response times in Nginx logs
docker exec nginx-proxy grep "upstream_response_time" /var/log/nginx/access.log | awk '{print $NF}' | sort -n | tail -20

# Check backend processing time
docker-compose logs backend-1 | grep "took" | tail -20
```
**Solution**: Optimize queries, add caching, or upgrade instance

---

## 🔐 Security Checklist - Production

- [ ] JWT_SECRET is 32+ characters, random
- [ ] All environment variables use AWS Secrets Manager
- [ ] Database backups automated (MongoDB Atlas auto-backup)
- [ ] Log aggregation enabled (CloudWatch Logs)
- [ ] SSL/TLS certificate (Let's Encrypt + Nginx)
- [ ] Rate limiting enabled (6 req/sec for API)
- [ ] SQL injection protection via ORM
- [ ] CORS properly configured
- [ ] Sensitive logs masked/redacted
- [ ] Container image scanning enabled
- [ ] Regular dependency updates scheduled
- [ ] DDoS protection (AWS Shield Standard)

---

## 📈 Scaling Beyond t2.micro

When you outgrow t2.micro:

1. **Vertical Scaling** → t2.small, t3.medium
2. **Horizontal Scaling** → Multiple instances with RDS/ElastiCache
3. **Auto Scaling Groups** → Auto-scale based on metrics
4. **Kubernetes** → EKS for orchestration

But for now, optimize for t2.micro:
- Efficient database queries
- Redis caching layer
- Load test to identify bottlenecks
- Monitor and alert early

---

## 🚨 Disaster Recovery

### Backup Strategy
```bash
# Backup MongoDB (if self-hosted)
docker exec backend-1 mongodump --uri="mongodb://..." --out=/backup

# Backup Redis
docker exec redis redis-cli BGSAVE

# Backup application data
tar -czf backup-$(date +%Y%m%d).tar.gz /var/lib/docker/volumes/
```

### Recovery Procedure
```bash
# Stop services
docker-compose down

# Restore volumes
tar -xzf backup-20260307.tar.gz

# Restart
docker-compose up -d

# Verify
docker-compose ps
curl http://localhost:8082/actuator/health
```

---

## 📞 Support & Debugging

### Enable Debug Mode
```bash
# Update .env
LOGGING_LEVEL_ROOT=DEBUG
SPRING_PROFILES_ACTIVE=dev

# Restart
docker-compose restart backend-1 backend-2

# View full logs
docker-compose logs -f
```

### Collect Debug Information
```bash
# System info
uname -a
free -h
df -h

# Docker info
docker --version
docker-compose --version
docker ps
docker images

# Service logs
docker-compose logs > debug.log

# Send for support
```

---

**Last Updated**: March 7, 2026
**Recommended**: Review this checklist before each deployment
