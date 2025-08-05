// Needed Resources
const express = require("express")
const router = new express.Router()
const accountController = require("../controllers/accountController")
const regValidate = require('../utilities/account-validation')
const utilities = require("../utilities/")

// Route to build account login view
router.get("/login", accountController.buildLogin)

// Route to build account registration view
router.get("/register", accountController.buildRegister)

// Route to handle account registration form submission
router.post(
  "/register",
  regValidate.registationRules(),
  regValidate.checkRegData,
  accountController.registerAccount
)

// Route to process the login attempt
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  accountController.accountLogin
)

// Route to build Account Management view
router.get("/", utilities.checkLogin, accountController.buildAccountManagement)

module.exports = router;