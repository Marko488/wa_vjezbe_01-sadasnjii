import express from "express";
const app = express();
const PORT = 3000;

app.get("/", (req, res) => res.send("Hello Pantera!"));

app.listen(PORT, (error) => {
  if (error) {
    console.log(`Greska u pokretanju servera ${error.message}`);
  } else {
    console.log(`Server je pokrenut i sl na adresi http://localhost:${PORT}`);
  }
});
