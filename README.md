# AI Finance Advisor

A comprehensive personal finance management application with AI-powered insights and recommendations.

## Project Structure

```
ai-financer/
├── frontend/          # React.js application
└── backend/           # API server (planned for Phase 2)
```

## Phase 1 - MVP Features ✅

### Completed Features
- **Login Page**: Simple username/password form (no authentication logic yet)
- **Dashboard**: Overview of financial data with:
  - Income, Expenses, and Current Balance cards
  - Savings Goal with progress tracking
  - Recent transactions list
- **Add Transactions**: Form to add income and expenses with categories
- **Local State Management**: All data stored temporarily in React state

### Key Components
- `Login.jsx` - User authentication interface
- `Dashboard.jsx` - Main financial overview
- `IncomeExpenseForm.jsx` - Transaction input form

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation & Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and go to `http://localhost:5173`

### Demo Usage
1. Enter any username and password to login
2. View the dashboard with financial overview
3. Add income or expenses using the form
4. Track progress towards your savings goal
5. View recent transactions

## Features Overview

### Login System
- Simple form with username/password fields
- No authentication logic (Phase 1)
- Redirects to dashboard on any valid input

### Dashboard
- **Income Tracking**: View total income with green indicators
- **Expense Tracking**: Monitor spending with red indicators  
- **Balance Calculation**: Automatic calculation of current balance
- **Savings Goal**: Set and track progress towards financial goals
- **Transaction History**: View recent income and expense entries

### Transaction Management
- Add income with categories (Salary, Freelance, Business, etc.)
- Add expenses with categories (Food, Transportation, Housing, etc.)
- Real-time balance updates
- Form validation for required fields

## Technology Stack

### Frontend
- **React 19.1.1** - UI framework
- **Vite** - Build tool and dev server
- **CSS3** - Styling and responsive design
- **ESLint** - Code linting

### Development Tools
- Hot Module Replacement (HMR)
- Modern ES6+ JavaScript
- Component-based architecture
- Responsive CSS Grid and Flexbox

## Future Phases

### Phase 2 (Planned)
- Backend API with authentication
- Database integration
- Data persistence
- User registration

### Phase 3 (Planned)
- AI-powered financial insights
- Spending analytics
- Budget recommendations
- Data visualization charts

## Contributing

This is a learning project. Feel free to suggest improvements or report issues.

## License

This project is for educational purposes.
