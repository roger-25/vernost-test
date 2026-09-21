const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/service.controller');
const { authenticateToken } = require('../middleware/auth.middleware');

// Get all available services (public)
router.get('/', serviceController.getAllServices);

// Get service by ID (public)
router.get('/:id', serviceController.getServiceById);

// All routes below require authentication
router.use(authenticateToken);

// Create new service definition (admin only)
router.post('/', [
  // validation rules here
], serviceController.createService);

// Update service definition (admin only)
router.put('/:id', serviceController.updateService);

// Delete service definition (admin only)
router.delete('/:id', serviceController.deleteService);

// Get service deployment templates
router.get('/:id/templates', serviceController.getDeploymentTemplates);

// Get service pricing
router.get('/:id/pricing', serviceController.getServicePricing);

module.exports = router;
