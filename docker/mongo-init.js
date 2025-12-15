// Initialize sample data in labdb.tournaments
const db = db.getSiblingDB('labdb');

db.tournaments.insertMany([
  { name: 'Summer Cup', description: 'Local summer tournament', date: '2025-06-20', participants: 16 },
  { name: 'Winter Clash', description: 'Year-end championship', date: '2025-12-10', participants: 32 }
]);
