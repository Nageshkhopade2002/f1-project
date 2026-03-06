# Bugfix Requirements Document

## Introduction

The F1 project deployment is failing in production due to frontend-backend connection issues. The frontend (Vercel) cannot communicate with the backend (Railway) due to three critical problems:

1. Build failure: `API_BASE_URL` is exported as default but imported as named export, causing Vite build to fail
2. Hardcoded URLs: 20+ frontend files contain hardcoded `localhost:8080` URLs instead of using the centralized API configuration
3. Media file access: Images and videos return 403 Forbidden errors due to Railway's ephemeral filesystem

These issues prevent the application from functioning in production, blocking all API communication and media display.

## Bug Analysis

### Current Behavior (Defect)

1.1 WHEN the frontend build process runs on Vercel THEN the build fails with error "API_BASE_URL is not exported by src/config/api.js" because the config file uses `export default` but components import it as a named export `{ API_BASE_URL }`

1.2 WHEN the application runs in production THEN API requests fail because 20+ files (TicketList.jsx, BookTicket.jsx, MyBookings.jsx, AdminTickets.jsx, TeamsPage.jsx, TeamDetails.jsx, DriversPage.jsx, DriverProfile.jsx, Schedule2026.jsx, RaceDetails.jsx, NewsPage.jsx, NewsDetails.jsx, ManageNews.jsx, ManageDrivers.jsx, ManageCircuits.jsx, NextEvent.jsx, NewsWidget.jsx) contain hardcoded `http://localhost:8080` URLs that don't resolve to the Railway backend

1.3 WHEN the application attempts to display images or videos from the uploads folder THEN the browser receives 403 Forbidden errors because Railway's ephemeral filesystem doesn't persist the uploads directory between deployments

1.4 WHEN components construct image URLs using string concatenation with localhost THEN production deployments show broken images because the URLs point to `http://localhost:8080/uploads/...` instead of the Railway backend URL

### Expected Behavior (Correct)

2.1 WHEN the frontend build process runs on Vercel THEN the build SHALL succeed because api.js exports API_BASE_URL as both default and named export, allowing both import styles to work

2.2 WHEN the application runs in production THEN all API requests SHALL use the centralized API_BASE_URL configuration from api.js (which reads from VITE_API_BASE_URL environment variable) instead of hardcoded localhost URLs

2.3 WHEN the application attempts to display images or videos THEN the media SHALL load successfully because the backend serves files from a persistent storage solution (cloud storage or database) rather than the ephemeral filesystem

2.4 WHEN components construct image URLs THEN they SHALL use the centralized API_BASE_URL configuration to build correct production URLs pointing to the Railway backend

### Unchanged Behavior (Regression Prevention)

3.1 WHEN the application runs in local development mode THEN it SHALL CONTINUE TO use `http://localhost:8080/api` as the API base URL via the .env file

3.2 WHEN authenticated API requests are made THEN they SHALL CONTINUE TO include the JWT token in the Authorization header

3.3 WHEN the backend receives requests from allowed origins THEN it SHALL CONTINUE TO accept them via the existing CORS configuration

3.4 WHEN users interact with features like ticket booking, news viewing, team browsing, and driver profiles THEN these features SHALL CONTINUE TO function correctly with the same business logic

3.5 WHEN admin users access admin-only endpoints THEN authentication and authorization SHALL CONTINUE TO work as configured in SecurityConfig.java
