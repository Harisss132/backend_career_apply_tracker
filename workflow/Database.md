# Struktur Database

## Table User

users

    id     SERIAL PRIMARY KEY

    name     VARCHAR(255) NOT NULL

    email      VARCHAR(100) NOT NULL UNIQUE

    password     VARCHAR(100) NOT NULL

    created_at     TIMESTAMPZ NOT NULL DEFAULT NOW()

    updated_at     TIMESTAMPZ NOT NULL DEFAULT NOW()

    deleted_at     TIMESTAMPZ

## Table Company

companies

    id     SERIAL PRIMARY KEY

    user_id     INT NOT NULL

    company_name     VARCHAR(255) NOT NULL

    company_address     TEXT

    created_at     TIMESTAMPZ NOT NULL DEFAULT NOW()

    updated_at     TIMESTAMPZ NOT NULL DEFAULT NOW()

    deleted_at     TIMESTAMPZ

    CONSTRAINT fk_company_user FOREIGN KEY (user_id) REFERENCES users(id)

## Table Application

applications

    id     SERIAL PRIMARY KEY

    company_id     INT NOT NULL

    user_id     INT NOT NULL

    status     VARCHAR(100) NOT NULL

    position     VARCHAR(100) NOT NULL

    applied_date     DATE NOT NULL

    expect_response_date     DATE NOT NULL

    platform     VARCHAR(100) NOT NULL

    notes     TEXT

    created_at     TIMESTAMPZ NOT NULL DEFAULT NOW()

    updated_at     TIMESTAMPZ NOT NULL DEFAULT NOW()

    deleted_at     TIMESTAMPZ

    CONSTRAINT fk_application_user FOREIGN KEY (user_id) REFERENCES users(id)

    CONSTRAINT fk_application_company FOREIGN KEY (company_id) REFERENCES companies(id)

## Table Refresh token

refresh_tokens

    id     SERIAL PRIMARY KEY

    user_id     INT NOT NULL

    token     text NOT NULL

    created_at     TIMESTAMPZ NOT NULL DEFAULT NOW()

    updated_at     TIMESTAMPZ NOT NULL DEFAULT NOW()

    deleted_at     TIMESTAMPZ

    CONSTRAINT fk_refresh_token_user FOREIGN KEY (user_id) REFERENCES users(id)

## Table User

model User {  

    id            Int             @id @default(autoincrement())  

    name          String  

    email         String          @unique  

    password      String  

    createdAt     DateTime        @default(now()) @map("created_at")  

    updatedAt     DateTime        @updatedAt @map("updated_at")  

    deletedAt     DateTime?       @map("deleted_at")
    
    companies     Company[]  

    applications  Application[]  

    refreshTokens RefreshToken[]

    @@map("users")
}

## Table Company

model Company {  

    id              Int           @id @default(autoincrement())

    userId          Int           @map("user_id")

    companyName     String        @map("company_name")

    companyAddress  String?       @map("company_address")

    createdAt       DateTime      @default(now()) @map("created_at")

    updatedAt       DateTime      @updatedAt @map("updated_at")

    deletedAt       DateTime?     @map("deleted_at")

    user            User          @relation(fields: [userId], references: [id])  applications    Application[]

    @@map("companies")
}

## Table Application

model Application {  

    id                  Int       @id @default(autoincrement())

    userId              Int       @map("user_id")

    companyId           Int       @map("company_id")

    status              String  

    position            String

    appliedDate         DateTime  @map("applied_date") @db.Date 

    expectResponseDate  DateTime? @map("expect_response_date") @db.Date

    platform            String

    notes               String?

    createdAt           DateTime  @default(now()) @map("created_at")

    updatedAt           DateTime  @updatedAt @map("updated_at")

    deletedAt           DateTime? @map("deleted_at")

    user                User      @relation(fields: [userId], references: [id])

    company             Company   @relation(fields: [companyId], references: [id])

    @@map("applications")
}

## Table Refresh token

model RefreshToken {

    id        Int       @id @default(autoincrement())

    userId    Int       @map("user_id")

    token     String  expiresAt DateTime  @map("expires_at")

    createdAt DateTime  @default(now()) @map("created_at")

    updatedAt DateTime  @updatedAt @map("updated_at")

    deletedAt DateTime? @map("deleted_at")

    user      User      @relation(fields: [userId], references: [id])

    @@map("refresh_tokens")
}