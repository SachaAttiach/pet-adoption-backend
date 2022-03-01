const router = require("express").Router();
const PetModel = require("../models/Pets");
const UserModel = require("../models/Users");
const verify = require("../helpers/verifyToken");
const { getUserFromRequest } = require("../helpers/auth");

router.get("/getPets", (req, res) => {
  PetModel.find({}, (err, result) => {
    if (err) {
      res.json(err);
    } else {
      res.json(result);
    }
  });
});

router.get("/getPets/:petID", async (req, res, next) => {
  const { petID } = req.params;
  try {
    const pets = await PetModel.find();
    const element = pets.forEach((element) => {
      if (element.id == petID) {
        return res.send({ element });
      }
    });
  } catch (err) {
    next(err);
  }
});

router.post("/createPets", verify, async (req, res) => {
  const pet = req.body;
  const newPet = new PetModel(pet);
  await newPet.save();
  res.json(pet);
});

router.put("/adopt/:petID", async (req, res) => {
  const { petID } = req.params;
  const userData = await getUserFromRequest(req);
  if (userData.adoptedPets.includes(petID)) {
    res.status(400).json("You already own this pet");
    return;
  }
  const users = await UserModel.find({ adoptedPets: { $in: [petID] } });
  if (users.length > 0) {
    res.status(400).json("Already adopted");
    return;
  }
  try {
    //modify pet data
    const updatedPet = await PetModel.findByIdAndUpdate(
      petID,
      { adoptionStatus: "adopted" },
      {
        new: true,
      }
    );

    userData.adoptedPets.push(petID);
    await userData.save();
    res.send(updatedPet);
  } catch (err) {
    console.log(err);
  }
});

router.put("/foster/:petID", async (req, res) => {
  const { petID } = req.params;
  const userData = await getUserFromRequest(req);
  if (userData.fosteredPets.includes(petID)) {
    res.status(400).send("You already own this pet");
    return;
  }
  const users = await UserModel.find({ fosteredPets: { $in: [petID] } });
  if (users.length > 0) {
    res.status(400).json("Already Fostered");
    return;
  }
  try {
    //modify pet data
    const updatedPet = await PetModel.findByIdAndUpdate(
      petID,
      { adoptionStatus: "fostered" },
      {
        new: true,
      }
    );

    userData.fosteredPets.push(petID);
    await userData.save();
    res.send(updatedPet);
  } catch (err) {
    console.log(err);
  }
});

router.put("/return/:petID", async (req, res) => {
  const { petID } = req.params;
  const userData = await getUserFromRequest(req);
  if (!userData.adoptedPets.includes(petID)) {
    res.status(400).json("You don't own this pet");
    return;
  }
  try {
    //modify pet data
    const updatedPet = await PetModel.findByIdAndUpdate(
      petID,
      { adoptionStatus: "available" },
      {
        new: true,
      }
    );

    const { adoptedPets } = userData;
    if (adoptedPets.includes(petID)) {
      const newAdoptedPets = adoptedPets.filter((pet) => pet !== petID);
      userData.adoptedPets = newAdoptedPets;
      await userData.save();
    }
    res.send(updatedPet);
  } catch (err) {
    console.log(err);
  }
});

router.put("/save/:petID", async (req, res) => {
  const { petID } = req.params;
  const { savedStatus, userID } = req.body;
  try {
    //modify pet data
    const updatedPet = await PetModel.findByIdAndUpdate(
      petID,
      { savedStatus: "saved by someone" },
      {
        new: true,
      }
    );

    //add petID in adoptedPet list of user
    const userData = await UserModel.findById(userID);

    const { savedpets } = userData;
    if (!savedpets.includes(updatedPet._id)) {
      const newsavedpets = [...savedpets, petID];
      await UserModel.findByIdAndUpdate(userID, {
        savedpets: newsavedpets,
      });
    }
    res.send(updatedPet);
  } catch (err) {
    console.log(err);
  }
});

router.put("/returnsaved/:petID", async (req, res) => {
  const { petID } = req.params;
  const { userID } = req.body;

  try {
    //modify pet data
    const updatedPet = await PetModel.findByIdAndUpdate(
      petID,
      { savedStatus: "unsaved" },
      {
        new: true,
      }
    );

    //add petID in adoptedPet list of user
    const userData = await UserModel.findById(userID);

    const { savedpets } = userData;
    if (savedpets.includes(petID)) {
      const newsavedpets = savedpets.filter((pet) => pet !== petID);
      await UserModel.findByIdAndUpdate(userID, {
        savedpets: newsavedpets,
      });
    }
    res.send(updatedPet);
  } catch (err) {
    console.log(err);
  }
});

router.put("/update/:petID", verify, async (req, res) => {
  const { petID } = req.params;
  const petUpdate = await PetModel.findById(petID);
  for (const [key, value] of Object.entries(req.body)) {
    petUpdate[key] = value;
  }
  await petUpdate.save();
  res.json(petUpdate);
});

module.exports = router;
