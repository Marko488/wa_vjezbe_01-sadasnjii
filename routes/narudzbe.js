import express from "express";
const router = express.Router();

let narudzbe = [];

const pizze = [
  { id: 1, naziv: "Margherita", cijena: 6.5 },
  { id: 2, naziv: "Capricciosa", cijena: 8.0 },
  { id: 3, naziv: "Quattro formaggi", cijena: 10.0 },
  { id: 4, naziv: "Šunka sir", cijena: 7.0 },
  { id: 5, naziv: "Vegetariana", cijena: 9.0 },
];

router.get("/", (req, res) => {
  if (narudzbe.length > 0) {
    res.status(200).json(narudzbe);
  } else {
    res.status(404).json({ message: "Ne postoji ni jedna narudzba (resurs)!" });
  }
});

router.get("/:id", (req, res) => {
  let id_narudzbe = req.params.id;
  let postoji_narudzba = narudzbe.find((n) => n.id == id_narudzbe);
  if (!postoji_narudzba) {
    return res
      .status(404)
      .json({ message: "Ne postoji taj resurs na serveru!!" });
  }
  res.status(200).json(postoji_narudzba);
});

router.delete("/:id", (req, res) => {
  let id_narudzbe = req.params.id;
  let index = narudzbe.findIndex((n) => n.id == id_narudzbe);

  if (index != -1) {
    narudzbe.splice(index, 1);
    res.status(200).json({ message: "Uspjesno ste obrisali resurs!" });
  } else {
    res.status(404).json({ message: "Nema tog resursa za obrisat!" });
  }
});

router.post("/naruci", (req, res) => {
  const { narudzba, klijent } = req.body;

  if (!Array.isArray(narudzba) || !klijent) {
    return res.status(400).json({
      message:
        "Narudzba mora biti polje objekata ili klijent mora biti poslan!",
    });
  }

  const { prezime, adresa, broj_telefona } = klijent;
  if (!prezime || !adresa || !broj_telefona) {
    return res
      .status(400)
      .json({ message: "Moraju biti poslani podaci o klijentu!!" });
  }

  let nazivi_pizza = [];
  let ukupna_cijena = 0;

  for (let stavka of narudzba) {
    let klj_stavke = Object.keys(stavka);

    if (
      !(
        klj_stavke.includes("pizza") &&
        klj_stavke.includes("kolicina") &&
        klj_stavke.includes("velicina")
      )
    ) {
      return res.status(400).json({
        message: "Stavke moraju imati kljuceve pizza,kolicina,velicina",
      });
    }

    let pizza_postoji = pizze.find((p) => p.naziv == stavka.pizza);
    if (!pizza_postoji) {
      return res.status(404).json({
        message: `Narucili biste pizzu ${stavka.pizza} koja ne postoji!`,
      });
    }

    let faktor_velicine = 1;
    if (stavka.velicina == "srednja") faktor_velicine = 1.2;
    if (stavka.velicina == "jumbo") faktor_velicine = 1.5;

    ukupna_cijena += pizza_postoji.cijena * faktor_velicine * stavka.kolicina;
    nazivi_pizza.push(`${stavka.pizza} ${stavka.velicina} `);
  }

  let id_narudzbe =
    narudzbe.length > 0 ? Math.max(...narudzbe.map((n) => n.id)) + 1 : 1;

  narudzbe.push({
    id_narudzbe,
    narudzba,
    klijent,
    ukupna_cijena: ukupna_cijena.toFixed(2),
  });

  res.status(200).json({
    message: `Uspjesno smo zaprimili vasu narudzbu za ${nazivi_pizza.join(" i ")}!!`,
    prezime,
    broj_telefona,
    ukupna_cijena: ukupna_cijena.toFixed(2),
  });
});

export default router;
