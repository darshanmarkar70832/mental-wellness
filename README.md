# MindfulAI - AI-Powered Mental Wellness Platform

An AI-powered therapy and mental wellness platform with a pay-per-use model. The application uses HuggingFace's inference API (DialoGPT-large model) for AI responses and Cashfree for payment processing.

## Summary

MindfulAI provides users with access to AI-powered mental wellness therapy sessions through a modern, responsive, dark-themed interface. The application implements a pay-per-minute usage model, allowing users to purchase session time and engage in therapeutic conversations with an AI assistant.

### Key Benefits

- **Zero Building Costs**: Built using free-tier services only
- **Revenue Generation**: Monetization through Cashfree payment gateway
- **Professional UI**: Modern dark-themed interface with glass card UI components
- **Responsive Design**: Works seamlessly on mobile, tablet, and desktop devices

## Features

- Modern dark UI with responsive design
- User authentication system
- AI-powered chat therapy using HuggingFace's inference API
- Pay-per-minute usage model
- Session history and analytics
- Secure payment processing with Cashfree

## Tech Stack

- Frontend: React, TailwindCSS, shadcn/ui
- Backend: Express.js
- Authentication: Passport.js with session-based auth
- AI: HuggingFace inference API with DialoGPT-large model
- Payment: Cashfree Payment Gateway

## External Services

### HuggingFace API

The application uses HuggingFace's inference API with the DialoGPT-large model for generating AI responses. This model is free to use, and you need to obtain an API key from HuggingFace:

1. Sign up for a free account at [HuggingFace](https://huggingface.co/join)
2. Generate an API key in your HuggingFace account settings
3. Add the API key to your environment variables as `HUGGINGFACE_API_KEY`

### Cashfree Payment Gateway

For payment processing, the application uses the Cashfree payment gateway:

1. Register for a Cashfree account at [Cashfree](https://www.cashfree.com/)
2. Get your App ID and Secret Key from the dashboard
3. Add these credentials to your environment variables:
   - `CASHFREE_APP_ID`
   - `CASHFREE_SECRET_KEY`
   - `CASHFREE_API_VERSION` (set to `2022-09-01`)

## Deployment Instructions for Render

1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Choose the branch to deploy
4. Configure the following settings:
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Environment**: Node.js
   - **Node Version**: 18 or higher

5. Add the following environment variables in the Render dashboard:
   - `SESSION_SECRET`: A random string for session encryption
   - `HUGGINGFACE_API_KEY`: Your HuggingFace API key
   - `NODE_ENV`: Set to "production"
   - (If using Cashfree in production) Add your Cashfree API credentials:
     - `CASHFREE_APP_ID`
     - `CASHFREE_SECRET_KEY`
     - `CASHFREE_API_VERSION`

6. Click "Create Web Service"

## Database Considerations

### Current Implementation

The application currently uses in-memory storage (`MemStorage` in `server/storage.ts`), which means:
- All data (users, payments, conversations, messages) will be lost when the server restarts
- Not suitable for production deployment without modifications

### Recommendation for Production

For a production environment, it's highly recommended to implement a persistent database solution:

1. Use Render's PostgreSQL database service (available on free tier)
2. Modify the storage implementation to use the PostgreSQL database
3. Update the relevant environment variables in the Render dashboard

Example implementation steps:
1. Update the database connection in `server/storage.ts` to use the `@neondatabase/serverless` package
2. Implement the `IStorage` interface with PostgreSQL queries
3. Update the session store to use `connect-pg-simple`

## Local Development

1. Install dependencies: `npm install`
2. Start the development server: `npm run dev`
3. The application will be available at http://localhost:5000

## Current Limitations and Future Improvements

### Limitations

1. **In-Memory Storage**: The current implementation uses in-memory storage, which is reset when the server restarts.
2. **AI Response Quality**: The DialoGPT-large model provides basic conversational responses but may not have the therapeutic quality of more advanced models.
3. **Session Management**: Sessions are not properly persisted across server restarts.

### Future Improvements

1. **Database Implementation**: Replace in-memory storage with a PostgreSQL database for persistent data storage.
2. **Enhanced AI Responses**: Improve the AI response generation with better prompting or a more specialized model.
3. **Admin Dashboard**: Create a more comprehensive admin interface for monitoring user activity and payments.
4. **Security Enhancements**: Implement additional security measures like rate limiting and input sanitization.
5. **Error Handling**: Improve error handling and user feedback throughout the application.