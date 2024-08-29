const express = require("express");
const mysql = require("mysql2/promise");
const cors = require("cors");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path"); // Import the path module

const app = express();

// Middleware
app.use(cors());

app.use(bodyParser.json());

// MySQL Connection

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "root123",
  database: "quizmaker",
});

// Route to handle registration POST request from React

app.post("/stulogin", async (req, res) => {
  const {
    t1,
    t2,
    t3,
    t4,
    t5,
    t6,
    t7,
    t8,
    t9,
    t10,
    t11,
    t12,
    t13,
    t14,
    t15,
    t16,
    t17,
    t18,
    t19,
  } = req.body;

  try {
    const connection = await pool.getConnection();
    const query =
      "INSERT INTO stulogin( firstname, lastname, dob, gender, studentId, password,highSchool, collage, nationality,street, city, state, zip, code, country, phone, email, plan, req ) VALUES (?, ?, ?, ?, ?, ?, ?,?, ?, ?, ?, ?, ?, ?,?,?,?,?,?)";
    await connection.execute(query, [
      t1,
      t2,
      t3,
      t4,
      t5,
      t6,
      t7,
      t8,
      t9,
      t10,
      t11,
      t12,
      t13,
      t14,
      t15,
      t16,
      t17,
      t18,
      t19,
    ]);
    connection.release();
    res.send("Data saved successfully");
  } catch (err) {
    console.error(err);
    res.status(500).send("Database error" + err);
  }
});

app.post("/student", async (req, res) => {
  const { t1, t2 } = req.body;

  if (!t1 || !t2) {
    return res.status(400).send("Missing required parameters: t1 or t2");
  }

  try {
    const connection = await pool.getConnection();
    const query = "SELECT * FROM stulogin WHERE studentID = ? AND password = ? ";
    /*AND req = 'Success'";*/
    const [rows] = await connection.execute(query, [t1, t2]);
    
    connection.release();

    const jsonString = JSON.stringify(rows);
    const filePath = path.join(__dirname, "../frontend/public/Student.json");

    fs.writeFile(filePath, jsonString, "utf8", (err) => {
      if (err) {
        console.error("Error writing file:", err);
        return res.status(500).send("Error writing file: " + err);
      }
      console.log("JSON data has been saved to", filePath);
    });

    if (rows.length > 0) {
      return res.status(200).json({ message: "Login successful" });
    } else {
      return res.status(401).json({ message: "Invalid Username and Password" });
    }
  } catch (err) {
    console.error("Database error:", err);
    return res.status(500).send("Database error: " + err);
  }
});


app.post("/university", async (req, res) => {
  const { t1, t2 } = req.body;

  try {
    const connection = await pool.getConnection();
    const query =
      "SELECT * FROM unilogin WHERE instituteID = ? AND password = ?";
    const [rows] = await connection.execute(query, [t1, t2]);

    const subscription_end = new Date(rows[0].plandate);
    const currentDate = new Date();
    console.log("Current Date: " + currentDate);
    console.log("Expire Date: " + subscription_end);

    // connection.release();

    const jsonString = JSON.stringify(rows);
    const filePath = path.join(__dirname, "../frontend/public/University.json");

    fs.writeFile(filePath, jsonString, "utf8", (err) => {
      if (err) {
        console.error("Error writing file:", err);
        connection.release();
        return res.status(500).send("Error writing file: " + err);
      }
      console.log("JSON data has been saved to", filePath);
      if (subscription_end > currentDate) {
        connection.release();
        console.log("Subscripted....");
        return res.json({ status: "valid" });
      } else {
        connection.release();
        console.log("Please Suscribe...");
        return res.json({ status: "expired" });
      }
    });
  } catch (err) {
    if (connection) connection.release();
    console.error(err);
    return res.status(500).json({ message: "Database error: " + err });
  }
});

