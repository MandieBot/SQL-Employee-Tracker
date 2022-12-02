//this will handle all of the database functionality

const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",
  // MySQL username,
  user: "root",
  // MySQL password
  password: "",
  database: "company_db",
});
