const invModel = require("../models/inventory-model")
const accountModel = require("../models/account-model")
const Util = {}
const jwt = require("jsonwebtoken")
require("dotenv").config()

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
  let grid
  if(data.length > 0){
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => {
      grid += '<li>'
      grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id
      + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model
        + 'details"><img src="' + vehicle.inv_thumbnail
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model
      +' on CSE Motors" /></a>'
      grid += '<div class="namePrice">'
      grid += '<hr />'
      grid += '<h2>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View '
        + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">'
        + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span>$'
        + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else {
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

/* **************************************
* Build the vehicle detail view HTML
* ************************************ */
Util.buildVehicleDetails = async function (vehicle) {
  let detail
  if (vehicle) {
    detail = '<div id="vehicle-detail">'
    detail += '<div class="vehicle-image">'
    detail += '<img src="' + vehicle.inv_image + '" alt="' + vehicle.inv_year + ' ' + vehicle.inv_make + ' ' + vehicle.inv_model + '" loading="lazy">'
    detail += '</div>'
    detail += '<div class="vehicle-info">'
    detail += '<h1>' + vehicle.inv_make + ' ' + vehicle.inv_model + ' Details</h1>'
    detail += '<h2 class="vehicle-price">Price: $' + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</h2>'
    detail += '<p><strong>Description:</strong> ' + vehicle.inv_description + '</p>'
    detail += '<p><strong>Color:</strong> ' + vehicle.inv_color + '</p>'
    detail += '<p><strong>Mileage:</strong> ' + new Intl.NumberFormat('en-US').format(vehicle.inv_miles) + '</p>'
    detail += '</div>'
    detail += '</div>'
  } else {
    detail += '<p class="notice">Sorry, no matching vehicle could be found.</p>'
  }
  return detail
}

/* ****************************************
* Middleware to check token validity
**************************************** */
Util.checkJWTToken = (req, res, next) => {
  if (req.cookies.jwt) {
    jwt.verify(
      req.cookies.jwt,
      process.env.ACCESS_TOKEN_SECRET,
      function (err, accountData) {
        if (err) {
          req.flash("Please log in")
          res.clearCookie("jwt")
          return res.redirect("/account/login")
        }
        res.locals.accountData = accountData
        res.locals.loggedin = 1
        next()
      })
  } else {
    next()
  }
}

/* ****************************************
 * Middleware to check account type for inventory management
 **************************************** */
Util.checkAccountType = (req, res, next) => {
  if (res.locals.accountData &&
    (res.locals.accountData.account_type === "Employee" ||
      res.locals.accountData.account_type === "Admin")) {
    next()
  } else {
    req.flash("notice", "Access Denied - Please log in with appropriate privileges.")
    return res.redirect("/account/login")
  }
}

/* ****************************************
 * Middleware to check account type for user administration
 **************************************** */
Util.checkIsAdmin = (req, res, next) => {
  if (res.locals.accountData &&
    (res.locals.accountData.account_type === "Admin")) {
    next()
  } else {
    req.flash("notice", "Access Denied - Please log in with appropriate privileges.")
    return res.redirect("/account/login")
  }
}

/* ****************************************
 *  Check Login
 * ************************************ */
Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next()
  } else {
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }
}

/* ****************************************
 *  Create a classification Select List
 * ************************************ */
Util.buildClassificationList = async function (selectedId) {
  const classifications = await invModel.getAllClassifications()
  let selectList = '<select id="classificationList" name="classification_id">'
  selectList += '<option value="">Choose a Classification</option>'
  classifications.forEach(classification => {
    selectList += '<option value="' + classification.classification_id + '"'
    if (parseInt(classification.classification_id) === parseInt(selectedId)) {
      selectList += ' selected'
    }
    selectList += '>' + classification.classification_name + '</option>'
  })
  selectList += '</select>'
  return selectList
}

/* ****************************************
 *  Build the role select list
 **************************************** */
Util.buildRoleSelect = async function (selectedRole) {
  const getRoles = await accountModel.getAllRoles()
  let selectList = '<select id="roleList" name="account_type">'
  getRoles.forEach(role => {
    selectList += '<option value="' + role + '"'
    if (role === selectedRole) {
      selectList += ' selected'
    }
    selectList += '>' + role + '</option>'
  })
  selectList += '</select>'
  return selectList
}

module.exports = Util