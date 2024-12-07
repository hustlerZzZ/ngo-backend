import express from "express";
import {deleteUser, getAllUsers, getUser} from "../controller/adminController.js";

const router = express.Router();

// Getting a user using id
router.get("/get-user/:id", getUser);

// Getting all the user's present on the user
router.get("/getAllUsers", getAllUsers);

// Delete a user
router.delete("/delete-user/:id", deleteUser);

export default router;
