# Stock Price Rate Limiter API

## 📌 Overview
This project is a high-performance NestJS-based API that provides stock price information while enforcing tiered rate limits. It distinguishes between **Free** and **Premium** users to ensure fair usage and scalability.

## 🚀 Key Features
- **NestJS Framework**: Highly structured and scalable architecture.
- **Static & Persistent Users**: Supports both hardcoded static users for testing and database-backed users.
- **Custom Middleware Rate Limiter**: Dynamically adjusts limits based on subscription (Free: 5 req/min, Premium: 100 req/min).
- **Swagger Documentation**: Interactive API testing and exploration.
- **Error Handling**: Standardized, user-friendly error messages with specific feedback for Premium users.

---

## 🛠 Tech Stack
- **Backend**: NestJS
- **Database**: PostgreSQL (TypeORM with Synchronize enabled)
- **Environment**: ConfigModule (.env support)

---

## 📂 Project Structure
```text
src/
├── app.module.ts            # Root module configuration
├── main.ts                  # Application entry point
├── common/                  # Shared filters and middleware
├── stock/                   # Stock feature logic
└── users/                   # User management with static fallback
```

---

## 🔄 API Flow
1. **Request**: User sends a `GET /stock-price/:symbol` with an `x-api-key` header.
2. **Middleware**: `RateLimiterMiddleware` identifies the user and tier.
3. **Rate Limiting**:
   - **FREE**: 5 req/min.
   - **PREMIUM**: 100 req/min.
4. **Response**: 200 OK (Price data) or 429 Too Many Requests.

---

## ⚙️ Installation & Setup

### 1. Requirements
- Node.js (v18+)
- PostgreSQL

### 2. Environment Variables
Create a `.env` file with your database credentials.

### 3. Install & Run
```bash
npm install
npm run start:dev
```

---

## 🔑 Static API Keys (For Testing)
The following users are baked into the system and do not require database setup:

| User Type | API Key | Limit |
|-----------|---------|-------|
| **FREE** | `api_key_free_123` | 5 req/min |
| **PREMIUM** | `api_premium_free_123` | 100 req/min |

### Example 429 Error (Premium)
```json
{
  "statusCode": 429,
  "timestamp": "2026-03-22T21:55:00.000Z",
  "path": "/stock-price/AAPL",
  "error": "You have exceeded your Premium API call limit (100 req/min). Please wait a moment before trying again."
}
```
