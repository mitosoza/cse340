// Needed Resources
const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const regValidate = require('../utilities/inventory-validation')

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

// Route to build vehicle detail view
router.get("/detail/:inv_id", invController.buildByInventoryId);

// Route to the management view
router.get("/", invController.buildManageView);

// Route to add a new classification
router.get("/add-classification", invController.buildAddClassification);

// Route to handle classification form submission
router.post(
  "/add-classification",
  regValidate.classificationRules(),
  regValidate.checkClassificationData,
  invController.addClassification);

// Route to add a new vehicle
router.get("/add-vehicle", invController.buildAddVehicle);

// Route to handle new vehicle form submission
router.post(
  "/add-vehicle",
  regValidate.vehicleRules(),
  regValidate.checkVehicleData,
  invController.addVehicle);

// Route display the inventory by classification
router.get("/getInventory/:classification_id", invController.getInventoryJSON)

// Route to edit a vehicle
router.get("/edit/:inv_id", invController.buildEditVehicle);

// Route to handle vehicle update
router.post(
  "/update/",
  regValidate.vehicleRules(),
  regValidate.checkUpdateData,
  invController.updateVehicle);

// Route to delete a vehicle
router.get("/delete/:inv_id", invController.buildDeleteVehicle);

// Route to handle vehicle deletion
router.post("/delete/", invController.deleteVehicle);

module.exports = router;