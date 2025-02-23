## API Documentation

## Base URL
```
https://edu-coin.onrender.com/api
```

## Authentication
### Verify Credentials
- **Endpoint**: `POST /auth/verify-credentials`
- **Description**: Verify user credentials.
- **Request Body**:
  ```json
  {
    "username": "string",
    "password": "string"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "token": "string"
  }
  ```

## Profile
### Get Profile
- **Endpoint**: `GET /profile`
- **Description**: Get user profile.
- **Headers**: `Authorization: Bearer <token>`
- **Response**:
  ```json
  {
    "id": "string",
    "name": "string",
    "email": "string",
    "balance": "number"
  }
  ```

### Update Profile
- **Endpoint**: `PUT /profile`
- **Description**: Update user profile.
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**:
  ```json
  {
    "name": "string",
    "email": "string"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "Profile updated successfully"
  }
  ```

### Update Password
- **Endpoint**: `PUT /profile/password`
- **Description**: Update user password.
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**:
  ```json
  {
    "currentPassword": "string",
    "newPassword": "string"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "Password updated successfully"
  }
  ```

## Wallet
### Get Wallet Balance
- **Endpoint**: `GET /wallet/balance`
- **Description**: Get wallet balance.
- **Headers**: `Authorization: Bearer <token>`
- **Response**:
  ```json
  {
    "balance": "number"
  }
  ```

### Top Up Wallet
- **Endpoint**: `POST /wallet/topup`
- **Description**: Top up wallet.
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**:
  ```json
  {
    "amount": "number",
    "method": "string"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "Wallet topped up successfully"
  }
  ```

### Verify Payment
- **Endpoint**: `POST /wallet/verify-payment`
- **Description**: Verify payment.
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**:
  ```json
  {
    "transactionId": "string",
    "success": "boolean"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "Payment verified successfully"
  }
  ```

## Notifications
### Get Notifications
- **Endpoint**: `GET /notifications`
- **Description**: Get all notifications.
- **Headers**: `Authorization: Bearer <token>`
- **Response**:
  ```json
  [
    {
      "id": "string",
      "title": "string",
      "message": "string",
      "type": "string",
      "read": "boolean"
    }
  ]
  ```

### Mark Notification as Read
- **Endpoint**: `PUT /notifications/{id}/read`
- **Description**: Mark a notification as read.
- **Headers**: `Authorization: Bearer <token>`
- **Response**:
  ```json
  {
    "success": true,
    "message": "Notification marked as read"
  }
  ```

### Mark All Notifications as Read
- **Endpoint**: `PUT /notifications/read-all`
- **Description**: Mark all notifications as read.
- **Headers**: `Authorization: Bearer <token>`
- **Response**:
  ```json
  {
    "success": true,
    "message": "All notifications marked as read"
  }
  ```

### Clear Notifications
- **Endpoint**: `DELETE /notifications/clear`
- **Description**: Clear all notifications.
- **Headers**: `Authorization: Bearer <token>`
- **Response**:
  ```json
  {
    "success": true,
    "message": "All notifications cleared"
  }
  ```

## Admin
### Get All Users
- **Endpoint**: `GET /admin/users`
- **Description**: Get all users.
- **Headers**: `Authorization: Bearer <token>`
- **Response**:
  ```json
  [
    {
      "id": "string",
      "name": "string",
      "email": "string"
    }
  ]
  ```

### Get User by Student ID
- **Endpoint**: `GET /admin/users/{studentId}`
- **Description**: Get user by student ID.
- **Headers**: `Authorization: Bearer <token>`
- **Response**:
  ```json
  {
    "id": "string",
    "name": "string",
    "email": "string"
  }
  ```

### Update User
- **Endpoint**: `PUT /admin/users/{id}`
- **Description**: Update user details.
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**:
  ```json
  {
    "firstName": "string",
    "lastName": "string",
    "pin": "string"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "User updated successfully"
  }
  ```

### Delete User
- **Endpoint**: `DELETE /admin/users/{id}`
- **Description**: Delete a user.
- **Headers**: `Authorization: Bearer <token>`
- **Response**:
  ```json
  {
    "success": true,
    "message": "User deleted successfully"
  }
  ```

## Messages
### Send Message
- **Endpoint**: `POST /messages`
- **Description**: Send a message.
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**:
  ```json
  {
    "subject": "string",
    "message": "string"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "Message sent successfully"
  }
  ```

### Get Messages
- **Endpoint**: `GET /messages`
- **Description**: Get all messages.
- **Headers**: `Authorization: Bearer <token>`
- **Response**:
  ```json
  [
    {
      "id": "string",
      "subject": "string",
      "message": "string",
      "read": "boolean"
    }
  ]
  ```

### Mark Message as Read
- **Endpoint**: `PUT /messages/{messageId}/read`
- **Description**: Mark a message as read.
- **Headers**: `Authorization: Bearer <token>`
- **Response**:
  ```json
  {
    "success": true,
    "message": "Message marked as read"
  }
  ```

### Delete Message
- **Endpoint**: `DELETE /messages/{messageId}`
- **Description**: Delete a message.
- **Headers**: `Authorization: Bearer <token>`
- **Response**:
  ```json
  {
    "success": true,
    "message": "Message deleted successfully"
  }
  ```

### Send Broadcast Message
- **Endpoint**: `POST /messages/broadcast`
- **Description**: Send a broadcast message.
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**:
  ```json
  {
    "subject": "string",
    "message": "string"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "Broadcast message sent successfully"
  }
  ```

### Reply to Message
- **Endpoint**: `POST /messages/{messageId}/reply`
- **Description**: Reply to a message.
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**:
  ```json
  {
    "message": "string"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "Reply sent successfully"
  }
  ```

## Analytics
- **Endpoint**: `/analytics`
- **Description**: Analytics routes.

## Budget
- **Endpoint**: `/budget`
- **Description**: Budget routes.

## Achievements
- **Endpoint**: `/achievements`
- **Description**: Achievement routes.

## Transactions
### Get Transaction History
- **Endpoint**: `GET /transactions`
- **Description**: Get transaction history.
- **Headers**: `Authorization: Bearer <token>`
- **Response**:
  ```json
  [
    {
      "id": "string",
      "amount": "number",
      "date": "string",
      "type": "string"
    }
  ]
  ```

### Process Payment
- **Endpoint**: `POST /payment`
- **Description**: Process a payment.
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**:
  ```json
  {
    "amount": "number",
    "method": "string"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "Payment processed successfully"
  }
  ```
