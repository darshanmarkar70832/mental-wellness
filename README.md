# Mental Wellness AI Chat

A pay-per-use therapy web application with AI chat capabilities using Hugging Face's inference API.

## Features

- Modern dark UI with glass card components
- User authentication system
- Pay-per-use model with Cashfree payment integration
- AI therapy chat using Hugging Face's DialoGPT-large model
- PostgreSQL database for data persistence

## Tech Stack

- **Frontend**: React, Tailwind CSS, shadcn/ui, TanStack Query
- **Backend**: Express.js, Passport.js for authentication
- **Database**: PostgreSQL with Drizzle ORM
- **AI**: Hugging Face Inference API (DialoGPT-large)
- **Payments**: Cashfree Payment Gateway

## Deployment

This application is configured for deployment on Render with a free PostgreSQL database.

### Environment Variables

- `DATABASE_URL`: PostgreSQL connection string
- `HUGGINGFACE_API_KEY`: API key for Hugging Face inference
- `SESSION_SECRET`: Secret for session management
- `CASHFREE_APP_ID`: Cashfree application ID
- `CASHFREE_SECRET_KEY`: Cashfree secret key
- `CASHFREE_API_BASE`: Cashfree API base URL

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run database migrations
npm run db:push
```