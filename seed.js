// seed.js
// =============================================================================
//  Seed the database with realistic test data.
//  Run with: npm run seed
//
//  Required minimum:
//    - 2 users
//    - 4 projects (split across the users)
//    - 5 tasks (with embedded subtasks and tags arrays)
//    - 5 notes (some attached to projects, some standalone)
//
//  Use the bcrypt module to hash passwords before inserting users.
//  Use ObjectId references for relationships (projectId, ownerId).
// =============================================================================

require('dotenv').config();
const bcrypt = require('bcryptjs');
const { connect } = require('./db/connection');

(async () => {
  const db = await connect();

  // OPTIONAL: clear existing data so re-seeding is idempotent
  await db.collection('users').deleteMany({});
  await db.collection('projects').deleteMany({});
  await db.collection('tasks').deleteMany({});
  await db.collection('notes').deleteMany({});

  // =============================================================================
  // --- USERS ---
  const hash = await bcrypt.hash('password123', 10);

  const u1 = await db.collection('users').insertOne({
    email: 'alice@example.com',
    passwordHash: hash,
    name: 'Alice Khan',
    createdAt: new Date()
  });
  const u2 = await db.collection('users').insertOne({
    email: 'bob@example.com',
    passwordHash: hash,
    name: 'Bob Malik',
    createdAt: new Date()
  });
  const aliceId = u1.insertedId;
  const bobId = u2.insertedId;

  // --- PROJECTS ---
  const p1 = await db.collection('projects').insertOne({
    ownerId: aliceId,
    name: 'Final Year Project',
    description: 'ML-based recommendation system',
    archived: false,
    createdAt: new Date('2026-01-01')
  });
  const p2 = await db.collection('projects').insertOne({
    ownerId: aliceId,
    name: 'Web Dev Coursework',
    description: 'NoSQL productivity hub lab',
    archived: false,
    createdAt: new Date('2026-03-01')
  });
  const p3 = await db.collection('projects').insertOne({
    ownerId: aliceId,
    name: 'Old Hobby Blog',
    description: 'Abandoned blog project',
    archived: true,
    createdAt: new Date('2025-06-01')
  });
  const p4 = await db.collection('projects').insertOne({
    ownerId: bobId,
    name: "Bob's Research Thesis",
    description: 'NLP-based sentiment analysis',
    archived: false,
    createdAt: new Date('2026-02-01')
  });

  const fypId = p1.insertedId;
  const webId = p2.insertedId;
  const bobPrId = p4.insertedId;

  // --- TASKS ---
  await db.collection('tasks').insertMany([
    {
      ownerId: aliceId,
      projectId: fypId,
      title: 'Write literature review',
      status: 'done',
      priority: 3,
      tags: ['research', 'writing'],
      subtasks: [
        { title: 'Find 10 relevant papers', done: true },
        { title: 'Summarise each paper', done: true }
      ],
      dueDate: new Date('2026-02-15'),
      createdAt: new Date('2026-01-10')
    },
    {
      ownerId: aliceId,
      projectId: fypId,
      title: 'Train baseline ML model',
      status: 'in-progress',
      priority: 2,
      tags: ['ml', 'code'],
      subtasks: [
        { title: 'Prepare dataset', done: true },
        { title: 'Run training script', done: false }
      ],
      dueDate: new Date('2026-04-30'),
      createdAt: new Date('2026-02-01')
    },
    {
      ownerId: aliceId,
      projectId: fypId,
      title: 'Write final report',
      status: 'todo',
      priority: 3,
      tags: ['writing'],
      subtasks: [
        { title: 'Draft introduction', done: false },
        { title: 'Draft conclusion', done: false }
      ],
      createdAt: new Date('2026-03-01')
    },
    {
      ownerId: aliceId,
      projectId: webId,
      title: 'Implement all 15 MongoDB queries',
      status: 'in-progress',
      priority: 3,
      tags: ['code', 'db'],
      subtasks: [
        { title: 'Read lab manual', done: true },
        { title: 'Write seed.js', done: false }
      ],
      // no dueDate
      createdAt: new Date('2026-04-20')
    },
    {
      ownerId: aliceId,
      projectId: webId,
      title: 'Take screenshots for submission',
      status: 'todo',
      priority: 1,
      tags: ['submission'],
      subtasks: [
        { title: 'Screenshot dashboard', done: false },
        { title: 'Screenshot aggregation', done: false }
      ],
      // no dueDate
      createdAt: new Date('2026-04-22')
    },
    {
      ownerId: bobId,
      projectId: bobPrId,
      title: 'Collect survey responses',
      status: 'todo',
      priority: 2,
      tags: ['research', 'data'],
      subtasks: [
        { title: 'Design survey form', done: false },
        { title: 'Distribute to 50 participants', done: false }
      ],
      dueDate: new Date('2026-05-10'),
      createdAt: new Date('2026-03-15')
    }
  ]);

  // --- NOTES ---
  await db.collection('notes').insertMany([
    {
      ownerId: aliceId,
      projectId: fypId,
      title: 'Supervisor meeting — Jan',
      body: 'Discussed project scope and timeline with supervisor.',
      tags: ['meeting', 'fyp'],
      createdAt: new Date('2026-01-15')
    },
    {
      ownerId: aliceId,
      projectId: fypId,
      title: 'Paper summary: BERT',
      body: 'BERT uses transformer encoder. Fine-tuning beats feature extraction.',
      tags: ['research', 'ml'],
      createdAt: new Date('2026-01-20')
    },
    {
      ownerId: aliceId,
      projectId: webId,
      title: 'MongoDB cheat sheet',
      body: '$lookup is the NoSQL equivalent of SQL JOIN. $addToSet prevents duplicates.',
      tags: ['db', 'reference'],
      createdAt: new Date('2026-04-21')
    },
    {
      ownerId: aliceId,
      // no projectId
      title: 'Book reading list',
      body: 'Clean Code, Designing Data-Intensive Applications, The Pragmatic Programmer.',
      tags: ['reading', 'reference'],
      createdAt: new Date('2026-02-10')
    },
    {
      ownerId: aliceId,
      // no projectId
      title: 'Random app idea',
      body: 'Build a habit tracker with streak counters and reminders.',
      tags: ['idea'],
      createdAt: new Date('2026-03-05')
    },
    {
      ownerId: bobId,
      projectId: bobPrId,
      title: 'Thesis chapter outline',
      body: 'Ch1: Intro. Ch2: Related Work. Ch3: Methodology. Ch4: Results.',
      tags: ['writing', 'research'],
      createdAt: new Date('2026-03-20')
    }
  ]);

  console.log('Seed complete! Users, projects, tasks, and notes inserted.');
  process.exit(0);
  // =============================================================================
})();
