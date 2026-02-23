import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Clear existing data in correct order (respecting foreign key constraints)
  await prisma.message.deleteMany();
  await prisma.conversation.deleteMany();
  await prisma.reply.deleteMany();
  await prisma.discussion.deleteMany();
  await prisma.listing.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  console.log('Cleared existing data');

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
      imageUrl: '/book.png',
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
      imageUrl: '/laptop.png',
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
      imageUrl: '/chair.png',
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

  // Create discussions with replies
  await prisma.discussion.create({
    data: {
      title: 'Best study spots on campus?',
      description: 'Where do you all go to study when you need to focus?',
      replies: {
        create: [
          {
            content: 'The top floor of the library is very quiet. Tons of study rooms you can reserve too.',
          },
          {
            content: 'The entrance section of the library is very good too, you can even after they close.',
          },
        ],
      },
    },
  });

  await prisma.discussion.create({
    data: {
      title: 'Need help with Calculus 2?',
      description: 'Struggling with integration techniques and series. Anyone know of good tutors or study groups?',
      replies: {
        create: [
          {
            content: 'The Math Learning Center offers free tutoring. I go there all the time.',
          },
          {
            content: 'Professor Lenard has amazing YouTube videos on calc 2. Seriously saved my grade.',
          },
          {
            content: 'I\'m in calc 2 right now - want to start a study group? We could meet weekly at the library.',
          },
        ],
      },
    },
  });

  await prisma.discussion.create({
    data: {
      title: 'Tips for managing course load?',
      description: 'Taking 18 credits this semester and feeling overwhelmed. How do you all balance everything?',
      replies: {
        create: [
          {
            content: 'Use a planner! I write down all assignments and due dates at the start of the semester. Game changer.',
          },
          {
            content: 'Time blocking helped me a lot. Dedicate specific hours to each class and stick to it.',
          },
        ],
      },
    },
  });

  console.log('Seeded database with users, categories, listings, conversations, messages, discussions, and replies');
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
