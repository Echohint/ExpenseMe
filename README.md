# 💰 ExpenseMe

**Master Your Finances with Elegance.**

ExpenseMe is a premium, full-stack personal finance application designed for the modern user. Track expenses, analyze spending trends, and manage your budget with a sleek, high-fidelity interface that feels as premium as your financial goals.

🔗 **[Live Demo](https://expenseme.onrender.com)**

---

## ✨ Key Features

- **🚀 Instant Dashboard**: Get a bird's-eye view of your financial health with recent transactions and quick-stats.
- **🛡️ Secure Authentication**: JWT-based login and registration with robust password encryption.
- **📊 Real-time Analytics**: Interactive Donut and Line charts (via Chart.js) visualizing your category-wise spending and monthly trends.
- **📁 Smart Management**: Categorize, filter, and sort your expense history with ease.
- **🎨 Premium UI/UX**: A dark-mode inspired, glassmorphic design that provides a seamless user experience.
- **💳 Payment Integration**: Subscription-ready with Razorpay integration for premium features.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: [React](https://reactjs.org/) (Vite)
- **Styling**: Vanilla CSS (CSS Variables & Flexbox)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Charts**: [Chart.js](https://www.chartjs.org/) & [react-chartjs-2](https://react-chartjs-2.js.org/)
- **API Client**: [Axios](https://axios-http.com/)

### Backend
- **Environment**: [Node.js](https://nodejs.org/)
- **Framework**: [Express.js](https://expressjs.com/)
- **Database**: [MongoDB](https://www.mongodb.com/) (Mongoose ODM)
- **Auth**: [JSON Web Token](https://jwt.io/) & [Bcrypt](https://github.com/kelektiv/node.bcrypt.js)
- **Payments**: [Razorpay](https://razorpay.com/)

---

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v18 or higher recommended)
- MongoDB account (Atlas cluster or local instance)

### 1. Clone the Repository
```bash
git clone https://github.com/Echohint/ExpenseMe.git
cd ExpenseMe
```

### 2. Backend Configuration
1. Navigate to the `server` directory:
   ```bash
   cd server
   ```
2. Create a `.env` file:
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   RAZORPAY_KEY_ID=your_razorpay_id
   RAZORPAY_KEY_SECRET=your_razorpay_secret
   ```
3. Install dependencies and start:
   ```bash
   npm install
   npm run dev
   ```

### 3. Frontend Configuration
1. Open a new terminal and navigate to the `client` directory:
   ```bash
   cd client
   ```
2. Install dependencies and start:
   ```bash
   npm install
   npm run dev
   ```
3. Access the app at `http://localhost:5173`.

---

## 📂 Project Structure

```text
ExpenseMe/
├── client/                 # React (Vite) application
│   ├── src/
│   │   ├── components/     # Reusable UI Blocks (Sidebar, Charts, Forms)
│   │   ├── pages/          # Layout-level pages (Dashboard, History, Analytics)
│   │   └── index.css       # Global design tokens and styling
├── server/                 # Node.js Express server
│   ├── models/             # Mongoose schemas
│   ├── routes/             # RESTful API endpoints
│   └── index.js            # Server entry points
└── README.md
```

---



*Built with ❤️ by [Echohint](https://github.com/Echohint)*
