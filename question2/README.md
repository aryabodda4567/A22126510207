# Social Media Analytics Microservice

This microservice provides real-time analytics for social media data, including top users and posts.

## Features

- Get top 5 users with the highest number of posts
- Get latest 5 posts
- Get most popular posts (posts with maximum comments)

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
- Copy `.env.example` to `.env`
- Update `SOCIAL_MEDIA_API_URL` with your social media platform API URL

3. Start the server:
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

## API Endpoints

### Get Top Users
```
GET /users
```
Returns the top 5 users with the highest number of posts.

### Get Posts
```
GET /posts?type=latest
GET /posts?type=popular
```
- `type=latest`: Returns the 5 most recent posts
- `type=popular`: Returns posts with the maximum number of comments

## Data Updates

The service automatically updates its data every 5 minutes to ensure real-time insights. 