require("dotenv").config();
const { Pool } = require("pg");
const fs = require("fs");


// Load the SQL file
const resetSQL = fs.readFileSync(__dirname + "/reset.sql").toString();

// Function to reset the test database
const resetTestDB = async () => {
    try {
        // Initialise a new Pool instance and connect to the db
        const db = new Pool({
            connectionString: process.env.DB_TEST_URL
        });

        // Execute the SQL file -> send the file to the db
        await db.query(resetSQL);

        //  close the connection pool
        await db.end();
        // console.log("TEST DB reset successful");
    } catch(err) {
        console.log("Could not reset TestDB", err);
        throw err;
    }
}


module.exports = { resetTestDB };