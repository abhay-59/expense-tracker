# Trackwise



## Project Overview
Trackwise is a web-based financial dashboard built with React. It provides a clean and intuitive interface to help users track their income and expenses, visualize their financial health, and manage their transactions effectively.



- **Live Application**: [click here](https://trackwise-abhay-59.vercel.app/)
- for trial purposes on the live application please login with the following account : 
- email : adm@gmail.com
- password : 123456

---

## Installation Instructions
### 1. Clone the Repository
```bash
$ git clone https://github.com/abhay-59/expense-tracker
$ cd expense-tacker
```

### 2. Backend Setup
1. Navigate to the backend directory:
   ```bash
   $ cd backend
   ```
2. Install dependencies:
   ```bash
   $ npm install
   ```
3. Configure `.env` file with the following variables:
   ```env
   MONGO_URI=your uri
   JWT_SECRET=your_jwt_secret
   PORT=5000
   GEMINI_API_KEY=your_api_key
   ```
4. Start the backend server:
   ```bash
   $ npm start
   ```

### 3. Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   $ cd frontend
   ```
2. Install dependencies:
   ```bash
   $ npm install
   ```
3. Start the frontend server:
   ```bash
   $ npm start
   ```



---

## Application Running
1. Access the app at `http://localhost:3000`.
2. Register or login as a user.
3. Navigate to the dashboard to view and manage transactions.

---

## Major Features Demonstration
### Authentication
- login and logout seamlessly and new users can sign up too.
- Passwords are protected through hashing and encryption.

### Transactions
- A dedicated section to add, view, and delete income and expense transactions.
- View aggregated data for the current month.

### Visualizations
- Interactive charts to visualize income vs. expenses and expense categories, powered by chart.js.

### Dynamic Data
- The dashboard dynamically updates with every new transaction, providing real-time financial insights.

### Receipt parsing using Gemini Api
- Ai based parsing of the receipt along with auto adding feature into the list of transactions per user.

---

## Sample images

<img width="1919" height="969" alt="image" src="https://github.com/user-attachments/assets/198b095e-1b86-4356-9759-2516e5d7231d" />

<img width="1919" height="966" alt="image" src="https://github.com/user-attachments/assets/b3d5480d-3428-456c-82f6-c65c6b97d889" />

<img width="1919" height="970" alt="image" src="https://github.com/user-attachments/assets/1b1814e0-bd48-41ff-80e2-e23b01c3bf7b" />







