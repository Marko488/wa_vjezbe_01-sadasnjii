import express from "express";
const router = express.Router();

const pizze = [
  { id: 1, naziv: "Margherita", cijena: 6.5 },
  { id: 2, naziv: "Capricciosa", cijena: 8.0 },
  { id: 3, naziv: "Quattro formaggi", cijena: 10.0 },
  { id: 4, naziv: "Šunka sir", cijena: 7.0 },
  { id: 5, naziv: "Vegetariana", cijena: 9.0 },
];

router.get("/", (req, res) => {
  res.status(200).json(pizze);
});

router.get("/:id", (req, res) => {
  let id_pizze = req.params.id;

  if (isNaN(id_pizze)) {
    return res.status(400).json({ message: "ID mora biti broj!" });
  }

  let pizza = pizze.find((p) => p.id == id_pizze);
  if (pizza) {
    res.status(200).json(pizza);
  } else {
    res.status(404).json({ message: `Ne postoji pizza sa id-em ${id_pizze}` });
  }
});

router.post("/", (req, res) => {
  let nova_pizza = req.body;
  if (!nova_pizza.naziv || !nova_pizza.cijena) {
    return res
      .status(400)
      .json({ message: "Nova pizza mora imati kljuc naziv i cijena!!!" });
  }

  let id = pizze.length > 0 ? Math.max(...pizze.map((p) => p.id)) + 1 : 1;

  let pizza_za_spremanje = {
    id,
    naziv: nova_pizza.naziv,
    cijena: nova_pizza.cijena,
  };

  pizze.push(pizza_za_spremanje);
  res
    .status(201)
    .json({ message: `Stvorena nova pizza!`, pizza: pizza_za_spremanje });
});

router.put("/:id", (req, res) => {
  let id_pizze = req.params.id;
  let nova_pizza = req.body;

  if (!nova_pizza.cijena || !nova_pizza.naziv) {
    return res
      .status(400)
      .json({ message: "Nusi poslao sve kljuceve (naziv i cijena)!" });
  }

  nova_pizza.id = id_pizze;

  let index = pizze.findIndex((p) => p.id == id_pizze);
  if (index !== -1) {
    pizze[index] = nova_pizza;
    res.status(200).json({ message: "Uspjesno ste izmjenili podatke", pizze });
  } else {
    res
      .status(404)
      .json({ message: "Pokusali biste azurirat resurs koji ne postoji!!" });
  }
});

router.patch("/:id", (req, res) => {
  let podaci = req.body;
  let id_pizze = req.params.id;

  let index = pizze.findIndex((p) => p.id == id_pizze);

  if (index != -1) {
    pizze[index] = { ...pizze[index], ...podaci };
    res
      .status(200)
      .json({ message: "Uspjesno ste izmjenili podatke", pizza: pizze[index] });
  } else {
    res.status(404).json({ message: "Ne postoji ta pizza za azurirati!!!" });
  }
});

router.delete("/:id", (req, res) => {
  let id_pizze = req.params.id;

  let index = pizze.findIndex((p) => p.id == id_pizze);
  if (index != -1) {
    pizze.splice(index, 1);
    res.status(200).json(pizze);
  } else {
    res
      .status(404)
      .json({ message: "Ne mozete azurirat nepostojeci resurs!!" });
  }
});

export default router;
