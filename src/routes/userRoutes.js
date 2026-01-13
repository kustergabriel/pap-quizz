import express from "express";
import userController from "../controllers/userController.js";

const routes = express.Router()

routes.post('/cadastro', userController.createUser)

export default routes;