# Exegesis Backend API Documentation

## Overview
This is the Node.js/Express version of the bible-pab-backend (Java Spring Boot). All tables from the original backend have been migrated to Prisma schema with PostgreSQL.

## Base URL
```
http://localhost:5001
```

## Authentication
Most endpoints require a JWT token. Include in request header:
```
Authorization: Bearer <token>
```

## Response Format
All responses follow this structure:
```json
{
  "status": 200,
  "message": "Success message",
  "data": { ... }
}
```

---

## AUTH ENDPOINTS

### POST /auth/register
Register a new user.

**Body:**
```json
{
  "username": "string",
  "email": "string",
  "firstName": "string",
  "lastName": "string",
  "phoneNumber": "string",
  "dateOfBirth": "YYYY-MM-DD",
  "gender": "string",
  "userRole": 2
}
```

### POST /auth/verify-account
Verify email with code.

**Body:**
```json
{
  "email": "string",
  "code": "string"
}
```

### POST /auth/verify-code
Verify code without updating user.

**Body:**
```json
{
  "email": "string",
  "code": "string"
}
```

### POST /auth/login
Login with username/email and password.

**Body:**
```json
{
  "username": "string",
  "password": "string"
}
```

### POST /auth/refresh
Refresh JWT token.

**Headers:** Requires authentication

### POST /auth/logout
Logout and invalidate session.

**Headers:** Requires authentication

### POST /auth/get-current-user
Get current user details.

**Headers:** Requires authentication

### POST /auth/update-current-user
Update current user profile.

**Headers:** Requires authentication
**Body:** (any fields to update)
```json
{
  "firstName": "string",
  "lastName": "string",
  "middleName": "string",
  "dateOfBirth": "YYYY-MM-DD",
  "gender": "string",
  "maritalStatus": "string",
  "email": "string",
  "phoneNumber": "string",
  "alternativePhone": "string",
  "ministryGroup": "string",
  "servicePosition": "string",
  "spiritualGifts": "string",
  "emergencyContactName": "string",
  "emergencyContactPhone": "string",
  "emergencyContactRelationship": "string",
  "profilePhotoUrl": "string"
}
```

### POST /auth/resend-verification
Resend verification code to email.

**Body:**
```json
{
  "email": "string"
}
```

### POST /auth/set-password
Set/reset password for user.

**Body:**
```json
{
  "email": "string",
  "password": "string"
}
```

### GET /auth/test
Test server connection.

---

## ADMIN ENDPOINTS

### POST /admin/get-users-by-admin
Get all users with pagination (Admin only).

**Headers:** Requires admin authentication
**Body:**
```json
{
  "search": "string",
  "userId": "string",
  "page": 1,
  "pageSize": 10
}
```

### POST /admin/update-user
Update user by username (Admin only).

**Headers:** Requires admin authentication
**Body:**
```json
{
  "username": "string",
  "firstName": "string",
  "lastName": "string",
  "middleName": "string",
  "gender": "string",
  "maritalStatus": "string",
  "phoneNumber": "string",
  "email": "string",
  "roleName": "admin|member",
  "roleId": 1,
  "status": true
}
```

### POST /admin/delete-user
Delete user and all associated data (Admin only).

**Headers:** Requires admin authentication
**Body:**
```json
{
  "username": "string"
}
```

### POST /admin/toggle-user-status
Toggle user active status (Admin only).

**Headers:** Requires admin authentication
**Body:**
```json
{
  "username": "string",
  "status": true
}
```

### POST /admin/toggle-user-verification
Toggle user email verification (Admin only).

**Headers:** Requires admin authentication
**Body:**
```json
{
  "username": "string",
  "isVerified": true
}
```

### POST /admin/get-admin-dashboard-stats
Get dashboard statistics (Admin only).

**Headers:** Requires admin authentication

### POST /admin/get-user-activity
Get user activity logs (Admin only).

**Headers:** Requires admin authentication
**Body:**
```json
{
  "username": "string",
  "page": 1,
  "pageSize": 10
}
```

### POST /admin/get-all-activity
Get all activity logs (Admin only).

**Headers:** Requires admin authentication
**Body:**
```json
{
  "page": 1,
  "pageSize": 20
}
```

### POST /admin/delete-activity
Delete activity record (Admin only).

**Headers:** Requires admin authentication
**Body:**
```json
{
  "activityId": "number"
}
```

### POST /admin/add-daily-verse
Add daily verse (Admin only).

**Headers:** Requires admin authentication
**Body:**
```json
{
  "bookName": "string",
  "chapter": 1,
  "verseNumber": 1,
  "displayDate": "YYYY-MM-DD",
  "displayTime": "HH:MM:SS",
  "reflection": "string"
}
```

### POST /admin/get-all-daily-verses
Get all daily verses (Admin only).

**Headers:** Requires admin authentication