app.post("/unilogin", async (req, res) => {
  const { t1, t2, t3, t4, t5, t6, t7, t8, t9, t10, t11, t12, t13 } = req.body;

  try {
    const connection = await pool.getConnection();
    const query =
      "INSERT INTO unilogin(institute, instituteID, password, street , city, state, country, email, programlist, chansllor, year, plan, plandate) VALUES (?, ?, ?, ?, ?, ?, ?,?, ?, ?, ?, ?, ?)";
    await connection.execute(query, [
      t1,
      t2,
      t3,
      t4,
      t5,
      t6,
      t7,
      t8,
      t9,
      t10,
      t11,
      t12,
      t13,
    ]);
    connection.release();
    res.send("Data saved successfully");
  } catch (err) {
    console.error(err);
    res.status(500).send("Database error" + err);
  }
});

app.post("/question", async (req, res) => {
  const { t1, t2, t3, t4, t5, t6, t7, t8, t9, t10, t11, t12, t13, t14 } = req.body;

  try {
    const connection = await pool.getConnection();
    const query =
      "INSERT INTO queform(firstname, lastname, admin, subject, subcode, section, question, option1, option2, option3, option4, answer, uniID) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    await connection.execute(query, [
      t1,
      t2,
      t3,
      t4,
      t5,
      t6,
      t7,
      t8,
      t9,
      t10,
      t11,
      t12,
      t13,
    ]);

    const selectQuery = "SELECT * FROM queform WHERE uniID = ?";
    const [rows] = await connection.execute(selectQuery, [t13]);

    connection.release();

    // Respond with success message
    res.status(200).send({ message: "Data inserted successfully" });

    // Write the JSON data to the file
    const jsonString = JSON.stringify(rows);
    const filePath = "../frontend/public/question.json";
    fs.writeFile(filePath, jsonString, "utf8", (err) => {
      if (err) {
        console.error("Error writing file:", err);
        return;
      }
      console.log("JSON data has been saved to", filePath);
    });
  } catch (err) {
    console.error("Error processing request:", err);
    res.status(500).send("Internal server error");
  }
});




app.post("/sliver", async (req, res) => {
  try {
    console.log("Request Body:", req.body);
    
    let { t1, t2, t3 } = req.body;

    // Convert t1, t2, t3 to numbers
    t1 = parseInt(t1, 10);
    t2 = parseInt(t2, 10);
    t3 = parseInt(t3, 10);

    // Validate t1, t2, t3 to ensure they are numbers
    if (isNaN(t1) || isNaN(t2) || isNaN(t3)) {
      throw new Error("Invalid value for t1, t2, or t3");
    }

    const now = new Date();
    let daysToAdd = 0;

    // Determine daysToAdd based on t1, t2, t3
    if (t1 === 499) {
      daysToAdd = 30;
    } else if (t1 === 999) {
      daysToAdd = 60;
    } else if (t1 === 1999) {
      daysToAdd = 90;
    } else {
      throw new Error("Unexpected t1 value");
    }

    // Calculate the end date
    const millisecondsInADay = 24 * 60 * 60 * 1000;
    const endDate = new Date(now.getTime() + (daysToAdd * millisecondsInADay));

    // Format the end date to YYYY-MM-DD
    const enddatee = endDate.toISOString().split('T')[0];
    
    // Format the end time
    const endTime = endDate.toLocaleTimeString('en-US', { hour12: true });

    console.log("End Date:", enddatee);
    console.log("End Time:", endTime);

    // Send back the response
    res.json({ endDate: enddatee, endTime });

  } catch (error) {
    console.error("Error in /sliver endpoint:", error);
    res.status(500).json({ error: "An unexpected error occurred." });
  }
});



  




