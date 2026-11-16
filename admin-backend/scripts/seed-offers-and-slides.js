import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import { DEFAULT_OFFERS } from '../src/services/offerService.js';
import { DEFAULT_SLIDES } from '../src/services/slideService.js';

dotenv.config();

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

async function seed() {
  console.log('Seeding Offers and Slides into Database...');

  // 1. Seed Offers
  for (const o of DEFAULT_OFFERS) {
    const bulletsJson = JSON.stringify(o.bullets || []);
    await prisma.offer.upsert({
      where: { id: o.id },
      update: {
        title: o.title,
        caption: o.caption || null,
        badge: o.badge || 'SPECIAL OFFER',
        tag: o.tag || 'EXCLUSIVE',
        image: o.image,
        icon: o.icon || '🍿',
        validity: o.validity || 'Limited Time',
        description: o.description,
        bullets: bulletsJson,
        publishDate: o.publishDate || 'Aug 04, 2026',
        status: o.status || 'Active',
      },
      create: {
        id: o.id,
        title: o.title,
        caption: o.caption || null,
        badge: o.badge || 'SPECIAL OFFER',
        tag: o.tag || 'EXCLUSIVE',
        image: o.image,
        icon: o.icon || '🍿',
        validity: o.validity || 'Limited Time',
        description: o.description,
        bullets: bulletsJson,
        publishDate: o.publishDate || 'Aug 04, 2026',
        status: o.status || 'Active',
      },
    });
  }
  console.log(`✅ Successfully seeded ${DEFAULT_OFFERS.length} offers into Offer table.`);

  // 2. Seed Slides
  for (const s of DEFAULT_SLIDES) {
    const badgesJson = JSON.stringify(s.badges || ['NOW SHOWING']);
    await prisma.slide.upsert({
      where: { id: s.id },
      update: {
        title: s.title,
        subtitle: s.subtitle || '',
        description: s.description,
        image: s.image,
        badges: badgesJson,
        linkUrl: s.linkUrl || '/movies',
        status: s.status || 'Active',
        order: s.order || 0,
      },
      create: {
        id: s.id,
        title: s.title,
        subtitle: s.subtitle || '',
        description: s.description,
        image: s.image,
        badges: badgesJson,
        linkUrl: s.linkUrl || '/movies',
        status: s.status || 'Active',
        order: s.order || 0,
      },
    });
  }
  console.log(`✅ Successfully seeded ${DEFAULT_SLIDES.length} slides into Slide table.`);

  const offerCount = await prisma.offer.count();
  const slideCount = await prisma.slide.count();
  console.log(`Current DB count: ${offerCount} offers, ${slideCount} slides.`);
}

seed()
  .catch((e) => {
    console.error('Error seeding offers and slides:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
