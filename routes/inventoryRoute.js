// Needed Resources
const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const regValidate = require('../utilities/inventory-validation')
const utilities = require("../utilities/")

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

// Route to build vehicle detail view
router.get("/detail/:inv_id", invController.buildByInventoryId);

// Route to the management view
router.get("/", utilities.checkLogin, utilities.checkAccountType, invController.buildManageView);

// Route to add a new classification
router.get("/add-classification", utilities.checkLogin, utilities.checkAccountType, invController.buildAddClassification);

// Route to handle classification form submission
router.post(
  "/add-classification",
  utilities.checkLogin,
  utilities.checkAccountType,
  regValidate.classificationRules(),
  regValidate.checkClassificationData,
  invController.addClassification);

// Route to add a new vehicle
router.get("/add-vehicle", utilities.checkLogin, utilities.checkAccountType, invController.buildAddVehicle);

// Route to handle new vehicle form submission
router.post(
  "/add-vehicle",
  utilities.checkLogin,
  utilities.checkAccountType,
  regValidate.vehicleRules(),
  regValidate.checkVehicleData,
  invController.addVehicle);

// Route display the inventory by classification
router.get("/getInventory/:classification_id", invController.getInventoryJSON)

// Route to edit a vehicle
router.get("/edit/:inv_id", utilities.checkLogin, utilities.checkAccountType, invController.buildEditVehicle);

// Route to handle vehicle update
router.post(
  "/update/",
  utilities.checkLogin,
  utilities.checkAccountType,
  regValidate.vehicleRules(),
  regValidate.checkUpdateData,
  invController.updateVehicle);

// Route to delete a vehicle
router.get("/delete/:inv_id", utilities.checkLogin, utilities.checkAccountType, invController.buildDeleteVehicle);

// Route to handle vehicle deletion
router.post("/delete/", utilities.checkLogin, utilities.checkAccountType, invController.deleteVehicle);

module.exports = router;