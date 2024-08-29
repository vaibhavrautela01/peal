const express = require("express");

const mysql = require("mysql2/promise");

const cors = require("cors");

const fs = require("fs");

const path = require("path");


const app = express();


app.use(cors());

app.use(express.json()); 


const mydb = mysql.createPool({host: "localhost", user: "root", password: "root123", database: "aa", });




app.post("/aa", async (req, res) => {

  const { t1, t2, t3 } = req.body;

    const connection = await mydb.getConnection();

    const query = "INSERT INTO aa(title, description, date) VALUES (?, ?, ?)";



    await connection.execute(query, [t1, t2, t3]);

    const selectQuery = "SELECT * FROM aa";

    const [rows] = await connection.execute(selectQuery);

    connection.release();





    const jsonString = JSON.stringify(rows); 

    const filePath = path.join(__dirname, '../frontend/public/aa.json');

    fs.writeFile(filePath, jsonString, "utf8", (err) => {

    });
});






app.post("/delete", async (req, res) => {

  const { id } = req.body; 

    const connection = await mydb.getConnection();

    const query = "DELETE FROM aa WHERE id = ?";



    await connection.execute(query, [id]);

    const selectQuery = "SELECT * FROM aa";

    const [rows] = await connection.execute(selectQuery);

    connection.release();

    


    const jsonString = JSON.stringify(rows); 

    const filePath = path.join(__dirname, '../frontend/public/aa.json');

    fs.writeFile(filePath, jsonString, "utf8", (err) => {


    });
});









app.post("/edit", async (req, res) => {

  const { id, title, description, date } = req.body;

    const connection = await mydb.getConnection();

    const query = "UPDATE aa SET title = ?, description = ?, date = ? WHERE id = ?";



    await connection.execute(query, [title, description, date, id]);

    const selectQuery = "SELECT * FROM aa WHERE id = ?";

    const [rows] = await connection.execute(selectQuery, [id]);

    connection.release();




    const jsonString = JSON.stringify(rows); 

    const filePath = path.join(__dirname, '../frontend/public/aa.json');

    fs.writeFile(filePath, jsonString, "utf8", (err) => {



    });
});






app.listen(3001, () => {
  console.log('Server is listening on port: http://localhost:3001');
});
