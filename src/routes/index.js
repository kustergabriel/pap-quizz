import express from 'express'
import user from './userRoutes.js'
import questions from './questionsRoutes.js'

const routes = (app) => {
    // app.route('/').get((req,res) => res.status(200).send())
    app.use(express.json(), user, questions)

}

export default routes