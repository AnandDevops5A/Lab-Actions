## Hinglish Updates & Testing Guide

Ye document explain karta hai ki backend me kya updates kiye gaye hain, kyun useful hain, aur kaise test kar sakte ho.

---

### 1) Authentication & Authorization (JWT Security)

#### Kya update hua?
- Backend me **JWT token based security** add ki gayi hai:
  - `JwtService`: token create + verify karta hai.
  - `JwtAuthenticationFilter`: `Authorization: Bearer <token>` header read karke user ko authenticate karta hai.
  - `SecurityConfig`: ab endpoints pe **real rules** apply karta hai:
    - Kuch endpoints **public** (login/register/reset + GET reads)
    - Kuch endpoints **admin-only**
    - Baaki sab endpoints **authenticated** (token required)

#### Kyun useful hai?
- Pehle `permitAll()` tha → koi bhi user **sab kuch access** kar sakta tha.
- Ab:
  - Sensitive endpoints secure ho gaye.
  - Admin actions (tournament add/delete, approvals etc.) protected.
  - Production me unauthorized access ka risk kaafi reduce hota hai.

#### Important env vars (must set)
- `JWT_SECRET`: strong secret string (32+ chars recommended)
- `ADMIN_CONTACTS`: comma-separated contacts jo admin honge (e.g. `917254831884,7254831884`)

Compose file `ApplicationDocker.yaml` me ye env vars pass kar diye gaye hain:
- `JWT_SECRET=${JWT_SECRET}`
- `ADMIN_CONTACTS=${ADMIN_CONTACTS}`

---

### 2) `/users/verify` now returns Token (Frontend auto-works)

#### Kya update hua?
- `POST /users/verify` ab `User` object direct return nahi karta.
- Ab ek safe DTO return hota hai: `AuthenticatedUserDTO`
  - isme **`token`** field add hai.
  - password (`accessKey`) intentionally include nahi hota.

#### Kyun useful hai?
- Frontend me already code hai jo localStorage se `token/accessToken` read karke header set karta hai.
- Ab login ke baad automatically:
  - `Authorization: Bearer <token>` requests me attach ho jayega.

---

### 3) Server-side Validation (Input Validation)

#### Kya update hua?
- `spring-boot-starter-validation` add hua.
- DRO/Request records me validation annotations add ki:
  - `UserAuth`, `UserRegisterData`, `ForgotPasswordDRO`, `ConfirmResetDRO`
  - `LeaderboardRegisterReceiveData`, `ReviewDRO`, `AdminReplyDRO`
  - `TournamentReceiveData`, `UpdateRank`, `UserDetailsUpdateReceive`
- Controllers me `@Valid` lagaya, so invalid request pe clean 400 response.

#### Kyun useful hai?
- Garbage/empty input database tak nahi jayega.
- Bugs + security issues reduce hote hain.
- API predictable ban jati hai (good for frontend + prod).

---

### 4) Error Handling Hardened (No sensitive info leak)

#### Kya update hua?
- `GlobalExceptionHandler` improve kiya:
  - Validation errors ka proper response
  - 500 errors me **internal exception message leak** nahi hota
  - Server side logging add

#### Kyun useful hai?
- Production me internal stacktrace/messages expose nahi hoti.
- Debugging ke liye logs available rahenge.

---

### 5) Password update bug fix

#### Kya update hua?
- `UserService.updateUser()` me agar user new password bhejta hai:
  - ab password **hash (BCrypt)** hoke save hota hai.

#### Kyun useful hai?
- Plain text password store hona huge security risk hai.
- Ab passwords safe way me store honge.

---

## Testing Guide (Local / Docker)

### A) Env setup
Apni `.env` me ye add karo (example):

```env
JWT_SECRET="change-this-to-a-long-random-secret-please-32-chars-min"
ADMIN_CONTACTS="917254831884,7254831884"
```

### B) Backend build test (without Docker)
Backend folder me:

```bash
./mvnw -DskipTests package
```

### C) Backend run (local)
Agar locally run kar rahe ho, env vars set karo:

- `JWT_SECRET`
- `ADMIN_CONTACTS`
- `FRONTEND_URL`
- Mongo/Redis/mail vars as needed

Then run Spring Boot as you normally do.

### D) API tests (quick curl examples)

#### 1) Login / Verify (token generate)

```bash
curl -X POST "http://localhost:8082/users/verify" ^
  -H "Content-Type: application/json" ^
  -d "{\"contact\": 7254831884, \"accessKey\": \"YOUR_PASSWORD\"}"
```

Expected: response me `token` aayega.

#### 2) Admin endpoint (should require admin token)
Pehle login karo, token copy karo, then:

```bash
curl "http://localhost:8082/admin/data" ^
  -H "Authorization: Bearer YOUR_TOKEN"
```

- Agar contact `ADMIN_CONTACTS` me hai → 200 OK
- Otherwise → 403 Forbidden

#### 3) Public GET endpoint (no token needed)

```bash
curl "http://localhost:8082/tournament/upcoming"
```

Expected: 200 OK without token.

---

## Notes (Production / EC2)
- EC2 pe `.env` commit mat karo. Secrets runtime env ya AWS secrets manager se inject karo.
- `JWT_SECRET` ko strong + private rakho.
- `ADMIN_CONTACTS` ko production me carefully maintain karo.

