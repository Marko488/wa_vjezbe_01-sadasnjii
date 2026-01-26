import express from "express";
import pizzeRouter from "./routes/pizze.js";
import narudzbeRouter from "./routes/narudzbe.js";
const app = express();
app.use(express.json());
const PORT = 3000;

app.use("/pizze", pizzeRouter);
app.use("/narudzbe", narudzbeRouter);

app.listen(PORT, (error) => {
  if (error) {
    console.log("Greska!!");
  } else {
    console.log("Server radi!!!");
  }
});
