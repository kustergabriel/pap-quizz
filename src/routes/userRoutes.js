import express from "express";
import userController from "../controllers/userController.js";

const routes = express.Router()

routes.post('/cadastro', userController.createUser)
routes.post('/login', userController.loginUser)

export default routes;