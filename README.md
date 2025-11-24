# CodePairArena Backend 🏆

A comprehensive backend API for a competitive programming platform. Built with Node.js, Express, and MongoDB, it provides a complete coding challenge system with real-time code execution via Judge0, problem management, user authentication, and submission tracking.

<p align="center">
  <a href="#-features">Features</a> •
  <a href="#-tech-stack">Tech Stack</a> •
  <a href="#-project-structure">Project Structure</a> •
  <a href="#-installation--setup">Installation</a> •
  <a href="#-api-endpoints">API Endpoints</a> •
  <a href="#-contributing">Contributing</a>
</p>

---

<div id="-features">

## 🚀 Features

### Code Execution Engine
-   **Judge0 Integration**: Real-time code execution and evaluation using Judge0 API.
-   **Multi-Language Support**: Execute code in Python, JavaScript, Java, and C++.
-   **Batch Test Case Execution**: Run multiple test cases simultaneously.
-   **Detailed Results**: Get comprehensive feedback including:
    -   Test case pass/fail status
    -   Execution time and memory usage
    -   Standard output and error messages
    -   Compilation errors

### Problem Management
-   **Rich Problem Schema**: 
    -   Problem statements with examples and constraints
    -   Difficulty levels (Easy, Medium, Hard)
    -   Tags and company associations
    -   Hidden and visible test cases
    -   Code snippets for different languages
    -   Reference solutions and editorial content
    -   Hints and related topics
-   **CRUD Operations**: Full problem lifecycle management (Admin only for creation).
-   **Pagination Support**: Efficient problem listing with mongoose-aggregate-paginate.

### Submission System
-   **Submission Tracking**: Store and retrieve user code submissions.
-   **Execution History**: Track compilation output, status, time, and memory.
-   **User-Problem Mapping**: Link submissions to users and problems.

### Authentication & Authorization
-   **Multiple Auth Methods**: Email/Password, Google OAuth, GitHub OAuth.
-   **JWT-Based Sessions**: Secure stateless authentication.
-   **Role-Based Access Control**: Admin and User roles.
-   **Email Verification**: Token-based email verification.
-   **Password Management**: Forgot password and reset functionality.

### Security & Performance
-   **Rate Limiting**: 5000 requests per 15 minutes.
-   **CORS Configuration**: Flexible cross-origin setup.
-   **Input Validation**: Zod schemas for request validation.
-   **Logging**: Winston and Morgan for comprehensive logging.

</div>

<div id="-tech-stack">

## 🛠️ Tech Stack