app.post("/gold", async (req, res) => {
  const { t2 } = req.body;

  try {
    const connection = await pool.getConnection();

    const today = new Date();
    today.setDate(today.getDate() + 45);
    const date = today.toISOString().split("T")[0];

    const insertQuery = "INSERT INTO plansec (plan, plandate) VALUES (?,?)";
    await connection.execute(insertQuery, [t2, date]);

    const selectQuery = "SELECT * FROM plansec";
    const [rows, fields] = await connection.execute(selectQuery);

    connection.release();

    // Respond with success message
    res.status(200).send({ message: "Data inserted successfully" });

    // Write the JSON data to the file
    const jsonString = JSON.stringify(rows);
    const filePath = "../frontend/public/plan.json";
    fs.writeFile(filePath, jsonString, "utf8", (err) => {
      if (err) {
        console.error("Error writing file:", err);
        return;
      }
      console.log("JSON data has been saved to", filePath);
    });
    const deleteQuery = "DELETE FROM plansec";
    await connection.execute(deleteQuery);
  } catch (err) {
    console.error("Error processing request:", err);
    res.status(500).send("Internal server error");
  }
});

app.post("/plat", async (req, res) => {
  const { t3 } = req.body;

  try {
    const connection = await pool.getConnection();

    const today = new Date();
    today.setDate(today.getDate() + 60);
    const date = today.toISOString().split("T")[0];

    const insertQuery = "INSERT INTO plansec (plan,plandate) VALUES (?,?)";
    await connection.execute(insertQuery, [t3, date]);

    const selectQuery = "SELECT * FROM plansec";
    const [rows, fields] = await connection.execute(selectQuery);

    connection.release();

    // Respond with success message
    res.status(200).send({ message: "Data inserted successfully" });

    // Write the JSON data to the file
    const jsonString = JSON.stringify(rows);
    const filePath = "../frontend/public/plan.json";
    fs.writeFile(filePath, jsonString, "utf8", (err) => {
      if (err) {
        console.error("Error writing file:", err);
        return;
      }
      console.log("JSON data has been saved to", filePath);
    });
    const deleteQuery = "DELETE FROM plansec";
    await connection.execute(deleteQuery);
  } catch (err) {
    console.error("Error processing request:", err);
    res.status(500).send("Internal server error");
  }
});

app.post("/plan1", async (req, res) => {
  const { t1 } = req.body;

  try {
    const connection = await pool.getConnection();

    const today = new Date();
    today.setDate(today.getDate() + 31);
    const date = today.toISOString().split("T")[0];

    const insertQuery = "INSERT INTO stuplan (plan, plandate) VALUES (?,?)";
    await connection.execute(insertQuery, [t1, date]);

    const selectQuery = "SELECT * FROM stuplan";
    const [rows, fields] = await connection.execute(selectQuery);

    connection.release();

    // Respond with success message
    res.status(200).send({ message: "Data inserted successfully" });

    // Write the JSON data to the file
    const jsonString = JSON.stringify(rows);
    const filePath = "../frontend/public/stuplan.json";
    fs.writeFile(filePath, jsonString, "utf8", (err) => {
      if (err) {
        console.error("Error writing file:", err);
        return;
      }
      console.log("JSON data has been saved to", filePath);
    });
    const deleteQuery = "DELETE FROM stuplan";
    await connection.execute(deleteQuery);
  } catch (err) {
    console.error("Error processing request:", err);
    res.status(500).send("Internal server error");
  }
});

app.post("/plan2", async (req, res) => {
  const { t2 } = req.body;

  try {
    const connection = await pool.getConnection();

    const today = new Date();
    today.setDate(today.getDate() + 45);
    const date = today.toISOString().split("T")[0];

    const insertQuery = "INSERT INTO stuplan (plan, plandate) VALUES (?,?)";
    await connection.execute(insertQuery, [t2, date]);

    const selectQuery = "SELECT * FROM stuplan";
    const [rows, fields] = await connection.execute(selectQuery);

    connection.release();

    // Respond with success message
    res.status(200).send({ message: "Data inserted successfully" });

    // Write the JSON data to the file
    const jsonString = JSON.stringify(rows);
    const filePath = "../frontend/public/stuplan.json";
    fs.writeFile(filePath, jsonString, "utf8", (err) => {
      if (err) {
        console.error("Error writing file:", err);
        return;
      }
      console.log("JSON data has been saved to", filePath);
    });
    const deleteQuery = "DELETE FROM stuplan";
    await connection.execute(deleteQuery);
  } catch (err) {
    console.error("Error processing request:", err);
    res.status(500).send("Internal server error");
  }
});

