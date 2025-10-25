# CRM HomStudent API Documentation

## Overview
This is a complete production-ready REST API for the CRM HomStudent system built with Laravel 11 and Laravel Sanctum for authentication.

## Base URL
```
http://your-domain.com/api
```

## Authentication

### Login
**Endpoint:** `POST /api/login`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Accesso effettuato con successo",
  "data": {
    "user": {
      "id": 1,
      "name": "User Name",
      "email": "user@example.com"
    },
    "token": "1|laravel_sanctum_token_here"
  }
}
```

### Logout
**Endpoint:** `POST /api/logout`

**Headers:** `Authorization: Bearer {token}`

**Response:**
```json
{
  "success": true,
  "message": "Logout effettuato con successo",
  "data": null
}
```

### Get Current User
**Endpoint:** `GET /api/me`

**Headers:** `Authorization: Bearer {token}`

**Response:**
```json
{
  "success": true,
  "message": "Informazioni utente recuperate con successo",
  "data": {
    "id": 1,
    "name": "User Name",
    "email": "user@example.com",
    "email_verified_at": null
  }
}
```

## API Endpoints

All endpoints below require authentication via `Authorization: Bearer {token}` header.

### Clients
- `GET /api/clients` - List all clients (with pagination, search, filters)
- `POST /api/clients` - Create a new client
- `GET /api/clients/{id}` - Get a specific client
- `PUT /api/clients/{id}` - Update a client
- `DELETE /api/clients/{id}` - Delete a client (soft delete)

**Query Parameters for List:**
- `search` - Search by name, email, phone
- `type` - Filter by type (private/business)
- `city` - Filter by city
- `province` - Filter by province

### Properties
- `GET /api/properties` - List all properties
- `POST /api/properties` - Create a new property
- `GET /api/properties/{id}` - Get a specific property
- `PUT /api/properties/{id}` - Update a property
- `DELETE /api/properties/{id}` - Delete a property

**Query Parameters:**
- `search` - Search by name, address, internal code
- `city` - Filter by city
- `property_type` - Filter by property type
- `property_status` - Filter by status

### Rooms
- `GET /api/rooms` - List all rooms
- `POST /api/rooms` - Create a new room
- `GET /api/rooms/{id}` - Get a specific room
- `PUT /api/rooms/{id}` - Update a room
- `DELETE /api/rooms/{id}` - Delete a room

**Query Parameters:**
- `property_id` - Filter by property
- `room_type` - Filter by room type
- `availability_type` - Filter by availability

### Contracts
- `GET /api/contracts` - List all contracts
- `POST /api/contracts` - Create a new contract
- `GET /api/contracts/{id}` - Get a specific contract
- `PUT /api/contracts/{id}` - Update a contract
- `DELETE /api/contracts/{id}` - Delete a contract

**Query Parameters:**
- `client_id` - Filter by client
- `status` - Filter by status
- `contract_type` - Filter by contract type
- `property_type` - Filter by property type

### Proposals
- `GET /api/proposals` - List all proposals
- `POST /api/proposals` - Create a new proposal
- `GET /api/proposals/{id}` - Get a specific proposal
- `PUT /api/proposals/{id}` - Update a proposal
- `DELETE /api/proposals/{id}` - Delete a proposal

**Query Parameters:**
- `client_id` - Filter by client
- `status` - Filter by status

### Owners
- `GET /api/owners` - List all property owners
- `POST /api/owners` - Create a new owner
- `GET /api/owners/{id}` - Get a specific owner
- `PUT /api/owners/{id}` - Update an owner
- `DELETE /api/owners/{id}` - Delete an owner

**Query Parameters:**
- `search` - Search by name

### Suppliers
- `GET /api/suppliers` - List all suppliers
- `POST /api/suppliers` - Create a new supplier
- `GET /api/suppliers/{id}` - Get a specific supplier
- `PUT /api/suppliers/{id}` - Update a supplier
- `DELETE /api/suppliers/{id}` - Delete a supplier

**Query Parameters:**
- `search` - Search by name
- `type` - Filter by type

### Condominiums
- `GET /api/condominiums` - List all condominiums
- `POST /api/condominiums` - Create a new condominium
- `GET /api/condominiums/{id}` - Get a specific condominium
- `PUT /api/condominiums/{id}` - Update a condominium
- `DELETE /api/condominiums/{id}` - Delete a condominium

**Query Parameters:**
- `search` - Search by name or address

## Response Format

All API responses follow this consistent format:

### Success Response
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {
    // Response data here
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message",
  "data": null,
  "errors": {
    // Validation errors (only for 422 responses)
  }
}
```

