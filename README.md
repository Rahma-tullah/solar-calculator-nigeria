# Solar Calculator - Nigeria

A comprehensive solar energy calculator web application designed for the Nigerian market. Helps users estimate solar system requirements, costs, and connect with verified installers across Nigeria.

## 🌟 Features

### For Customers

- **AI-Powered Calculator**: Analyze equipment lists and calculate precise power requirements
- **Cost Estimation**: Get detailed cost breakdowns with realistic Nigerian market pricing
- **Financial Planning**: Compare installment plans vs grid+fuel costs
- **Installer Directory**: Find and connect with verified solar installers by location
- **Calculation History**: Save and review past calculations (requires login)
- **Lead Submission**: Submit inquiries directly to installers
- **AI Chatbot**: Get instant answers about solar energy in Nigeria

### For Installers

- **Business Accounts**: Create professional installer profiles
- **Lead Management**: Receive and manage customer inquiries
- **Profile Visibility**: Get discovered by potential customers in your area

### Technical Features

- JWT-based authentication
- AI integration (Google Gemini) for equipment analysis and chatbot
- Email notifications via Nodemailer
- Secure password hashing with bcrypt
- Role-based access control
- RESTful API architecture

## 🛠️ Tech Stack

### Backend

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MySQL
- **Authentication**: JSON Web Tokens (JWT)
- **Password Security**: bcryptjs
- **AI Integration**: Google Generative AI (Gemini)
- **Email**: Nodemailer

### Frontend

- **HTML5**
- **CSS3** (custom styling)
- **Vanilla JavaScript**
- **Responsive Design**

## 📋 Prerequisites

Before you begin, ensure you have:

- Node.js (v14 or higher)
- MySQL (v5.7 or higher)
- Google AI API key (from Google AI Studio)
- Gmail account with App Password (for email functionality)

## 🚀 Installation

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd solcal
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env` file in the root directory:

```env
# Server
PORT=5000

# Database
DB_HOST=localhost
DB_USER=your_mysql_username
DB_PASSWORD=your_mysql_password
DB_NAME=solcal_db

# JWT
JWT_SECRET=your_super_secret_key_here_make_it_long_and_random
JWT_EXPIRES_IN=1d

# Email (Gmail)
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASSWORD=your_16_character_app_password

# Google AI
GOOGLE_AI_API_KEY=your_google_ai_api_key
```

### 4. Set up the database

Create the database and tables:

```sql
CREATE DATABASE solcal_db;
USE solcal_db;
```

Run the SQL scripts in `database/` folder (or see DATABASE_SCHEMA.md for complete schema).

### 5. Start the server

```bash
node server.js
```

Server will run on `http://localhost:5000`

### 6. Open the frontend

Navigate to `frontend/index.html` in your browser, or serve it with a local server.

## 📁 Project Structure

```
solcal/
├── config/
│   └── database.js          # Database connection
├── controllers/
│   ├── auth.js              # Authentication logic
│   ├── calculations.js      # Calculator logic
│   ├── chatbot.js           # Chatbot logic
│   ├── emails.js            # Email sending logic
│   └── leads.js             # Lead management
├── middleware/
│   └── auth.js              # JWT verification middleware
├── models/
│   ├── calculations.js      # Calculations database queries
│   ├── emails.js            # Email tracking queries
│   ├── installers.js        # Installer queries
│   ├── leads.js             # Lead queries
│   └── users.js             # User queries
├── routes/
│   ├── auth.js              # Authentication routes
│   ├── calculations.js      # Calculator routes
│   ├── chatbot.js           # Chatbot routes
│   ├── emails.js            # Email routes
│   ├── installers.js        # Installer routes
│   └── leads.js             # Lead routes
├── services/
│   ├── aiService.js         # Google AI integration
│   ├── chatbotService.js    # Chatbot AI service
│   └── emailService.js      # Email sending service
├── utils/
│   └── calculatorUtils.js   # Calculator formulas & pricing
├── frontend/
│   ├── css/
│   │   └── styles.css       # Frontend styling
│   ├── js/
│   │   └── app.js           # Frontend logic
│   └── index.html           # Main HTML file
├── .env                      # Environment variables (not in git)
├── .gitignore
├── package.json
├── server.js                 # Main server file
└── README.md
```

## 💰 Pricing Information

The calculator uses realistic Nigerian market pricing (2025):

- **Base system cost**: ₦950,000 per kW
- **Hybrid systems**: 50% premium (for battery backup)
- **Installment financing**: 24 months with 15% total interest
- **Safety factor**: 25% buffer on power calculations

Pricing is configurable in `utils/calculatorUtils.js`

## 🔐 Security

- Passwords hashed with bcrypt (10 salt rounds)
- JWT tokens for stateless authentication
- SQL injection prevention via parameterized queries
- CORS enabled for frontend-backend communication
- Environment variables for sensitive data

Quick overview:

- `POST /api/auth/signup` - User signup
- `POST /api/auth/login` - User login
- `POST /api/calculations` - Create calculation
- `GET /api/installers` - Get installers
- `POST /api/leads` - Submit lead
- `POST /api/chat` - Chatbot interaction

## 👤 Author

Your Name

- GitHub: [@Rahma_haasan](https://github.com/Rahma-tullah)
- Email: onyiozahm90@gmail.com

## 🙏 Acknowledgments

- Google AI for Gemini API
- Nigerian solar installers for market pricing data
- Open source community

Built with ☀️ for a sustainable Nigeria