app.post("/plan3", async (req, res) => {
  const { t3 } = req.body;

  try {
    const connection = await pool.getConnection();

    const today = new Date();
    today.setDate(today.getDate() + 60);
    const date = today.toISOString().split("T")[0];

    const insertQuery = "INSERT INTO stuplan (plan,plandate) VALUES (?,?)";
    await connection.execute(insertQuery, [t3, date]);

    const selectQuery = "SELECT * FROM stuplan";
    const [rows, fields] = await connection.execute(selectQuery);

    connection.release();

    // Respond with success message
    res.status(200).send({ message: "Data inserted successfully" });

    // Write the JSON data to the file
    const jsonString = JSON.stringify(rows);
    const filePath = "../frontend/public/stuplan.json";
    fs.writeFile(filePath, jsonString, "utf8", (err) => {
      if (err) {
        console.error("Error writing file:", err);
        return;
      }
      console.log("JSON data has been saved to", filePath);
    });
    const deleteQuery = "DELETE FROM stuplan";
    await connection.execute(deleteQuery);
  } catch (err) {
    console.error("Error processing request:", err);
    res.status(500).send("Internal server error");
  }
});

app.post("/pending", async (req, res) => {
  const t1 = "Pending";
  try {
    const connection = await pool.getConnection();
    const query = "SELECT * FROM stulogin WHERE req = ?";
    const [rows] = await connection.execute(query, [t1]);
    connection.release();

    const jsonString = JSON.stringify(rows);
    const filePath = path.join(__dirname, "../frontend/public/stuplan.json");

    fs.writeFile(filePath, jsonString, "utf8", (err) => {
      if (err) {
        console.error("Error writing file:", err);
        return;
      }
      console.log("JSON data has been saved to", filePath);
    });

    res.status(200).send("Success");
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).send("Database error: " + err);
  }
});

app.post("/updatestatus", async (req, res) => {
  const { t1 } = req.body;
  try {
    const connection = await pool.getConnection();
    
    const query = 'UPDATE stulogin SET req = "Success" WHERE studentID = ?';
    await connection.execute(query, [t1]);

    const [rows] = await connection.execute("SELECT * FROM stulogin WHERE req = 'Success'");
    const [rows2] = await connection.execute("SELECT * FROM stulogin WHERE req = 'Pending'");

    const query2 = "SELECT * FROM stulogin WHERE studentID = ? and req = 'Pending'";
    const [rows3] = await connection.execute(query2, [t1]);

    connection.release();

    const jsonString = JSON.stringify(rows);
    const filePath = path.join(__dirname, "../frontend/public/Active.json");

    const jsonString2 = JSON.stringify(rows2);
    const filePath2 = path.join(__dirname, "../frontend/public/Deactive.json");

    const jsonString3 = JSON.stringify(rows3); // Corrected to use rows3
    const filePath3 = path.join(__dirname, "../frontend/public/Stuplan.json");

    // Write all JSON files asynchronously
    fs.writeFile(filePath, jsonString, "utf8", (err) => {
      if (err) {
        console.error("Error writing Active.json:", err);
        return res.status(500).send("Error writing Active.json: " + err);
      }
      console.log("JSON data has been saved to", filePath);

      fs.writeFile(filePath2, jsonString2, "utf8", (err) => {
        if (err) {
          console.error("Error writing Deactive.json:", err);
          return res.status(500).send("Error writing Deactive.json: " + err);
        }
        console.log("JSON data has been saved to", filePath2);

        fs.writeFile(filePath3, jsonString3, "utf8", (err) => {
          if (err) {
            console.error("Error writing Student.json:", err);
            return res.status(500).send("Error writing Student.json: " + err);
          }
          console.log("JSON data has been saved to", filePath3);
          res.send("Update successful");
        });
      });
    });

  } catch (err) {
    console.error("Error processing request:", err);
    res.status(500).send("Database error: " + err);
  }
});



