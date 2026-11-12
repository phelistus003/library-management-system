
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  // Create four genres
  const genres = [
    { name: "Fiction", description: "Imaginative stories and novels" },
    { name: "Technology", description: "Computing and technology" },
    { name: "Self-help", description: "Personal development books" },
    { name: "History", description: "Historical events and people" },
  ];

  for (const genre of genres) {
    await prisma.genre.upsert({
      where: { name: genre.name },
      update: { description: genre.description },
      create: genre,
    });
  }

  // Retrieve the genres and their IDs
  const fiction = await prisma.genre.findUniqueOrThrow({
    where: { name: "Fiction" },
  });

  const technology = await prisma.genre.findUniqueOrThrow({
    where: { name: "Technology" },
  });

  const selfHelp = await prisma.genre.findUniqueOrThrow({
    where: { name: "Self-help" },
  });

  const history = await prisma.genre.findUniqueOrThrow({
    where: { name: "History" },
  });

  // Create sixteen books
  const books = [
    { title: "Things Fall Apart", author: "Chinua Achebe", isbn: "9780001", genreId: fiction.id },
    { title: "The River Between", author: "Ngugi wa Thiong'o", isbn: "9780002", genreId: fiction.id },
    { title: "The Great Gatsby", author: "F. Scott Fitzgerald", isbn: "9780003", genreId: fiction.id },
    { title: "To Kill a Mockingbird", author: "Harper Lee", isbn: "9780004", genreId: fiction.id },

    { title: "Clean Code", author: "Robert C. Martin", isbn: "9780005", genreId: technology.id },
    { title: "The Pragmatic Programmer", author: "Andrew Hunt", isbn: "9780006", genreId: technology.id },
    { title: "Introduction to Algorithms", author: "Thomas Cormen", isbn: "9780007", genreId: technology.id },
    { title: "Design Patterns", author: "Erich Gamma", isbn: "9780008", genreId: technology.id },

    { title: "Atomic Habits", author: "James Clear", isbn: "9780009", genreId: selfHelp.id },
    { title: "Deep Work", author: "Cal Newport", isbn: "9780010", genreId: selfHelp.id },
    { title: "The 7 Habits of Highly Effective People", author: "Stephen Covey", isbn: "9780011", genreId: selfHelp.id },
    { title: "Mindset", author: "Carol Dweck", isbn: "9780012", genreId: selfHelp.id },

    { title: "Sapiens", author: "Yuval Noah Harari", isbn: "9780013", genreId: history.id },
    { title: "The Art of War", author: "Sun Tzu", isbn: "9780014", genreId: history.id },
    { title: "Guns, Germs, and Steel", author: "Jared Diamond", isbn: "9780015", genreId: history.id },
    { title: "The Diary of a Young Girl", author: "Anne Frank", isbn: "9780016", genreId: history.id },
  ];

  for (const book of books) {
    await prisma.book.upsert({
      where: { isbn: book.isbn },
      update: {},
      create: book,
    });
  }

  console.log("Successfully inserted 4 genres and 16 books!");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