## HTTP Status Codes

- `200` - OK (successful GET, PUT, DELETE)
- `201` - Created (successful POST)
- `400` - Bad Request
- `401` - Unauthorized (not authenticated)
- `404` - Not Found
- `422` - Unprocessable Entity (validation error)
- `500` - Internal Server Error

## Pagination

List endpoints return paginated results with the following format:

```json
{
  "success": true,
  "message": "Resources retrieved successfully",
  "data": {
    "clients": [...],
    "pagination": {
      "total": 100,
      "per_page": 15,
      "current_page": 1,
      "last_page": 7,
      "from": 1,
      "to": 15
    }
  }
}
```

## File Structure

```
app/
├── Http/
│   ├── Controllers/
│   │   └── Api/
│   │       ├── AuthController.php
│   │       ├── ClientController.php
│   │       ├── PropertyController.php
│   │       ├── RoomController.php
│   │       ├── ContractController.php
│   │       ├── ProposalController.php
│   │       ├── OwnerController.php
│   │       ├── SupplierController.php
│   │       └── CondominiumController.php
│   ├── Resources/
│   │   ├── ClientResource.php
│   │   ├── PropertyResource.php
│   │   ├── RoomResource.php
│   │   ├── ContractResource.php
│   │   ├── ProposalResource.php
│   │   ├── OwnerResource.php
│   │   ├── SupplierResource.php
│   │   ├── CondominiumResource.php
│   │   ├── ContractPaymentResource.php
│   │   ├── InvoiceResource.php
│   │   ├── DepositResource.php
│   │   ├── CancellationResource.php
│   │   └── PenaltyResource.php
│   ├── Requests/
│   │   ├── StoreClientRequest.php
│   │   ├── UpdateClientRequest.php
│   │   ├── StorePropertyRequest.php
│   │   ├── UpdatePropertyRequest.php
│   │   ├── StoreRoomRequest.php
│   │   ├── UpdateRoomRequest.php
│   │   ├── StoreContractRequest.php
│   │   └── UpdateContractRequest.php
│   └── Helpers/
│       └── ApiResponse.php
└── Models/
    ├── Client.php
    ├── Property.php
    ├── Room.php
    ├── Contract.php
    ├── Proposal.php
    ├── Owner.php
    ├── Supplier.php
    ├── Condominium.php
    └── ... (other models)

routes/
└── api.php

bootstrap/
└── app.php (with exception handlers)
```

## Features Implemented

✅ Complete authentication system with Laravel Sanctum
✅ 13 API Resource classes for consistent response formatting
✅ 8 Form Request validation classes
✅ 9 fully functional API controllers with CRUD operations
✅ Pagination support (15 items per page)
✅ Search and filtering capabilities
✅ Eager loading to avoid N+1 queries
✅ Consistent JSON response format
✅ Global error handling with proper HTTP status codes
✅ Soft deletes for reversible operations
✅ Automatic contract number generation
✅ Italian language error messages for user-facing responses
✅ Production-ready code with try-catch error handling

## Testing the API

### Using cURL

```bash
# Login
curl -X POST http://your-domain.com/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password"}'

# Get clients (with token)
curl -X GET http://your-domain.com/api/clients \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Accept: application/json"

# Create client
curl -X POST http://your-domain.com/api/clients \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{"type":"private","first_name":"Mario","last_name":"Rossi","email":"mario@example.com"}'
```

### Using Postman

1. Import the collection with base URL: `http://your-domain.com/api`
2. Login via POST `/login` to get your token
3. Add token to Collection > Authorization > Bearer Token
4. Test all endpoints

## Security Notes

- All API routes (except login) require authentication
- Tokens are revoked on logout
- Only one active token per user (old tokens are deleted on new login)
- CORS should be configured in `config/cors.php` for production
- Use HTTPS in production
- Rate limiting should be configured for production use

## Next Steps

To extend this API, you can:
1. Add more endpoints for ContractPayment, Invoice, Deposit, Cancellation, Penalty
2. Implement role-based permissions using Spatie Laravel Permission
3. Add API versioning (v1, v2)
4. Implement WebSocket support for real-time updates
5. Add comprehensive API tests
6. Implement API rate limiting
7. Add API documentation with Swagger/OpenAPI
8. Implement file upload endpoints for contracts and documents