app.post("/sectionA", async (req, res) => {
  try {
    t1 = "Section A";
    const connection = await pool.getConnection();
    const query = "SELECT * FROM queform WHERE section = ?";
    const [rows] = await connection.execute(query, [t1]);
    connection.release();

    const jsonString = JSON.stringify(rows);
    const filePath = path.join(__dirname, "../frontend/public/SectionA.json");

    fs.writeFile(filePath, jsonString, "utf8", (err) => {
      if (err) {
        console.error("Error writing file:", err);
        return;
      }
      console.log("JSON data has been saved to", filePath);
    });

    res.status(200).send("Success");
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).send("Database error: " + err);
  }
});

app.post("/sectionB", async (req, res) => {
  try {
    t1 = "Section B";
    const connection = await pool.getConnection();
    const query = "SELECT * FROM queform WHERE section = ?";
    const [rows] = await connection.execute(query, [t1]);
    connection.release();

    const jsonString = JSON.stringify(rows);
    const filePath = path.join(__dirname, "../frontend/public/SectionB.json");

    fs.writeFile(filePath, jsonString, "utf8", (err) => {
      if (err) {
        console.error("Error writing file:", err);
        return;
      }
      console.log("JSON data has been saved to", filePath);
    });

    res.status(200).send("Success");
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).send("Database error: " + err);
  }
});

app.post("/sectionC", async (req, res) => {
  try {
    t1 = "Section C";
    const connection = await pool.getConnection();
    const query = "SELECT * FROM queform WHERE section = ?";
    const [rows] = await connection.execute(query, [t1]);
    connection.release();

    const jsonString = JSON.stringify(rows);
    const filePath = path.join(__dirname, "../frontend/public/SectionC.json");

    fs.writeFile(filePath, jsonString, "utf8", (err) => {
      if (err) {
        console.error("Error writing file:", err);
        return;
      }
      console.log("JSON data has been saved to", filePath);
    });

    res.status(200).send("Success");
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).send("Database error: " + err);
  }
});

app.post("/resetpassword", async (req, res) => {
  const { t1, t2 } = req.body;

  try {
    const connection = await pool.getConnection();
    const query = "UPDATE unilogin SET password = ? WHERE instituteID = ?";
    await connection.execute(query, [t2, t1]);
    connection.release();
    res.status(200).send("Success");
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).send("Database error occurred");
  }
});

app.post("/editprofile", async (req, res) => {
  const { t1, t3, t4, t5, t6, t7, t8, t9, t10, t11, t12, t13, t } = req.body;
  try {
    const connection = await pool.getConnection();
    const query = `UPDATE unilogin SET institute = ? , password=?, street=?, city=?, state=?, country=?, email=?, programlist=?, chansllor=?, year=?, plan=?, plandate=?   WHERE instituteID = ?`;
    await connection.execute(query, [
      t1,
      t3,
      t4,
      t5,
      t6,
      t7,
      t8,
      t9,
      t10,
      t11,
      t12,
      t13,
      t,
    ]);
    connection.release();
    res.status(200).send("Success");
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).send("Database error occurred");
  }
});

app.post("/Sturesetpass", async (req, res) => {
  const { t1, t2 } = req.body;

  try {
    const connection = await pool.getConnection();
    const query = "UPDATE stulogin SET password = ? WHERE studentID = ?";
    await connection.execute(query, [t2, t1]);
    connection.release();
    res.status(200).send("Success");
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).send("Database error occurred");
  }
});