### POST /admin/delete-daily-verse
Delete daily verse (Admin only).

**Headers:** Requires admin authentication
**Body:**
```json
{
  "verseId": "number"
}
```

---

## BIBLE ENDPOINTS

### POST /bible/add-highlight
Add highlight to verse.

**Headers:** Requires authentication
**Body:**
```json
{
  "bookName": "string",
  "chapter": 1,
  "verseNumber": 1,
  "colorId": 1,
  "note": "string"
}
```

### POST /bible/get-highlights
Get user highlights.

**Headers:** Requires authentication
**Body:**
```json
{
  "bookName": "string",
  "chapter": 1,
  "verseNumber": 1,
  "colorId": 1,
  "page": 1,
  "pageSize": 20
}
```

### POST /bible/delete-highlight
Delete highlight.

**Headers:** Requires authentication
**Body:**
```json
{
  "highlightId": "number"
}
```

### POST /bible/add-read-history
Add to read history.

**Headers:** Requires authentication
**Body:**
```json
{
  "bookName": "string",
  "chapter": 1,
  "verseNumber": 1
}
```

### POST /bible/get-read-history
Get read history.

**Headers:** Requires authentication
**Body:**
```json
{
  "bookName": "string",
  "chapter": 1,
  "page": 1,
  "pageSize": 20
}
```

### POST /bible/delete-read-history
Delete read history entry.

**Headers:** Requires authentication
**Body:**
```json
{
  "historyId": "number"
}
```

### POST /bible/add-favorite
Add verse to favorites.

**Headers:** Requires authentication
**Body:**
```json
{
  "bookName": "string",
  "chapter": 1,
  "verseNumber": 1
}
```

### POST /bible/get-favorites
Get user favorites.

**Headers:** Requires authentication
**Body:**
```json
{
  "bookName": "string",
  "chapter": 1,
  "page": 1,
  "pageSize": 20
}
```

### POST /bible/delete-favorite
Delete favorite.

**Headers:** Requires authentication
**Body:**
```json
{
  "favoriteId": "number"
}
```

### POST /bible/get-verse-explanation
Get explanation for a verse.

**Body:**
```json
{
  "bookName": "string",
  "chapter": 1,
  "verseNumber": 1
}
```

### POST /bible/add-verse-explanation
Add verse explanation (Admin only).

**Headers:** Requires admin authentication
**Body:**
```json
{
  "bookName": "string",
  "chapter": 1,
  "verseNumber": 1,
  "explanation": "string",
  "learnMore": "string",
  "bibleVersion": "string"
}
```

### POST /bible/get-all-verses-explanation
Get all verse explanations.

**Body:**
```json
{
  "page": 1,
  "pageSize": 20,
  "bookName": "string"
}
```

### POST /bible/add-verse-note
Add note to verse.

**Headers:** Requires authentication
**Body:**
```json
{
  "bookName": "string",
  "chapter": 1,
  "verseNumber": 1,
  "note": "string"
}
```

### POST /bible/get-verse-note
Get notes for verse.

**Headers:** Requires authentication
**Body:**
```json
{
  "bookName": "string",
  "chapter": 1,
  "verseNumber": 1
}
```

### POST /bible/delete-verse-note
Delete verse note.

**Headers:** Requires authentication
**Body:**
```json
{
  "noteId": "number"
}
```

### POST /bible/get-todays-verse
Get today's daily verse.

### POST /bible/get-home-stats
Get home statistics for user.

**Headers:** Requires authentication

---

## READING PLAN ENDPOINTS

### POST /reading-plans/create
Create new reading plan (Admin only).

**Headers:** Requires admin authentication
**Body:**
```json
{
  "title": "string",
  "description": "string",
  "totalDays": 30,
  "questionsEnabled": false,
  "category": "intro",
  "difficulty": "easy"
}
```

### POST /reading-plans/delete
Delete reading plan (Admin only).

**Headers:** Requires admin authentication
**Body:**
```json
{
  "planId": "string"
}
```

### POST /reading-plans/add-assignment
Add daily assignment to plan (Admin only).

**Headers:** Requires admin authentication
**Body:**
```json
{
  "planId": "string",
  "dayNumber": 1,
  "title": "string",
  "chapters": [{"book": "Genesis", "chapter": 1}],
  "reflectionQuestions": ["Question 1", "Question 2"]
}
```

### POST /reading-plans/add-quiz-questions
Add quiz questions for a day (Admin only).

**Headers:** Requires admin authentication
**Body:**
```json
{
  "planId": "string",
  "dayNumber": 1,
  "questions": [
    {
      "question": "string",
      "options": ["A", "B", "C", "D"],
      "correctAnswer": 0,
      "explanation": "string"
    }
  ]
}
```

### POST /reading-plans/get-all
Get all reading plans.

