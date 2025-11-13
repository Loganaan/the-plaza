import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create users
  const seller = await prisma.user.create({
    data: {
      email: 'seller@wsu.edu',
      name: 'John Seller',
      googleId: 'google-seller-123',
    },
  });

  const buyer = await prisma.user.create({
    data: {
      email: 'buyer@wsu.edu',
      name: 'Jane Buyer',
      googleId: 'google-buyer-123',
    },
  });

  // Create categories
  const textbooks = await prisma.category.create({
    data: { field: 'Textbooks' },
  });

  const electronics = await prisma.category.create({
    data: { field: 'Electronics' },
  });

  const furniture = await prisma.category.create({
    data: { field: 'Furniture' },
  });

  // Create listings with conversations and messages
  await prisma.listing.create({
    data: {
      title: 'Calculus Textbook',
      description: 'Used calculus textbook, good condition',
      price: 50,
      imageUrl: 'https://example.com/calculus.jpg',
      status: 'active',
      categoryId: textbooks.id,
      sellerId: seller.id,
      conversations: {
        create: {
          buyerId: buyer.id,
          sellerId: seller.id,
          messages: {
            create: [
              {
                content: 'Hi! Is this textbook still available?',
                senderId: buyer.id,
                receiverId: seller.id,
              },
              {
                content: 'Yes, it is! Would you like to meet on campus?',
                senderId: seller.id,
                receiverId: buyer.id,
                isRead: true,
              },
            ],
          },
        },
      },
    },
  });

  await prisma.listing.create({
    data: {
      title: 'Laptop',
      description: 'MacBook Pro 2019, lightly used',
      price: 1200,
      imageUrl: 'https://example.com/laptop.jpg',
      status: 'active',
      categoryId: electronics.id,
      sellerId: seller.id,
      conversations: {
        create: {
          buyerId: buyer.id,
          sellerId: seller.id,
          messages: {
            create: [
              {
                content: 'Does the laptop come with the charger?',
                senderId: buyer.id,
                receiverId: seller.id,
              },
              {
                content: 'Yes, it includes the original charger and case!',
                senderId: seller.id,
                receiverId: buyer.id,
                isRead: true,
              },
              {
                content: 'Great! Can I see it tomorrow?',
                senderId: buyer.id,
                receiverId: seller.id,
              },
            ],
          },
        },
      },
    },
  });

  await prisma.listing.create({
    data: {
      title: 'Desk Chair',
      description: 'Comfortable office chair',
      price: 75,
      imageUrl: 'https://example.com/chair.jpg',
      status: 'active',
      categoryId: furniture.id,
      sellerId: seller.id,
      conversations: {
        create: {
          buyerId: buyer.id,
          sellerId: seller.id,
          messages: {
            create: [
              {
                content: 'Is the chair adjustable?',
                senderId: buyer.id,
                receiverId: seller.id,
              },
            ],
          },
        },
      },
    },
  });

  console.log('Seeded database with users, categories, listings, conversations, and messages');
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
