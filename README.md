## Schema Decisions
 
Book references Genre via a genreId foreign key rather than embedding the
genre name directly, because many books share one genre and genres are
managed independently (renaming a genre should not require updating every
book). User stores a `role` field using a Role enum so Postgres and
TypeScript both reject any value other than PATRON or LIBRARIAN.

# Library Management System

## Project Overview

A library management backend built with NestJS, TypeScript, Prisma ORM and PostgreSQL. It manages library users, book genres, books and reviews.

## Technologies Used

- NestJS
- TypeScript
- PostgreSQL
- Prisma ORM 7

## Database Models

### User
Stores library user information, including email, password and role.

### Genre
Stores book categories. Each genre can contain multiple books.

### Book
Stores book information, including title, author, ISBN, description, cover image and copy availability.

### Review
Stores ratings and comments submitted by users about books.

## Schema Decisions

The Book model references Genre through a foreign key (`genreId`) rather than embedding genre information directly inside each book.

This relational design avoids repeating genre information for every book. A single genre can be associated with multiple books, while each book references one existing genre.

Using a foreign key also maintains referential integrity and makes it easier to retrieve books by genre.

## Project Structure

```text
library-management-system/
├── api/
│   ├── prisma/
│   │   ├── migrations/
│   │   ├── schema.prisma
│   │   └── seed.ts
│   ├── src/
│   │   ├── prisma/
│   │   └── generated/
│   ├── .env.example
│   └── prisma.config.ts
└── README.md
```

## Database Setup

1. Clone the repository.
2. Navigate to the API directory.
3. Install dependencies using `npm install`.
4. Create an `.env` file using `.env.example` as a template.
5. Add your PostgreSQL connection URL to `.env`.
6. Apply migrations:

```bash
npx prisma migrate dev
```

7. Generate Prisma Client:

```bash
npx prisma generate
```

8. Seed the database:

```bash
npx prisma db seed
```

## Sample Data

The seed script creates four genres and sixteen sample books distributed across those genres.

## Running the Application

Start the NestJS development server:

```bash
npm run start:dev
```

## Security

Never commit your actual `.env` file or expose database credentials in the repository.
