import express from "express";
import userController from "../controllers/userController";

const routes = express.Routes()

routes.post('/', userController.createUser)