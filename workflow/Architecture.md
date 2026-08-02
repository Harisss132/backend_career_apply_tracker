# Sistem Arsitektur

## Tech Stack

- Typescript
- Express
- Node.js
- PostgreSQL
- Prisma
- Jwt (Json Web Token)
- Bcrypt
- Zod
- Cors
- Helmet
- Express-rate-limit
- Winston
- Jest
- Postman

## Struktur Folder

menggunakan konsep MVC namun karna tidak ada View jadi cuma Model dan Controller aja

/src

   /config

   /controllers

   /logger

   /middlewares

   /routes

   /schemas

   /services

   /types

   /testing

   /utils

## MVP (Minimum Variabel Product)

minimal fitur yang harus ada di project ini

**Authentication**
- Register
- Login
- Refresh Token
- Logout

**User**
- Profile sederhana (opsional)

**Company**
- CRUD Company

**Application**
- CRUD Application
- Search
- Filter
- Pagination

**Security**
- JWT
- Refresh Token
- bcrypt
- Zod
- Helmet
- Rate Limiter
- CORS

**Database**
- User
- Company
- Application
- Refresh Token

**Testing**
- Auth
- Application

## Security API

registerUser: perlu validasi dengan zod

loginUser: perlu validasi dengan zod

getProfileUser: perlu validasi dengan zod + protected auth middleware

getAllCompany: tidak ada validasi dan protected route

getCompanyById: pengecekan sederhana di controller, seperti ada IDnya atau tidak

createCompany: perlu validasi dengan zod + protected auth middleware

updateCompany: perlu validasi dengan zod + protected auth middleware

deleteCompany: perlu validasi dengan zod + protected auth middleware

getAllApplication: tidak ada validasi dan protected route

getApplicationById: pengecekan sederhana di controller, seperti ada IDnya atau tidak

createApplication: perlu validasi dengan zod + protected auth middleware

updateApplication: perlu validasi dengan zod + protected auth middleware

deleteApplication: perlu validasi dengan zod + protected auth middleware

## Authorization rules

- Setiap user hanya bisa melihat dan mengelola data miliknya sendiri.
- Company milik user sendiri user hanya bisa CRUD company miliknya sendiri.
- Application milik user sendiri user hanya bisa CRUD application miliknya sendiri.
- Semua user punya dashboard masing-masing yang isinya company + application miliknya.

## **Struktur prisma relasi/database relasi**

getAllApplications: dibuat join table sama company terus harus ada spesifik user by Id jadi setiap user punya dashboard lamaran sendiri

getApplicationById: dibuat join table juga, tapi ngambil Id spesifik dari company dan id Applications serta dibuat spesifik peruser aja dengan Id user

## Responses API

registerUser:

- 201 Created
- 400 Validasi Gagal
- 500 Server Error

loginUser:

- 201 Login berhasil
- 400 Validasi Gagal
- 500 Server Error

getProfileUser

- 200 Response ok
- 401 Unautorized token gagal
- 403 Token kadaluarsa
- 404 User not found
- 500 Server Error

getAllCompanies

- 200 response ok
- 500 Server Error

getCompanyById

- 200 response ok
- 404 Company not found
- 500 Server Error

CreateCompany

- 201 Created
- 400 Validasi Gagal
- 401 Unautorized token gagal
- 403 Token kadaluarsa
- 500 Server Error

updateCompany 

- 200 Response ok
- 400 Validasi Gagal
- 401 Unautorized token gagal
- 403 Token kadaluarsa
- 404 Company not found
- 500 Server Error

deleteCompany

- 200 Response ok
- 401 Unautorized token gagal
- 403 Token kadaluarsa
- 404 Company not found
- 500 Server Error

getAllApplications

- 200 Response ok
- 500 Server Error

getApplicationById

- 200 response ok
- 404 Company not found
- 500 Server Error

CreateApplication

- 201 Created
- 400 Validasi Gagal
- 401 Unautorized token gagal
- 403 Token kadaluarsa
- 500 Server Error

updateApplication

- 200 Response ok
- 400 Validasi Gagal
- 401 Unautorized token gagal
- 403 Token kadaluarsa
- 404 Company not found
- 500 Server Error

deleteApplication

- 200 Response ok
- 401 Unautorized token gagal
- 403 Token kadaluarsa
- 404 Company not found
- 500 Server Error