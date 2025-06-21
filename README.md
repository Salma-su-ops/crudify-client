# Crudify Client - React Frontend

## Features

**Core Features:**
- Product listing with responsive grid layout
- Add/Edit forms with client-side validation
- Delete operations with confirmation dialogs
- Real-time updates after CRUD operations

**Advanced Features:**
- Search functionality with case-insensitive filtering
- Loading states during API calls
- Error handling with user feedback
- Context API state management with useReducer
- Responsive design for mobile and desktop
- Modern CSS with hover effects and transitions

## Project Structure

```
src/
├── components/     # ProductList, ProductForm, Navbar
├── context/        # ProductContext with useReducer
├── services/       # API service with axios
└── App.js          # Main app with routing
```

## Available Scripts

```bash
npm start       # Development server
npm run build   # Production build
npm test        # Run tests
```

## State Management

Uses React Context API with useReducer for:
- Products list
- Loading states
- Error handling
- Selected product state

## API Integration

Axios service connects to Spring Boot backend on `http://localhost:8080/api`

# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

