const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  try {
    const classification_id = req.params.classificationId
    const data = await invModel.getInventoryByClassificationId(classification_id)
    const grid = await utilities.buildClassificationGrid(data)
    let nav = await utilities.getNav()
    const className = data[0].classification_name
    res.render("./inventory/classification", {
      title: className + " vehicles",
      nav,
      grid,
      errors: null
    })
  } catch (error) {
    error.message = "Sorry, there was an error processing your request."
    next(error)
  }
}

/* ***************************
 *  Build vehicle detail view
 * ************************** */
invCont.buildByInventoryId = async function (req, res, next) {
  try {
    const inv_id = req.params.inv_id
    const data = await invModel.getInventoryById(inv_id)
    const details = await utilities.buildVehicleDetails(data)
    let nav = await utilities.getNav()
    const vehicleName = data.inv_year + " " + data.inv_make + " " + data.inv_model
    res.render("./inventory/details", {
      title: vehicleName,
      nav,
      details,
      errors: null
    })
  } catch (error) {
    error.message = "Sorry, there was an error processing your request."
    next(error)
  }
}

/* ***************************
 *  Build management view
 * ************************** */
invCont.buildManageView = async function (req, res, next) {
  try {
    let nav = await utilities.getNav()
    res.render("./inventory/management", {
      title: "Vehicle Management",
      nav,
      errors: null
    })
  } catch (error) {
    error.message = "Sorry, there was an error processing your request."
    next(error)
  }
}

/* ***************************
  *  Build add classification view
  * ************************** */
invCont.buildAddClassification = async function (req, res, next) {
  try {
    let nav = await utilities.getNav()
    res.render("./inventory/addClassification", {
      title: "Add New Classification",
      nav,
      errors: null
    })
  } catch (error) {
    error.message = "Sorry, there was an error processing your request."
    next(error)
  }
}

/* ****************************************
*  Process Classification Submission
* *************************************** */
invCont.addClassification = async function (req, res) {
  let nav = await utilities.getNav()
  const { classification_name } = req.body

  const regResult = await invModel.addClassification(
    classification_name
  )

  if (regResult) {
    req.flash(
      "notice",
      `The ${classification_name} classification was successfully added.`
    )
    nav = await utilities.getNav()
    res.status(201).render("./inventory/management", {
      title: "Vehicle Management",
      nav,
      errors: null
    })
  } else {
    req.flash("notice", "Sorry, Adding the classification failed.")
    res.status(501).render("./inventory/addClassification", {
      title: "Add New Classification",
      nav,
      errors: null
    })
  }
}

/* ***************************
 *  Build add vehicle view
 * ************************** */

invCont.buildAddVehicle = async function (req, res, next) {
  try {
    let nav = await utilities.getNav()
    let classifications = await invModel.getAllClassifications()
    res.render("./inventory/addVehicle", {
      title: "Add New Vehicle",
      nav,
      errors: null,
      classificationList: classifications
    })
  } catch (error) {
    error.message = "Sorry, there was an error processing your request."
    next(error)
  }
}

/* ****************************************
*  Process Vehicle Submission
* *************************************** */
invCont.addVehicle = async function (req, res) {
  let nav = await utilities.getNav()
  let classifications = await invModel.getAllClassifications()
  const {
    classification_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color
  } = req.body

  const regResult = await invModel.addVehicle(
    classification_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color
  )

  if (regResult) {
    req.flash(
      "notice",
      `The ${inv_year} ${inv_make} ${inv_model} was successfully added.`
    )
    nav = await utilities.getNav()
    res.status(201).render("./inventory/management", {
      title: "Vehicle Management",
      nav,
      errors: null
    })
  } else {
    req.flash("notice", "Sorry, Adding the vehicle failed.")
    res.status(501).render("./inventory/addVehicle", {
      title: "Add New Vehicle",
      nav,
      errors: null,
      classificationList: classifications
    })
  }
}

module.exports = invCont