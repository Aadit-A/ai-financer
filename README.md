# AI Finance Advisor

A comprehensive personal finance management application with **AI-powered expense analysis** using Google's Gemini API. Track your income, expenses, savings goals, and get intelligent insights on your spending habits.

## 🌟 Key Features

### 🤖 AI-Powered Expense Analysis
- **Smart Classification**: AI analyzes each expense and classifies it as "Necessary" or "Unnecessary"
- **Context-Aware**: Provide optional context for more accurate AI analysis
- **Real-time Analysis**: Instant feedback using Google's Gemini 1.5 Flash model
- **Visual Indicators**: Color-coded badges (Green = Necessary, Red = Unnecessary)

### 💰 Financial Management
- **Transaction Tracking**: Add income and expenses with categories
- **Savings Goals**: Create and track multiple savings goals with templates
  - 8 pre-built templates (Car, House, Vacation, Emergency Fund, etc.)
  - Progress visualization with percentage completion
  - Deadline tracking with days remaining
  - Direct transaction-to-goal linking
- **Real-time Calculations**: Automatic balance, income, and expense totals
- **Smart Savings Tracker**: Track unlinked savings (income not allocated to goals minus expenses)

### 📊 Dashboard & Analytics
- **Quick Stats**: Total transactions, average expense, highest expense
- **Category Spending**: Top 5 spending categories with visual bars
- **Filtering & Search**: Filter by type, category, date range, and search terms
- **Sorting Options**: Sort by date or amount (ascending/descending)
- **Undo Delete**: Restore accidentally deleted transactions

### 🎨 User Experience
- **Dark/Light Mode**: Toggle between themes with smooth transitions
- **Responsive Design**: Works seamlessly on desktop and mobile
- **Quick Templates**: Pre-filled transaction templates for common expenses
- **Sidebar Menu**: Easy access to export/import and statistics
- **Local Storage**: All data persists across sessions

## Project Structure

```
ai-financer/
├── frontend/          # React.js application
│   ├── src/
│   │   ├── components/
│   │   │   ├── Dashboard.jsx          # Main dashboard with AI integration
│   │   │   ├── Dashboard.css          # Dashboard styling
│   │   │   ├── IncomeExpenseForm.jsx  # Transaction form with context
│   │   │   ├── IncomeExpenseForm.css  # Form styling
│   │   │   ├── Login.jsx              # Authentication interface
│   │   │   └── Login.css              # Login styling
│   │   ├── App.jsx                    # Main app component
│   │   └── main.jsx                   # App entry point
│   └── package.json
└── backend/           # API server (planned for future phases)
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

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Google Gemini API key (included in the app)

### Installation & Setup

1. Clone the repository:
```bash
git clone https://github.com/Aadit-A/ai-financer.git
cd ai-financer
```

2. Navigate to the frontend directory:
```bash
cd frontend
```

3. Install dependencies:
```bash
npm install
```

4. Start the development server:
```bash
npm run dev
```

5. Open your browser and go to `http://localhost:5173`

### Demo Usage
1. **Login**: Enter any username and password to access the dashboard
2. **Add Income**: Use the form to add income transactions
3. **Add Expenses**: Add expenses and let AI analyze them
   - Basic expenses: Leave context as "Not Applicable"
   - Complex expenses: Select "Provide Custom Context" for better AI analysis
4. **Create Savings Goals**: Use templates or create custom goals
5. **Link Transactions to Goals**: Allocate income directly to specific savings goals
6. **Track Progress**: Monitor your savings goals and unlinked savings
7. **Toggle Theme**: Switch between dark and light modes
8. **Export Data**: Save your financial data as JSON or CSV

## 📸 Features in Detail

### AI Expense Analysis
When you add an expense, the AI:
1. Analyzes the description, category, and amount
2. Considers any custom context you provide
3. Classifies it as "Necessary" or "Unnecessary"
4. Displays a color-coded badge on the transaction

