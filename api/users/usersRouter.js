// ✅ ALL TESTS PASSED (./tests/usersRouter.test) ✅

const express = require("express");

const router = express.Router();

const usersDB = require("./usersModel");

/******************************* Middleware *******************************/
const validateUserID = require("../middleware/validateUserID");
const validateUsername = require('../middleware/validateUsername');
const verifyToken = require('../authorization/authMiddleware');
/******************************* Route Handlers *******************************/
// GET ALL USERS IN DATABASE
// REQUIRED: LOGGED IN
router.get("/", [verifyToken], (req, res) => {
  usersDB
    .find()
    .then((users) => {
      res.status(200).json(users);
    })
    .catch((error) => {
      res.status(500).json({ error: "Internal server error", error });
    });
});

// GET SPECIFIC USER BY ID
// REQUIRED: LOGGED IN
router.get("/:userid", [validateUserID], (req, res) => {
  const user = req.user;
  usersDB
    .findById(req.params.userid)
    .then((user) => {
      res.status(200).json(user);
    })
    .catch((error) => {
      res.status(500).json({ error: "Internal server error", error });
    });
});

// UPDATE A USER'S INFORMATION BY USER ID
// REQUIRED: LOGGED IN
// REQUIRED: MATCHING ID
router.put("/:userid", [validateUserID, validateUsername], (req, res) => {
  const user = req.user;
  const changes = req.body;

  usersDB
    .update(user.user_id, changes)
    .then((updatedUser) => {
      return res.status(201).json({
        message: "User information successfully updated.",
        user: updatedUser,
      });
    })
    .catch((error) => {
      return res.status(500).json({ error: "Internal server error", error });
    });
});

// DELETE A USER BY USER ID
// REQUIRED: LOGGED IN
// REQUIRED: MATCHING ID
router.delete("/:userid", [validateUserID], (req, res) => {
  const user = req.user;

  usersDB
    .remove(user.user_id)
    .then((deletedUser) => {
      res
        .status(201)
        .json({ message: "User has been successfully deleted.", deletedUser });
    })
    .catch((error) => {
      res.status(500).json({ error: "Internal server error", error });
    });
});

module.exports = router;