**Body:**
```json
{
  "category": "string",
  "page": 1,
  "pageSize": 10
}
```

### POST /reading-plans/by-category
Get plans by category.

**Body:**
```json
{
  "category": "intro"
}
```

### POST /reading-plans/start
Start a reading plan.

**Headers:** Requires authentication
**Body:**
```json
{
  "planId": "string"
}
```

### POST /reading-plans/my-progress
Get user's progress for all plans.

**Headers:** Requires authentication

### POST /reading-plans/plan-progress
Get progress for specific plan.

**Headers:** Requires authentication
**Body:**
```json
{
  "planId": "string"
}
```

### POST /reading-plans/daily-assignment
Get daily assignment.

**Headers:** Requires authentication
**Body:**
```json
{
  "planId": "string",
  "dayNumber": 1
}
```

### POST /reading-plans/all-assignments
Get all assignments for a plan.

**Headers:** Requires authentication
**Body:**
```json
{
  "planId": "string"
}
```

### POST /reading-plans/complete-day
Mark a day as completed.

**Headers:** Requires authentication
**Body:**
```json
{
  "planId": "string",
  "dayNumber": 1
}
```

### POST /reading-plans/submit-answer
Submit quiz answer.

**Headers:** Requires authentication
**Body:**
```json
{
  "planId": "string",
  "dayNumber": 1,
  "questionId": "number",
  "userAnswer": 0
}
```

### POST /reading-plans/quiz-questions
Get quiz questions for a day.

**Headers:** Requires authentication
**Body:**
```json
{
  "planId": "string",
  "dayNumber": 1
}
```

### POST /reading-plans/quiz-stats
Get quiz statistics for a plan.

**Headers:** Requires authentication
**Body:**
```json
{
  "planId": "string"
}
```

### POST /reading-plans/update
Update reading plan (Admin only).

**Headers:** Requires admin authentication

### POST /reading-plans/update-quiz-question
Update quiz question (Admin only).

**Headers:** Requires admin authentication

### POST /reading-plans/delete-quiz-question
Delete quiz question (Admin only).

**Headers:** Requires admin authentication

### POST /reading-plans/update-assignment
Update daily assignment (Admin only).

**Headers:** Requires admin authentication

### POST /reading-plans/plan-detail
Get complete plan details.

**Body:**
```json
{
  "planId": "string"
}
```

### POST /reading-plans/remove
Remove user's progress from a plan.

**Headers:** Requires authentication
**Body:**
```json
{
  "planId": "string"
}
```

---

## Database Models

### SystemUser
- id, firstName, lastName, middleName, dateOfBirth, gender
- maritalStatus, email, phoneNumber, alternativePhone
- addressId, ministryGroup, servicePosition, spiritualGifts
- emergencyContactName, emergencyContactPhone, emergencyContactRelationship
- username, password, profilePhotoUrl, loginCount, status
- lastLogin, emailVerified, isLoggedIn, sessionId, userRole

### Activity
- id, userId, username, email, loggedInAt, loggedOutAt
- success, failureReason, ip, userAgent, browserName, os
- deviceType, deviceName, engine, locale

### Verification
- id, code, verificationType, emailAddress, createdBy
- createdOn, expiresAt, status

### DailyVerse
- id, bookName, chapter, verseNumber, displayDate, displayTime
- reflection, createdBy, createdOn, updatedBy, updatedOn, isPublished

### ReadHistory, Favorite, Highlight, Note
- id, bookName, chapter, verseNumber, createdBy, createdOn, updatedBy, updatedOn

### VerseExplanation
- id, bookName, chapter, verseNumber, explanation, learnMore, bibleVersion

### Message
- id, message, recipient, subject, attachment, attachmentTwo
- sendCount, status, sentOn, createdBy, createdOn, updatedBy, updatedOn

### ReadingPlan
- id, planId, title, description, totalDays, questionsEnabled
- category, difficulty, isActive, createdBy, createdOn, updatedBy, updatedOn

### DailyAssignment
- id, planId, dayNumber, title, chaptersJson, reflectionQuestions

### QuizQuestion
- id, planId, dayNumber, question, optionsJson, correctAnswer, explanation

### UserPlanProgress
- id, userId, planId, startDate, completedDaysJson, lastCompletedDate
- streak, isCompleted, completedDate

### UserQuizAnswer
- id, userId, planId, dayNumber, questionId, userAnswer, isCorrect

---

## Environment Variables

```
DATABASE_URL=postgresql://user:password@localhost:5432/exegesis
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d
NODE_ENV=development
PORT=5001
```

---

## Notes

- All Java Spring Boot POST endpoints have been converted to Express POST endpoints
- The API follows the same request/response patterns as the original backend
- Admin endpoints require userRole = 1 (BigInt)
- Regular endpoints require authentication
- BigInt values are serialized as strings in JSON responses