const fs = require('fs');
const path = require('path');

const DB_FILE_PATH = path.join(__dirname, '..', 'db_store.json');

try {
  if (fs.existsSync(DB_FILE_PATH)) {
    fs.unlinkSync(DB_FILE_PATH);
    console.log("Existing db_store.json deleted successfully.");
  } else {
    console.log("db_store.json does not exist. Ready for fresh seeding.");
  }
  console.log("Database reset complete. playR will automatically recreate and seed the database on next request.");
} catch (error) {
  console.error("Failed to reseed database:", error);
  process.exit(1);
}
