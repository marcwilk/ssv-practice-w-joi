const express = require('express');
const router = express.Router();
const knex = require('../knex')
const validate = require('express-validation')
const validation = require('../validations/signup')

//Get all user data
router.get('/users', (req, res, next) => {
  return knex('users')
    .then(result => {
      res.status(200).send(result)
    })
})

//New user signup
router.post('/signup', validate(validation.signup), function(req, res, next) {
  // Destructure request body into variables
  const { first_name, last_name, email, password } = req.body
  // If all fields are included, check to see if a user with that email already exists
  // Why do we need to check this, when HTML5 validation is requiring all inputs on the front-end?
  // if (first_name && last_name && email && password) {
    return knex('users')
    .where('email', req.body.email)
    .first()
    .then(exists => {
      // If user already exists, send a next() message that models the error messages output by Joi so that we can use the same modular code to render the error message.
      if(exists) {
        next({
          status: 400,
          errors: [
            {
              messages: [
                'That email is already registered!'
              ]
            }]
          })
      } else {
        // If user with that email does not already exist, insert new user into database
        return knex('users')
        .insert({first_name, last_name, email, password})
        .then(user => {
          // Send success message with an object representing the new user to be appended to the page (object short-hand)
          res.status(200).send({first_name, last_name, email, password})
        })
      }
    })
})

router.use(function(err, req, res, next) {
  res.status(err.status).send(err)
})


module.exports = router;
