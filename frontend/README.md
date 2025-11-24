# AI Finance Advisor

This project is a personal finance management application designed to help users track their income and expenses, manage savings goals, and gain insights into their spending habits through AI-powered analysis.

## Aim of the Project

The primary goal of this application is to provide users with a smart and intuitive tool for managing their personal finances. By leveraging AI, it aims to offer more than just simple transaction tracking, providing automated classification of expenses to help users understand their spending patterns and make more informed financial decisions.

## What it Does

### Financial Management
- **Track Transactions:** Users can add income and expense transactions, assigning categories to each.
- **Manage Savings Goals:** The application allows users to create and monitor multiple savings goals. It provides templates for common goals (like saving for a car or a house) and visualizes progress.
- **Real-time Overview:** The dashboard displays the user's current balance, total income, and total expenses.

### AI-Powered Expense Analysis
- **Smart Classification:** An AI model analyzes each expense and categorizes it as "Necessary" or "Unnecessary". This helps users identify where their money is going.
- **Contextual Analysis:** Users can provide additional context for an expense to improve the accuracy of the AI's classification.

### Dashboard and Analytics
- **Financial Snapshot:** The dashboard presents key statistics, such as total transactions and top spending categories.
- **Data Filtering and Sorting:** Users can filter transactions by type, category, or date, and sort them by date or amount.

## How to Download and Run This Project

### Prerequisites
- **Node.js** (v14 or higher) - [Download here](https://nodejs.org/)
- **Git** - [Download here](https://git-scm.com/)
- **Google Gemini API Key** - [Get your free API key](https://aistudio.google.com/app/apikey)

### Step 1: Clone the Repository
Open your terminal or command prompt and run:
```bash
git clone https://github.com/Aadit-A/ai-financer.git
cd ai-financer
```

### Step 2: Install Dependencies
Navigate to the frontend folder and install the required packages:
```bash
cd frontend
npm install
```

### Step 3: Set Up Your API Key
1. In the `frontend` folder, create a new file named `.env`
2. Open the `.env` file and add your Google Gemini API key:
```
VITE_GEMINI_API_KEY=your_api_key_here
```
Replace `your_api_key_here` with your actual API key from Google AI Studio.

**Important:** Never share your `.env` file or commit it to GitHub!

### Step 4: Run the Application
Start the development server:
```bash
npm run dev
```

The application will open in your browser at `http://localhost:5173` (or another port if 5173 is busy).

### Step 5: Start Using the App
- Create an account or log in
- Add your income and expenses
- Set savings goals
- Get AI-powered insights on your spending!

## Troubleshooting

**Issue:** API key not working
- Make sure your `.env` file is in the `frontend` folder
- Verify the variable name is exactly `VITE_GEMINI_API_KEY`
- Restart the development server after creating the `.env` file

**Issue:** Dependencies won't install
- Try deleting `node_modules` folder and `package-lock.json`, then run `npm install` again
- Make sure you're using Node.js v14 or higher

## Notes
- This application stores data in your browser's local storage
- Your API key is only used locally and never sent to any server except Google's Gemini API