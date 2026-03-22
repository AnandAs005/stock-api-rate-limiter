# Stock Price Rate Limiter API

## 📌 Overview
This project is a high-performance NestJS-based API that provides stock price information while enforcing tiered rate limits. It distinguishes between **Free** and **Premium** users to ensure fair usage and scalability.

## 🚀 Key Features
- **NestJS Framework**: Highly structured and scalable architecture.
- **PostgreSQL**: Robust persistent storage for users and usage logs.
- **Custom Middleware Rate Limiter**: Dynamically adjusts limits based on user subscription (Free: 5 req/min, Premium: 100 req/min).
- **Swagger Documentation**: Interactive API testing and exploration.
- **DTO Validation**: Strict request/response validation using `class-validator`.
- **Error Handling**: Standardized, user-friendly error messages for 401, 404, and 429 status codes.

---

## 🛠 Tech Stack
- **Backend**: NestJS
- **Database**: PostgreSQL (TypeORM)
- **Validation**: class-validator & class-transformer
- **Documentation**: Swagger
- **Environment**: ConfigModule (.env support)

---

## 📂 Project Structure
```text
src/
├── app.module.ts            # Root module configuring DB, Config, and Middleware
├── main.ts                  # Application entry point with Swagger setup
├── common/                  # Shared resources
│   ├── filters/             # GlobalExceptionFilter
│   └── middleware/          # RateLimiterMiddleware implementation
├── stock/                   # Stock feature logic
│   ├── dto/                 # Stock-specific Data Transfer Objects
│   ├── stock.controller.ts  # Endpoint logic
│   └── stock.service.ts     # Business logic for stock price
└── users/                   # User management
    ├── entities/            # TypeORM User entity
    ├── enums/               # User Tier (FREE/PREMIUM)
    └── users.service.ts     # User lookup and creation
```

---

## 🔄 API Flow
1. **Request**: User sends a `GET /stock-price/:symbol` request with an `x-api-key` header.
2. **Middleware**: `RateLimiterMiddleware` intercepts the request.
   - It extracts the `x-api-key`.
   - It fetches the user from PostgreSQL.
   - It identifies the tier (FREE or PREMIUM).
3. **Rate Limiting**:
   - If FREE: Limit = 5/min.
   - If PREMIUM: Limit = 100/min.
   - If Limit Exceeded: Returns `429 Too Many Requests`.
4. **Execution**: If within limits, `StockService` generates the mock price.
5. **Response**: User receives the `StockPriceResponseDto` with the requested data.

---

## ⚙️ Installation & Setup

### 1. Requirements
- Node.js (v18+)
- PostgreSQL

### 2. Environment Variables
Create a `.env` file in the root directory:
```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_DATABASE=stock_limiter
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Database Migrations
The project uses TypeORM migrations to manage the database schema.
```bash
# Run migrations to create tables
npm run migration:run
```

### 5. Run the Application
```bash
npm run start:dev
```

---

## 📖 API Documentation (Swagger)
Once the app is running, visit:
**[http://localhost:3001/api](http://localhost:3001/api)**

### Example Usage
1. **Identify your API Key**: Check the `users` table or use a predefined key like `api_key_free_123`.
2. **Call the API**:
   - Call `GET /stock-price/AAPL` with header `x-api-key: your_key`.
   - If you exceed the limit (e.g., more than 5 calls/min for Free), you will receive:
     ```json
     {
       "statusCode": 429,
       "timestamp": "2024-03-22T21:45:00.000Z",
       "path": "/stock-price/AAPL",
       "error": "Wait! You have exceeded your API call limit. Upgrade to Premium for 100 calls per minute."
     }
     ```