**Example Classifications:**
- ✅ Groceries, Rent, Healthcare → **Necessary**
- ❌ Movie tickets, Designer clothes, Luxury items → **Unnecessary**
- 🔄 Context matters: "Expensive dinner for client meeting" → **Necessary**

### Savings Goals System
- **8 Pre-built Templates**: Car, House, Vacation, Emergency Fund, Wedding, Education, Business, Home Renovation
- **Custom Goals**: Create your own with name, amount, deadline, and description
- **Progress Tracking**: Visual progress bars with percentage and remaining amount
- **Direct Linking**: Link income transactions directly to goals (full amount allocation)
- **Goal Statistics**: Track current amount, target, completion percentage, and days remaining

### Transaction Management
- **Quick Templates**: One-click templates for common transactions
- **Categories**: 
  - Income: Salary, Freelance, Business, Investment, Other
  - Expenses: Food, Transportation, Housing, Entertainment, Healthcare, Shopping, Other
- **Goal Linking**: Optionally link transactions to savings goals
- **AI Context**: Add context for expenses to improve AI classification
- **Edit & Delete**: Modify or remove transactions with undo option

### Filtering & Sorting
- Filter by transaction type (Income/Expense/All)
- Filter by category
- Filter by date (Today, This Week, This Month, This Year, All Time)
- Search by description or category
- Sort by date or amount (ascending/descending)

### Data Management
- **Local Storage**: All data saved automatically in browser
- **Export**: Download data as JSON or CSV
- **Import**: Upload JSON files to restore data
- **Clear All**: Option to reset all data

## 💻 Technology Stack

### Frontend
- **React 19.1.1** - Modern UI framework with hooks
- **Vite 7.1.4** - Lightning-fast build tool and dev server
- **Google Gemini API** - AI-powered expense analysis
- **CSS3** - Custom styling with CSS variables for theming
- **LocalStorage API** - Client-side data persistence

### AI Integration
- **Gemini 2.5 Flash** - Fast, efficient AI model
- **Async/Await** - Modern promise handling
- **Error Handling** - Graceful fallbacks for API failures
- **Context-Aware Prompts** - Enhanced AI accuracy with user context

### Development Tools
- Hot Module Replacement (HMR)
- Modern ES6+ JavaScript
- Component-based architecture
- Responsive CSS Grid and Flexbox
- ESLint for code quality

## 🎨 Theme System
- **Dark Mode**: Default theme with purple accents
- **Light Mode**: Clean, bright interface
- **Smooth Transitions**: Animated theme switching
- **CSS Variables**: Easy customization and maintenance
- **Persistent Preference**: Theme choice saved in localStorage

## 📊 Current Status

### ✅ Completed Features
- ✅ AI-powered expense analysis with Gemini API
- ✅ Context-aware expense classification
- ✅ Multiple savings goals with templates
- ✅ Transaction-to-goal linking
- ✅ Unlinked savings tracker
- ✅ Dark/Light theme toggle
- ✅ Advanced filtering and sorting
- ✅ Data export (JSON/CSV) and import
- ✅ Undo delete functionality
- ✅ Category spending analytics
- ✅ Responsive design
- ✅ Local storage persistence

### 🔄 In Progress
- User authentication system
- Cloud data synchronization
- Advanced analytics and charts

### 📅 Planned Features
- Backend API integration
- Multi-user support
- Budget planning and alerts
- Recurring transactions
- Receipt scanning
- Financial reports and insights
- Mobile app (React Native)

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/Aadit-A/ai-financer/issues).

### How to Contribute
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is for educational purposes.

## 👤 Author

**Aadit**
- GitHub: [@Aadit-A](https://github.com/Aadit-A)
- Repository: [ai-financer](https://github.com/Aadit-A/ai-financer)

**AARUSH**
- Github: https://github.com/aarushc8504
- Repository: [ai-financer](https://github.com/Aadit-A/ai-financer)

## 🙏 Acknowledgments

- Google Gemini API for AI capabilities
- React team for the amazing framework
- Vite team for the blazing-fast build tool