app.post("/Stuedit", async (req, res) => {
  const {
    t1,
    t2,
    t3,
    t4,
    t5,
    t6,
    t7,
    t8,
    t9,
    t10,
    t11,
    t12,
    t13,
    t14,
    t15,
    t16,
    t17,
    t18,
    t19,
  } = req.body;
  try {
    const connection = await pool.getConnection();
    const query = `UPDATE stulogin SET firstname = ? , lastname=?, dob=?, gender=?, password=?, highschool=?, collage=?, nationality=?, street=?, city=?, state=?, zip=?, code=?, country=?, phone=?, email=?, plan=?, req=?  WHERE studentID = ?`;
    await connection.execute(query, [
      t1,
      t2,
      t3,
      t4,
      t5,
      t6,
      t7,
      t8,
      t9,
      t10,
      t11,
      t12,
      t13,
      t14,
      t15,
      t16,
      t17,
      t18,
      t19,
    ]);
    connection.release();
    res.status(200).send("Success");
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).send("Database error occurred");
  }
});

app.post("/p", async (req, res) => {
  const currentDate = new Date();

  const { t1,t3,t4,t5,correctCount, wrongCount, totalAttempt } = req.body;

  try {
    const connection = await pool.getConnection();
    const query =
      "INSERT INTO answer(name,admin,subject,subcode,totalmarks, attempt, wrong,date,studentID) VALUES (?, ?, ?,?,?,?,?,?,?)";
    await connection.execute(query, [t1,t3,t4,t5,correctCount, totalAttempt, wrongCount,currentDate,studentID]);
    connection.release();
    res.send("Data saved successfully");
    
  } catch (err) {
    console.error(err);
    res.status(500).send("Database error: " + err);
  }
});

app.post("/delete", async (req, res) => {
  const { id } = req.body;

  try {
    const connection = await pool.getConnection();
    const deleteQuery = "DELETE FROM queform WHERE id = ?";
    await connection.execute(deleteQuery, [id]);

    // Fetch the updated data from the database
    const selectQuery = "SELECT * FROM queform";
    const [rows] = await connection.execute(selectQuery,[id]);
    connection.release();

    // Convert the result to JSON
    const jsonString = JSON.stringify(rows, null, 2);
    const filePath = path.join(__dirname, "../frontend/public/question.json");

    // Write the updated data to the JSON file
    fs.writeFile(filePath, jsonString, "utf8", (err) => {
      if (err) {
        console.error("Error writing file:", err);
        return res.status(500).send("Error writing JSON file: " + err);
      }
      console.log("JSON data has been saved to", filePath);
      res.send("Question deleted successfully and JSON updated");
    });

  } catch (err) {
    console.error("Error processing request:", err);
    res.status(500).send("Database error: " + err);
  }
});


app.post("/deleteall", async (req, res) => {
  const { t1,t2} = req.body;

  try {
    const connection = await pool.getConnection();

    try {
      // Delete the record from the database
      const deleteQuery = "DELETE FROM queform WHERE subcode = ?";
      await connection.execute(deleteQuery, [t1]);

      // Fetch the updated records
      const selectQuery = "SELECT * FROM queform WHERE uniID = ?";
      const [rows] = await connection.execute(selectQuery,[t2]);

      // Release the database connection
      connection.release();

      // Convert the result to JSON
      const jsonString = JSON.stringify(rows, null, 2);
      const filePath = path.join(__dirname, "../frontend/public/question.json");

      // Write the updated data to the JSON file
      fs.writeFile(filePath, jsonString, "utf8", async (err) => {
        if (err) {
          console.error("Error writing file:", err);
          return res.status(500).send("Error writing JSON file: " + err);
        }
        console.log("JSON data has been saved to", filePath);
        res.send("Question deleted successfully and JSON updated");
      });

    } catch (dbErr) {
      // Ensure connection release in case of a query error
      connection.release();
      console.error("Error executing query:", dbErr);
      res.status(500).send("Database error: " + dbErr);
    }

  } catch (connErr) {
    console.error("Error establishing connection:", connErr);
    res.status(500).send("Database connection error: " + connErr);
  }
});




