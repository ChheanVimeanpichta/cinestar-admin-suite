import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting Prisma database seeding for MySQL...');

  // 1. Seed Admins & Staff
  const initialAdmins = [
    {
      id: 'adm-1',
      email: 'admin@gmail.com',
      name: 'Admin',
      password: 'cinestar123',
      role: 'admin',
    },
    {
      id: 'adm-staff-1',
      email: 'blair@gmail.com',
      name: 'Blair',
      password: '123456',
      role: 'staff',
    },
    {
      id: 'adm-staff-2',
      email: 'tinkerbell@gmail.com',
      name: 'Tinkerbell',
      password: '123456',
      role: 'staff',
    },
    {
      id: 'adm-staff-3',
      email: 'luke@gmail.com',
      name: 'Luke',
      password: '123456',
      role: 'staff',
    },
  ];

  for (const adm of initialAdmins) {
    await prisma.admin.upsert({
      where: { email: adm.email.toLowerCase() },
      update: {
        name: adm.name,
        password: adm.password,
        role: adm.role,
      },
      create: {
        id: adm.id,
        email: adm.email.toLowerCase(),
        name: adm.name,
        password: adm.password,
        role: adm.role,
      },
    });
  }
  console.log(`✅ Seeded ${initialAdmins.length} admins/staff.`);

  // 2. Seed Sample Customers
  const initialCustomers = [
    {
      id: 'cust-1',
      name: 'John Doe',
      email: 'customer@cinestar.com',
      phone: '+1234567890',
      password: 'customer123',
      role: 'Customer',
      status: 'Active',
      bookingCount: 2,
    },
  ];

  for (const cust of initialCustomers) {
    await prisma.customer.upsert({
      where: { email: cust.email.toLowerCase() },
      update: {
        name: cust.name,
        phone: cust.phone,
        password: cust.password,
        status: cust.status,
        bookingCount: cust.bookingCount,
      },
      create: {
        id: cust.id,
        name: cust.name,
        email: cust.email.toLowerCase(),
        phone: cust.phone,
        password: cust.password,
        role: cust.role,
        status: cust.status,
        joinDate: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
        bookingCount: cust.bookingCount,
      },
    });
  }
  console.log(`✅ Seeded ${initialCustomers.length} initial customers.`);

  // 3. Seed Movies
  const initialMovies = [
    {
      id: 'avenger',
      title: 'Avengers: Endgame',
      poster: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQWWatxhrUO2mPie7B5xc-V8DXxsGe9a4CFhAfBIvbJPA&s=10',
      genre: 'Action/Sci-Fi',
      score: 8.9,
      synopsis: 'When the signal dies, the city follows.',
      badge: 'IMAX',
      hasBookBtn: true,
    },
    {
      id: 'fairy-secret',
      title: 'The Fairy Secret',
      poster: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdLMFblwS4y1QbzHFKs9g150scJslcAsSxTcdJMwid4w&s=10',
      genre: 'Action',
      score: 7.4,
      synopsis: 'Every spire hides a secret.',
      badge: '4DX',
    },
    {
      id: 'jurrasic-echoes',
      title: 'Jurrasic Echoes',
      poster: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQXVj1jwI4fGAbXd6dOf3emm0PzHhQj9-ZK6nv13pb5dQ&s=10',
      genre: 'Drama',
      score: 9.2,
      synopsis: 'Dir. A.G. Iñárritu',
      badge: 'CineStar',
    },
    {
      id: 'princes',
      title: 'The 12 dancing princesses',
      poster: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRtWdSsPc3Lf9zMSAufsmKPEQ-aAiFwWyIVXNghzTx5UA&s=10',
      genre: 'Sci-Fi',
      score: 8.1,
      synopsis: 'Beyond the known universe.',
      badge: 'IMAX',
    },
    {
      id: 'pirate-echoes',
      title: 'Pirate Fair: Echoes of the Sea',
      poster: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQdXmUXa0G1ezo-TA0vrr_GAhisBMegQz09jeJbDCgkRw&s=10',
      genre: 'Horror',
      score: 6.8,
      synopsis: 'No vacancy. No escape.',
    },
    {
      id: 'spider-verse-2',
      title: 'SPIDER-MAN: INTO THE SPIDER-VERSE 2',
      poster: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRoGytKPuYMT7IQulS8QemehYHgNiNsOyuoxX2rbQsPdw&s=10',
      genre: 'Animation/Action',
      score: 8.5,
      synopsis: 'Rise of the empire.',
      badge: '4DX',
      hasBookBtn: true,
    },
    {
      id: 'raya',
      title: 'Raya and the Last Dragon',
      poster: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQm9pl3ezvWPpgU1UoObqXTpjE5Q4GskYSfKcZJNNNvFw&s=10',
      genre: 'Mystery',
      score: null,
      synopsis: 'Trust no one.',
      badge: 'CineStar',
    },
    {
      id: 'sheep',
      title: 'Sheep Detective',
      poster: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTQnkapobjb_5fwfdC2YryPjTwmooJ8HLLcQIs0Aomi0A&s=10',
      genre: 'Sci-Fi/Drama',
      score: null,
      synopsis: 'The signal came from nowhere.',
    },
    {
      id: 'avatar',
      title: 'Avatar: The Way of Water',
      poster: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRsteWOIgIfjtkiYRnJNRzinTz0TXz3d3Z4bxdkoI1u2Q&s=10',
      genre: 'Thriller',
      score: null,
      synopsis: 'The mind is the final frontier.',
    },
    {
      id: 'hopper',
      title: 'HOPPER',
      poster: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTF2_jzf8Bot1lnxHSeU7iw5ZCTXLsAD9EkRWqOsVAzZw&s=10',
      genre: 'Action/Sci-Fi',
      score: null,
      synopsis: 'Humanity. Upgraded.',
    },
    {
      id: 'forn',
      title: 'Tinker Bell and the Legend of the Neverbeast',
      poster: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRxbLJ65BPJksC0H21bjjmYF8-0LfHkmVrHnwSo4o09kQ&s=10',
      genre: 'Mystery/Adventure',
      score: null,
      synopsis: 'Humanity. Upgraded.',
    },
    {
      id: 'barbie',
      title: 'Barbie: Princess Charm School',
      poster: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ2LRKh6UujWBbI5KWrAY0EGn93XVUn-shxv0EMLZ6qGw&s=10',
      genre: 'Drama',
      score: null,
      synopsis: 'Humanity. Upgraded.',
    },
    {
      id: 'swapp',
      title: 'Swapped',
      poster: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTSF5wtLqYgJrada9i_nneLJWtnWe31R6zgAi541ky0bg&s=10',
      genre: 'Drama/Adventure',
      score: null,
      synopsis: 'Humanity. Upgraded.',
    },
    {
      id: 'mermaid',
      title: 'Barbie in a Mermaid Tale',
      poster: 'https://m.media-amazon.com/images/M/MV5BZWMwYWFmMDgtYTAyMy00OWRjLTgxYTEtZWYyZjcwNDNjY2I0XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg',
      genre: 'Drama/Adventure',
      score: null,
      synopsis: 'Humanity. Upgraded.',
    },
  ];

  for (const m of initialMovies) {
    await prisma.movie.upsert({
      where: { id: m.id },
      update: {},
      create: {
        id: m.id,
        title: m.title,
        poster: m.poster,
        genre: m.genre,
        score: m.score,
        synopsis: m.synopsis,
        badge: m.badge ?? null,
        hasBookBtn: m.hasBookBtn ?? false,
      },
    });
  }
  console.log(`✅ Seeded ${initialMovies.length} initial movies.`);

  // 4. Seed Venues
  const initialVenues = [
    {
      id: "v-001",
      name: "CineStar Downtown",
      address: "Sangkat Tonle Bassac, Khan Chamkarmon, Phnom Penh",
      imageUrl: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=600&h=300&fit=crop",
      status: "Active",
    },
    {
      id: "v-002",
      name: "CineStar Riverside",
      address: "Sangkat Chroy Changvar, Khan Chroy Changvar, Phnom Penh",
      imageUrl: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=600&h=300&fit=crop",
      status: "Active",
    },
    {
      id: "v-003",
      name: "CineStar Westgate",
      address: "Sangkat Chaom Chau, Khan Porsenchey, Phnom Penh",
      imageUrl: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=600&h=300&fit=crop",
      status: "Maintenance",
    },
  ];

  for (const v of initialVenues) {
    await prisma.venue.upsert({
      where: { id: v.id },
      update: {
        name: v.name,
        address: v.address,
        imageUrl: v.imageUrl,
        status: v.status,
      },
      create: v,
    });
  }
  console.log(`✅ Seeded ${initialVenues.length} cinema venues.`);

  // 5. Seed 8 Theaters (Halls 1-8) assigned to Venues
  const initialTheaters = [
    { id: 'th-hall-1', venueId: 'v-001', name: 'Hall 1 - Standard', location: 'Floor 2 - East Wing', screenType: 'STANDARD', soundSystem: 'Dolby Atmos', capacity: 150, status: 'Active' },
    { id: 'th-hall-2', venueId: 'v-001', name: 'Hall 2 - Standard', location: 'Floor 2 - West Wing', screenType: 'STANDARD', soundSystem: 'Dolby Atmos', capacity: 140, status: 'Active' },
    { id: 'th-hall-3', venueId: 'v-001', name: 'Hall 3 - IMAX', location: 'Floor 3 - IMAX', screenType: 'IMAX', soundSystem: 'Dolby Atmos', capacity: 180, status: 'Active' },
    { id: 'th-hall-4', venueId: 'v-001', name: 'Hall 4 - 4DX', location: 'Floor 3 - 4DX', screenType: '4DX', soundSystem: 'Dolby Atmos', capacity: 120, status: 'Active' },
    { id: 'th-hall-5', venueId: 'v-002', name: 'Hall 5 - VIP Lounge', location: 'Floor 4 - VIP Lounge', screenType: 'DOLBY', soundSystem: 'Dolby Atmos', capacity: 100, status: 'Active' },
    { id: 'th-hall-6', venueId: 'v-002', name: 'Hall 6 - Dolby Atmos', location: 'Floor 4 - Dolby Atmos', screenType: 'DOLBY', soundSystem: 'Dolby Atmos', capacity: 140, status: 'Active' },
    { id: 'th-hall-7', venueId: 'v-003', name: 'Hall 7 - ScreenX', location: 'Floor 4 - ScreenX', screenType: 'STANDARD', soundSystem: 'THX Certified', capacity: 120, status: 'Active' },
    { id: 'th-hall-8', venueId: 'v-003', name: 'Hall 8 - Laser 2D', location: 'Floor 2 - Central', screenType: '2D', soundSystem: 'THX Certified', capacity: 100, status: 'Active' },
  ];

  for (const t of initialTheaters) {
    await prisma.theater.upsert({
      where: { id: t.id },
      update: {
        venueId: t.venueId,
        name: t.name,
        location: t.location,
        screenType: t.screenType,
        soundSystem: t.soundSystem,
        capacity: t.capacity,
        status: t.status,
      },
      create: t,
    });
  }
  console.log(`✅ Seeded ${initialTheaters.length} theaters/halls.`);

  // 5. Seed Screenings
  const today = new Date().toISOString().slice(0, 10);
  const initialScreenings = [
    { id: 'sc-001', movieId: 'avenger', theaterId: 'th-hall-1', hall: 'Hall 1', format: 'STANDARD', time: '14:30', price: 12, date: today },
    { id: 'sc-002', movieId: 'fairy-secret', theaterId: 'th-hall-2', hall: 'Hall 2', format: 'STANDARD', time: '15:00', price: 12, date: today },
    { id: 'sc-003', movieId: 'avenger', theaterId: 'th-hall-3', hall: 'Hall 3', format: 'IMAX', time: '16:15', price: 18, date: today },
    { id: 'sc-004', movieId: 'jurrasic-echoes', theaterId: 'th-hall-4', hall: 'Hall 4', format: '4DX', time: '17:00', price: 22, date: today },
    { id: 'sc-005', movieId: 'princes', theaterId: 'th-hall-5', hall: 'Hall 5', format: 'VIP', time: '18:30', price: 25, date: today },
    { id: 'sc-006', movieId: 'spider-verse-2', theaterId: 'th-hall-6', hall: 'Hall 6', format: 'DOLBY', time: '19:45', price: 16, date: today },
    { id: 'sc-007', movieId: 'pirate-echoes', theaterId: 'th-hall-7', hall: 'Hall 7', format: 'ScreenX', time: '20:30', price: 15, date: today },
    { id: 'sc-008', movieId: 'avatar', theaterId: 'th-hall-8', hall: 'Hall 8', format: '2D', time: '21:15', price: 12, date: today },
  ];

  for (const s of initialScreenings) {
    await prisma.screening.upsert({
      where: { id: s.id },
      update: {
        movieId: s.movieId,
        theaterId: s.theaterId,
        hall: s.hall,
        format: s.format,
        time: s.time,
        price: s.price,
        date: s.date,
      },
      create: s,
    });
  }
  console.log(`✅ Seeded ${initialScreenings.length} screenings.`);

  // 6. Seed Bookings with dynamic seat allocations (328 seats / 512 capacity = 64% avg occupancy)
  const bookedCounts = [41, 40, 43, 42, 39, 44, 40, 39];
  const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

  for (let i = 0; i < initialScreenings.length; i++) {
    const scr = initialScreenings[i];
    const count = bookedCounts[i];
    const seatList: string[] = [];
    let added = 0;
    for (const r of rows) {
      for (let c = 1; c <= 8; c++) {
        if (added < count) {
          seatList.push(`${r}${c}`);
          added++;
        }
      }
    }

    const bookingId = `bk-seed-${scr.id}`;
    await prisma.booking.upsert({
      where: { id: bookingId },
      update: {
        screeningId: scr.id,
        seats: JSON.stringify(seatList),
        totalPrice: seatList.length * scr.price,
        screeningDate: scr.date,
        screeningTime: scr.time,
        status: 'confirmed',
      },
      create: {
        id: bookingId,
        userId: 'cust-1',
        customerName: 'John Doe',
        movieTitle: scr.movieId,
        screeningId: scr.id,
        screeningDate: scr.date,
        screeningTime: scr.time,
        seats: JSON.stringify(seatList),
        totalPrice: seatList.length * scr.price,
        paymentMethod: 'ABA',
        status: 'confirmed',
      },
    });
  }
  console.log(`✅ Seeded ${initialScreenings.length} confirmed bookings with 64% dynamic occupancy.`);

  console.log('🎉 Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