-   **Runtime**: [Node.js](https://nodejs.org/)
-   **Framework**: [Express.js](https://expressjs.com/) v5
-   **Database**: [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/)
-   **Code Execution**: [Judge0 API](https://judge0.com/)
-   **Authentication**: 
    -   [Passport.js](https://www.passportjs.org/) (OAuth)
    -   [JWT](https://jwt.io/)
    -   [Bcrypt.js](https://github.com/dcodeIO/bcrypt.js)
-   **Email**: [Resend](https://resend.com/), [Nodemailer](https://nodemailer.com/), [Mailgen](https://github.com/eladnava/mailgen)
-   **File Upload**: [Multer](https://github.com/expressjs/multer) + [Cloudinary](https://cloudinary.com/)
-   **Validation**: [Zod](https://zod.dev/)
-   **Logging**: [Winston](https://github.com/winstonjs/winston), [Morgan](https://github.com/expressjs/morgan)
-   **Data Processing**: [CSV Parser](https://www.npmjs.com/package/csv-parser)

</div>

<div id="-project-structure">

## 📂 Project Structure

```
CodePairArena-Backend/
├── src/
│   ├── app.js                          # Express app configuration
│   ├── index.js                        # Entry point & DB connection
│   ├── constants.js                    # App constants (Roles, Difficulty, Languages)
│   ├── controllers/
│   │   ├── auth.controllers.js         # Authentication logic
│   │   ├── codeExecution.controllers.js # Judge0 integration & code execution
│   │   ├── problem.controllers.js      # Problem CRUD operations
│   │   ├── submission.controllers.js   # Submission management
│   │   ├── contact.controllers.js      # Contact form handling
│   │   └── healthCheck.controllers.js
│   ├── middlewares/
│   │   ├── auth.middleware.js          # JWT verification & role checking
│   │   └── multer.middleware.js        # File upload handling
│   ├── models/
│   │   ├── user.models.js              # User schema
│   │   ├── problem.models.js           # Problem schema (with test cases, examples, etc.)
│   │   └── submission.models.js        # Submission schema
│   ├── routes/
│   │   ├── auth.routes.js              # Auth endpoints
│   │   ├── executeCode.routes.js       # Code execution endpoints
│   │   ├── problem.routes.js           # Problem endpoints
│   │   ├── submission.routes.js        # Submission endpoints
│   │   └── healthCheck.routes.js
│   ├── utils/
│   │   ├── ApiError.js                 # Custom error class
│   │   ├── ApiResponse.js              # Standardized responses
│   │   ├── asyncHandler.js             # Async error wrapper
│   │   ├── cloudinary.js               # Cloudinary upload
│   │   ├── db.js                       # Database connection
│   │   └── mail.js                     # Email utilities
│   ├── validators/
│   │   ├── auth.validators.js          # Auth validation schemas
│   │   ├── problem.validators.js       # Problem validation schemas
│   │   └── submission.validators.js    # Submission validation schemas
│   ├── logger/
│   │   ├── winston.logger.js           # Winston configuration
│   │   └── morgan.logger.js            # Morgan configuration
│   └── passport/
│       └── index.js                    # Passport strategies
├── public/                             # Static files & uploads
├── sample.json                         # Sample problem data
├── .env.sample                         # Environment variables template
└── package.json                        # Dependencies
```

</div>

<div id="-installation--setup">

## ⚙️ Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/arush73/CodePairArena-Backend.git
    cd CodePairArena-Backend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Configure Environment Variables:**
    Create a `.env` file in the root directory:
    ```env
    PORT=8080
    NODE_ENV=development

    MONGODB_URI=mongodb://localhost:27017/codepairarena

    # Generate strong random secrets for production
    # You can use: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
    EXPRESS_SESSION_SECRET=your_express_session_secret_here_min_32_chars

    ACCESS_TOKEN_SECRET=your_access_token_secret_here_min_32_chars
    ACCESS_TOKEN_EXPIRY=1d

    REFRESH_TOKEN_SECRET=your_refresh_token_secret_here_min_32_chars
    REFRESH_TOKEN_EXPIRY=10d

    CORS_ORIGIN=http://localhost:3000

    JUDGE0_URL=https://judge0-ce.p.rapidapi.com
    JUDGE0_API_KEY=your_rapidapi_key_here

    MAILTRAP_SMTP_HOST=sandbox.smtp.mailtrap.io
    MAILTRAP_SMTP_PORT=2525
    MAILTRAP_SMTP_USER=your_mailtrap_username
    MAILTRAP_SMTP_PASS=your_mailtrap_password

    GMAIL_USER=your_gmail_username
    GMAIL_APP_PASSWORD=your_gmail_app_password

    CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
    CLOUDINARY_API_KEY=your_cloudinary_api_key
    CLOUDINARY_API_SECRET=your_cloudinary_api_secret

    GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
    GOOGLE_CLIENT_SECRET=your_google_client_secret
    GOOGLE_CALLBACK_URL=http://localhost:8080/api/v1/auth/google/callback

    GITHUB_CLIENT_ID=your_github_client_id
    GITHUB_CLIENT_SECRET=your_github_client_secret
    GITHUB_CALLBACK_URL=http://localhost:8080/api/v1/auth/github/callback

    CLIENT_SSO_REDIRECT_URL=http://localhost:3000/user/profile
    FORGOT_PASSWORD_REDIRECT_URL=http://localhost:3000/forgot-password

    CLIENT_SSO_REDIRECT_URL=http://localhost:3000/user/profile
    FORGOT_PASSWORD_REDIRECT_URL=http://localhost:3000/forgot-password

    RAZORPAY_KEY_ID=your_razorpay_key_id
    RAZORPAY_KEY_SECRET=your_razorpay_key_secret

    PAYPAL_CLIENT_ID=your_paypal_client_id
    PAYPAL_SECRET=your_paypal_secret


    # in case like me you have used a seperate microservice to send mail
    MAIL_SERVICE_TOKEN=your_mail_service_token
    MAIL_SERVICE_URL=your_mail_service_url
    ```

4.  **Start the Server:**
    ```bash
    # Development mode (with Nodemon)
    npm run dev
    
    # Production mode
    npm start
    ```

</div>

<div id="-api-endpoints">

## 📡 API Endpoints

### Authentication (`/api/v1/auth`)
-   `POST /register`: Register a new user
-   `POST /login`: Login with email/password
-   `POST /logout`: Logout user (Protected)
-   `POST /refresh-token`: Refresh access token
-   `GET /verify-email/:verificationToken`: Verify email
-   `POST /forgot-password`: Request password reset
-   `POST /reset-password/:resetToken`: Reset password
-   `POST /change-password`: Change password (Protected)
-   `GET /current-user`: Get current user info (Protected)
-   `PATCH /avatar`: Update user avatar (Protected)
-   `GET /google`, `/github`: OAuth login
-   `GET /google/callback`, `/github/callback`: OAuth callbacks

### Code Execution (`/api/v1/execute`)
-   `POST /:problemId`: Execute code against test cases
    -   **Body**: `{ code, language }`
    -   **Response**: Array of test case results with pass/fail status, execution time, memory usage

### Problems (`/api/v1/problem`)
-   `GET /`: Get all problems (with pagination)
-   `POST /`: Create a new problem (Admin only)
    -   **Body**: Problem object with title, statement, difficulty, test cases, etc.
-   `GET /:problemId`: Get problem by ID
-   `PUT /:problemId`: Update problem (Admin only)

### Submissions (`/api/v1/submission`)
-   `POST /`: Submit code for a problem
    -   **Body**: `{ problemId, sourceCode, language }`
-   `GET /user/:userId`: Get user's submissions
-   `GET /problem/:problemId`: Get submissions for a problem

### Health Check (`/api/v1/healthcheck`)
-   `GET /`: Check server status

</div>

<div id="-contributing">

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1.  Fork the repository
2.  Create a feature branch (`git checkout -b feature/amazing-feature`)
3.  Commit your changes (`git commit -m 'Add some amazing feature'`)
4.  Push to the branch (`git push origin feature/amazing-feature`)
5.  Open a Pull Request

</div>

## 📄 License

This project is licensed under the ISC License.

---

## 🔑 Key Highlights

-   **Real-Time Code Execution**: Powered by Judge0 API for accurate code evaluation
-   **Comprehensive Problem System**: Supports examples, constraints, hints, editorials, and reference solutions
-   **Multi-Language Support**: Python, JavaScript, Java, C++
-   **Scalable Architecture**: Built with production-ready patterns and best practices
-   **Secure & Fast**: Rate limiting, JWT auth, and efficient batch processing
-   **Admin Controls**: Role-based access for problem management

Built with ❤️ by [Arush Choudhary](https://github.com/arush73)