app.post('/edit', async (req, res) => {
  const { id, subject, subcode, question, option1, option2, option3, option4 } = req.body;

  try {
    const connection = await pool.getConnection();
    const updateQuery = `UPDATE queform SET subject = ?, subcode = ?, question = ?, option1 = ?, option2 = ?, option3 = ?, option4 = ? WHERE id = ?`;
    await connection.execute(updateQuery, [subject, subcode, question, option1, option2, option3, option4, id]);

    const selectQuery = "SELECT * FROM queform";
    const [rows] = await connection.execute(selectQuery);
    connection.release();

    const jsonString = JSON.stringify(rows, null, 2);
    const filePath = path.join(__dirname, "../frontend/public/question.json");

    fs.writeFile(filePath, jsonString, "utf8", (err) => {
      if (err) {
        console.error("Error writing file:", err);
        return res.status(500).send("Error writing JSON file: " + err);
      }
      console.log("JSON data has been saved to", filePath);
      res.send("Question edited successfully and JSON updated");
    });

  } catch (err) {
    console.error("Error processing request:", err);
    res.status(500).send("Database error: " + err);
  }
});
// Import the PayPal SDK
const paypal = require('@paypal/checkout-server-sdk');

// Your existing code
const environment = new paypal.core.SandboxEnvironment(
  'AZyoxyrfqASmjMspbP3Cn68gcpww9l7JsBR9oCfBMkmJIUfPYLx8mp59YQ_Pk7kOTXqbMEv_pIZQ5eQ2'
);

const client = new paypal.core.PayPalHttpClient(environment);

app.post('/create-order', async (req, res) => {
  const { amount } = req.body;

  const request = new paypal.orders.OrdersCreateRequest();
  request.requestBody({
    intent: 'CAPTURE',
    purchase_units: [{
      amount: {
        currency_code: 'USD',
        value: amount,
      },
    }],
  });

  try {
    const response = await client.execute(request);
    res.status(200).json({ orderId: response.result.id });
  } catch (error) {
    console.error('Error creating PayPal order:', error);
    res.status(500).json({ error: 'Failed to create PayPal order.' });
  }
});


app.post('/api/transaction', async (req, res) => {
  try {
    let { orderId, amount, payerEmail, status } = req.body;

    // Ensure amount is an integer
    amount = parseInt(amount, 10);

    if (isNaN(amount)) {
      throw new Error("Invalid amount value. It should be a number.");
    }

    const now = new Date();
    const todayDate = now.toISOString().split('T')[0]; // Format to YYYY-MM-DD
    

    let daysToAdd = 0;
    if (amount === 499) {
      daysToAdd = 30;
    } else if (amount === 999) {
      daysToAdd = 60;
    } else if (amount === 1999) {
      daysToAdd = 90;
    } else {
      throw new Error("Unexpected amount value");
    }

    // Correctly calculate the end date by adding days
    const millisecondsInADay = 24 * 60 * 60 * 1000;
    const endDate = new Date(now.getTime() + (daysToAdd * millisecondsInADay));
    
    // Format the end date to YYYY-MM-DD
    const enddatee = endDate.toISOString().split('T')[0];
    
    // Format the end time (current time of endDate)
    const endTime = endDate.toLocaleTimeString('en-US', { hour12: true });

    const connection = await pool.getConnection();

    try {
      // Insert transaction details into the database
      const transactionQuery = `
        INSERT INTO transistion (orderId, plan, payerEmail, status, plandate, plantime, endplan) 
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `;

      await connection.execute(transactionQuery, [orderId, amount, payerEmail, status, todayDate, endTime, enddatee]);

      const planSecQuery = `
        INSERT INTO plansec (plan, plandate) 
        VALUES (?, ?)
      `;
      await connection.execute(planSecQuery, [amount, enddatee]);

      const selectPlanSecQuery = "SELECT * FROM plansec";
      const [planSecRows] = await connection.execute(selectPlanSecQuery);
      const planSecJsonPath = "../frontend/public/plan.json";
      fs.writeFileSync(planSecJsonPath, JSON.stringify(planSecRows), "utf8");
      console.log("PlanSec JSON data has been saved to", planSecJsonPath);

      // Retrieve and save transaction data
      const selectTransactionQuery = "SELECT * FROM transistion";
      const [transactionRows] = await connection.execute(selectTransactionQuery);
      const transactionJsonPath = "../frontend/public/transistion.json";
      fs.writeFileSync(transactionJsonPath, JSON.stringify(transactionRows), "utf8");
      console.log("Transaction JSON data has been saved to", transactionJsonPath);

      const deletePlanSecQuery = "DELETE FROM plansec";
      await connection.execute(deletePlanSecQuery);

    } catch (dbError) {
      console.error("Database operation error:", dbError);
      res.status(500).send("Database operation failed");
      return; 
    } finally {
      connection.release();
    }

    // Respond with success message
    res.status(200).send({ message: "Data inserted successfully" });

  } catch (err) {
    console.error("Error processing request:", err);
    res.status(500).send("Internal server error");
  }
});






































