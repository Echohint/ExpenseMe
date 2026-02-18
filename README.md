# ExpenseMe

**ExpenseMe** is a powerful, full-stack expense tracking application designed to help you monitor your spending, visualize financial data, and gain insights using AI. Built with the MERN stack, it offers a seamless user experience with secure authentication and payment integration.

## Live Demo

[Insert Live Application Link Here]

## Features

-   **Expense Tracking:** Easily add, edit, and delete expense records.
-   **Dashboard Analytics:** Visualize spending habits with interactive charts using Chart.js.
-   **AI Insights:** Get personalized financial advice powered by Google Gemini AI.
-   **Secure Authentication:** User registration and login protected by JWT and bcrypt.
-   **Premium Subscriptions:** Unlock advanced features via Razorpay integration.
-   **Data Export:** Download transaction history as CSV/JSON (Premium feature).

## Tech Stack

This project uses the following technologies:

### Frontend
-   **React** (with Vite for fast development)
-   **CSS** (Custom styling and responsive design)
-   **Chart.js / react-chartjs-2** (Data visualization)
-   **Lucide React** (Icons)
-   **Axios** (API requests)

### Backend
-   **Node.js & Express.js** (Server framework)
-   **MongoDB & Mongoose** (Database)
-   **JSON Web Tokens (JWT)** (Authentication)
-   **Google Generative AI** (AI functionality)
-   **Razorpay** (Payment processing)
-   **Multer** (File handling)

## Prerequisites

Before running this project locally, ensure you have the following installed:

-   [Node.js](https://nodejs.org/) (v14 or higher recommended)
-   [MongoDB](https://www.mongodb.com/try/download/community) (Local instance or Atlas URI)
-   Git

## Getting Started

Follow these steps to set up the project locally.

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/expense-me.git
cd EXPENSEME
```

### 2. Backend Setup

Navigate to the server directory and install dependencies:

```bash
cd ExpenseMe/server
npm install
```

**Configuration:**

Create a `.env` file in the `ExpenseMe/server` directory and add the following variables:

```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/expenseme?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key
GEMINI_API_KEY=your_google_gemini_api_key
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

> **Note:** You can obtain API keys from:
> -   **Google Gemini AI:** [Google AI Studio](https://aistudio.google.com/)
> -   **Razorpay:** [Razorpay Dashboard](https://dashboard.razorpay.com/)

### 3. Frontend Setup

Navigate to the client directory and install dependencies:

```bash
cd ../client
npm install
```

**Configuration:**

Create a `.env` file in the `ExpenseMe/client` directory to store public keys:

```env
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
```

> **Important:** The `VITE_RAZORPAY_KEY_ID` in the client `.env` must match the `RAZORPAY_KEY_ID` in the server `.env`.

## Running the Application

You need to run both the backend and frontend servers.

### Start the Backend Server

From the `ExpenseMe/server` directory:

```bash
npm run dev
```

You should see output indicating the server is running on port 5000 and connected to MongoDB.

### Start the Frontend Client

Open a new terminal, navigate to `ExpenseMe/client`, and run:

```bash
npm run dev
```

The terminal will display the local URL (usually `http://localhost:5173`). Open this link in your browser to view the application.

## Troubleshooting

-   **MongoDB Connection Error:** Ensure your IP address is whitelisted in MongoDB Atlas if you are using a cloud database.
-   **API Errors:** Check if the backend server is running on the correct port and that the frontend is proxying requests correctly (or CORS is configured).
-   **Razorpay Modal Issues:** Verify that the correct Key ID is provided in the client environment variables.

## License

This project is licensed under the ISC License.
