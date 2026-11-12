
import "dotenv/config";

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  // 1. Create the four book genres
  const genreNames = [
    "Fantasy",
    "Science Fiction",
    "Mystery",
    "Biography",
  ];

  const genres = await Promise.all(
    genreNames.map((name) =>
      prisma.genre.upsert({
        where: {
          slug: name.toLowerCase().replace(/\s+/g, "-"),
        },
        update: {
          name,
        },
        create: {
          name,
          slug: name.toLowerCase().replace(/\s+/g, "-"),
        },
      }),
    ),
  );

  // 2. Prepare at least 15 books
  const sampleBooks = [
    {
      title: "The Hobbit",
      author: "J.R.R. Tolkien",
      genre: "Fantasy",
      isbn: "9780547928227",
      description: "A fantasy adventure about a hobbit's unexpected journey.",
    },
    {
      title: "Harry Potter and the Philosopher's Stone",
      author: "J.K. Rowling",
      genre: "Fantasy",
      isbn: "9780747532699",
      description: "A young wizard discovers his magical identity.",
    },
    {
      title: "The Lord of the Rings",
      author: "J.R.R. Tolkien",
      genre: "Fantasy",
      isbn: "9780618640157",
      description: "An epic journey to destroy a powerful ring.",
    },
    {
      title: "The Name of the Wind",
      author: "Patrick Rothfuss",
      genre: "Fantasy",
      isbn: "9780756404741",
      description: "The story of a gifted young magician.",
    },

    {
      title: "Dune",
      author: "Frank Herbert",
      genre: "Science Fiction",
      isbn: "9780441172719",
      description: "A science fiction epic set on the desert planet Arrakis.",
    },
    {
      title: "1984",
      author: "George Orwell",
      genre: "Science Fiction",
      isbn: "9780451524935",
      description: "A dystopian novel about surveillance and totalitarianism.",
    },
    {
      title: "Fahrenheit 451",
      author: "Ray Bradbury",
      genre: "Science Fiction",
      isbn: "9781451673319",
      description: "A future society where books are forbidden.",
    },
    {
      title: "The Martian",
      author: "Andy Weir",
      genre: "Science Fiction",
      isbn: "9780553418026",
      description: "An astronaut struggles to survive alone on Mars.",
    },

    {
      title: "The Big Sleep",
      author: "Raymond Chandler",
      genre: "Mystery",
      isbn: "9780394758282",
      description: "A private detective investigates a complicated case.",
    },
    {
      title: "Murder on the Orient Express",
      author: "Agatha Christie",
      genre: "Mystery",
      isbn: "9780062693662",
      description: "Detective Hercule Poirot investigates a murder on a train.",
    },
    {
      title: "The Girl with the Dragon Tattoo",
      author: "Stieg Larsson",
      genre: "Mystery",
      isbn: "9780307454546",
      description: "A journalist and hacker investigate a disappearance.",
    },
    {
      title: "Gone Girl",
      author: "Gillian Flynn",
      genre: "Mystery",
      isbn: "9780307588371",
      description: "A psychological mystery surrounding a missing woman.",
    },

    {
      title: "Educated",
      author: "Tara Westover",
      genre: "Biography",
      isbn: "9780399590504",
      description: "A memoir about education and personal transformation.",
    },
    {
      title: "Long Walk to Freedom",
      author: "Nelson Mandela",
      genre: "Biography",
      isbn: "9780316548182",
      description: "The autobiography of Nelson Mandela.",
    },
    {
      title: "The Diary of a Young Girl",
      author: "Anne Frank",
      genre: "Biography",
      isbn: "9780307594006",
      description: "The diary of Anne Frank during World War II.",
    },
    {
      title: "Becoming",
      author: "Michelle Obama",
      genre: "Biography",
      isbn: "9781524763138",
      description: "A memoir about Michelle Obama's life and experiences.",
    },
  ];

  // 3. Insert books and connect each one to its genre
  for (const book of sampleBooks) {
    const genre = genres.find((g) => g.name === book.genre);

    if (!genre) {
      throw new Error(`Genre not found: ${book.genre}`);
    }

    await prisma.book.upsert({
      where: {
        isbn: book.isbn,
      },
      update: {
        title: book.title,
        author: book.author,
        description: book.description,
        genreId: genre.id,
        totalCopies: 3,
        availableCopies: 3,
      },
      create: {
        title: book.title,
        author: book.author,
        isbn: book.isbn,
        description: book.description,
        genreId: genre.id,
        totalCopies: 3,
        availableCopies: 3,
      },
    });
  }

  console.log("Successfully seeded 4 genres and 16 books!");
}

main()
  .catch((error) => {
    console.error("Seeding failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