const multer = require('multer');
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Set up multer storage
const storage = multer.diskStorage({
  destination: path.join(__dirname, 'uploads'),
  filename: (req, file, cb) => {
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({ storage });

// Middleware to parse JSON bodies
app.use(express.json());

// Upload route
app.post('/upload', upload.single('note'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const filename = req.file.filename;
  const filePath = req.file.path;
  const chapter = req.body.chapter; // Assuming chapter data is sent in the body

  // Insert file information into the database
  try {
    const query = 'INSERT INTO notes (filename, filePath, units) VALUES (?, ?, ?)';
    await pool.query(query, [filename, filePath, chapter]);
    res.json({ message: 'File uploaded successfully' });
  } catch (err) {
    console.error('Error saving file info to the database:', err);
    res.status(500).json({ error: 'Failed to save file info' });
  }
});

// Fetch notes route
app.get('/notes', async (req, res) => {
  try {
    const [results] = await pool.query('SELECT * FROM notes');
    res.json(results);
  } catch (err) {
    console.error('Error fetching notes from the database:', err);
    res.status(500).json({ error: 'Failed to fetch notes' });
  }
});






app.delete('/notes/:filename', (req, res) => {
  const filename = req.params.filename;
  console.log(`Attempting to delete note with filename: ${filename}`);

  const query = 'DELETE FROM notes WHERE filename = ?';

  pool.query(query, [filename], (err, result) => {
    if (err) {
      console.error('Error executing query:', err);
      return res.status(500).json({ error: 'Failed to delete the note' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Note not found' });
    }

    console.log('Note deleted successfully');
    res.json({ message: 'Note deleted successfully' });
  });
});





app.post("/admin", async (req, res) => {
  const { t1, t2 } = req.body;

  if (!t1 || !t2) {
    return res.status(400).send("Missing required parameters: t1 or t2");
  }

  try {
    const connection = await pool.getConnection();
    const query = "SELECT * FROM admin WHERE username = ? AND password = ?";
    const [rows] = await connection.execute(query, [t1, t2]);
    
    connection.release();

    const jsonString = JSON.stringify(rows);
    const filePath = path.join(__dirname, "../frontend/public/admin.json");

    fs.writeFile(filePath, jsonString, "utf8", (err) => {
      if (err) {
        console.error("Error writing file:", err);
        return res.status(500).send("Error writing file: " + err);
      }
      console.log("JSON data has been saved to", filePath);
    });

    if (rows.length > 0) {
      return res.status(200).json({ message: "Login successful" });
    } else {
      return res.status(401).json({ message: "Invalid Username and Password" });
    }
  } catch (err) {
    console.error("Database error:", err);
    return res.status(500).send("Database error: " + err);
  }
});





const port = 3001;
app.listen(port, () => {
  console.log(`Server is listening on port: http://localhost:${port}`);
});
