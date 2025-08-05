const inventoryModel = require("../models/inventory-model")
const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}

/*  **********************************
*  New Classification Data Validation Rules
* ********************************* */
validate.classificationRules = () => {
  return [
    body("classification_name")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 2 })
      .matches(/^[a-zA-Z]+$/)
      .withMessage("Provide a correct classification name.")
      .custom(async (classification_name) => {
        const classificationExists = await inventoryModel.checkExistingClassification(classification_name)
        if (classificationExists){
          throw new Error("Classification name exists. Please use a different name")
        }
      }),
  ]
}

/* ******************************
 * Check data and return errors or continue to add classification
 * ***************************** */
validate.checkClassificationData = async (req, res, next) => {
  const { classification_name } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("inventory/addClassification", {
      errors,
      title: "Add Classification",
      nav,
      classification_name,
    })
    return
  }
  next()
}

/* ********************************
*  New Vehicle Data Validation Rules
* ******************************** */
validate.vehicleRules = () => {
  return [
    body("classification_id")
      .trim()
      .escape()
      .notEmpty()
      .isNumeric()
      .withMessage("Please select a valid classification."),
    body("inv_make")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 3 })
      .withMessage("Please provide a correct make."),
    body("inv_model")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 3 })
      .withMessage("Please provide a correct model."),
    body("inv_description")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Please provide a correct description."),
    body("inv_image")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Please provide a correct image path."),
    body("inv_thumbnail")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Please provide a correct thumbnail path."),
    body("inv_price")
      .trim()
      .escape()
      .notEmpty()
      .isNumeric()
      .withMessage("Please provide a correct price."),
    body("inv_year")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 4, max: 4 })
      .isFloat({ min: 0 })
      .withMessage("Please provide a correct year."),
    body("inv_miles")
      .trim()
      .escape()
      .notEmpty()
      .isNumeric()
      .withMessage("Please provide a correct mileage."),
    body("inv_color")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Please provide a correct color.")
  ]
}

/* ******************************
 * Check data and return errors or continue to add vehicle
 * ***************************** */
validate.checkVehicleData = async (req, res, next) => {
  const { classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    const classificationSelect = await utilities.buildClassificationList(classification_id)
    res.render("inventory/addVehicle", {
      errors,
      title: "Add Vehicle",
      nav,
      classification_id,
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
      classificationSelect: classificationSelect
    })
    return
  }
  next()
}

/* ******************************
 * Check data and return errors or continue to add vehicle
 * ***************************** */
validate.checkUpdateData = async (req, res, next) => {
  const { classification_id, inv_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    let classificationSelect = await utilities.buildClassificationList(classification_id)
    res.render("inventory/editVehicle", {
      errors,
      title: "Edit Vehicle",
      nav,
      classification_id,
      inv_id,
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
      classificationSelect: classificationSelect
    })
    return
  }
  next()
}

module.exports = validate