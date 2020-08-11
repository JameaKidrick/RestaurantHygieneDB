// ✅ ALL TESTS PASSED (./tests/usersRouter.test) ✅

const express = require("express");
const bcrypt = require("bcrypt");

const router = express.Router();

const usersDB = require("./usersModel");

/******************************* Middleware *******************************/
const validateUserID = require("../middleware/validateUserID");
const validateUsername = require('../middleware/validateUsername');
/******************************* Route Handlers *******************************/
// GET ALL USERS IN DATABASE
router.get("/", (req, res) => {
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
router.put("/:userid", [validateUserID, validateUsername], (req, res) => {
  const user = req.user;
  const changes = req.body;
  const userid = req.params.userid

  if(Number(userid) === req.decodeJwt.id){
    if(changes.password){
      if(!changes.confirm_password){
        res.status(401).json({ message: 'Please confirm your password' })
      }else{
        usersDB.findById(userid)
          .then(findUser => {
            if(bcrypt.compareSync(changes.confirm_password, findUser.password)){ // compare confirm_password to encrypted pw
              delete changes.confirm_password
              const hash = bcrypt.hashSync(changes.password, 10); 
              changes.password = hash;
              usersDB.update(user.user_id, changes)
                .then(update => {
                  // console.log(update)
                  res.status(201).json({
                    message: "User information successfully updated.",
                    user:{ user_id: update.user_id, first_name: update.first_name, last_name: update.last_name, username: update.username},
                  })
                })
            }else{
              res.status(401).json({ message: 'Invalid credentials' })
            }
          })
      }
    }else{
      usersDB
        .update(user.user_id, changes)
        .then((updatedUser) => {
          return res.status(201).json({
            message: "User information successfully updated.",
            user:{ user_id: updatedUser.user_id, first_name: updatedUser.first_name, last_name: updatedUser.last_name, username: updatedUser.username},
          });
        })
        .catch((error) => {
          return res.status(500).json({ error: "Internal server error", error });
        });
    }
  }else{
    res.status(401).json({ error: 'You are not authorized to make changes to this account.' })
  }
});

// DELETE A USER BY USER ID
router.delete("/:userid", [validateUserID], (req, res) => {
  const user = req.user;

  if(Number(req.params.userid) === req.decodeJwt.id){
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
  }else{
    res.status(401).json({ error: 'You are not authorized to make changes to this account.' })
  }
});

module.exports = router;
