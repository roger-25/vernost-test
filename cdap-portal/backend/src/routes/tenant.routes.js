const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const tenantController = require('../controllers/tenant.controller');
const { authenticateToken } = require('../middleware/auth.middleware');

// All routes require authentication
router.use(authenticateToken);

// Get all tenants (admin only)
router.get('/', tenantController.getAllTenants);

// Create new tenant
router.post('/', [
  body('name').trim().notEmpty(),
  body('email').isEmail().normalizeEmail(),
  body('plan').isIn(['starter', 'professional', 'enterprise'])
], tenantController.createTenant);

// Get tenant by ID
router.get('/:id', tenantController.getTenantById);

// Update tenant
router.put('/:id', [
  body('name').optional().trim().notEmpty(),
  body('status').optional().isIn(['active', 'suspended', 'inactive'])
], tenantController.updateTenant);

// Get tenant services
router.get('/:id/services', tenantController.getTenantServices);

// Add service to tenant
router.post('/:id/services', [
  body('serviceId').notEmpty(),
  body('configuration').optional().isObject()
], tenantController.addServiceToTenant);

// Remove service from tenant
router.delete('/:id/services/:serviceId', tenantController.removeServiceFromTenant);

// Get tenant resources
router.get('/:id/resources', tenantController.getTenantResources);

// Suspend tenant
router.post('/:id/suspend', tenantController.suspendTenant);

// Reactivate tenant
router.post('/:id/reactivate', tenantController.reactivateTenant);

module.exports = router;
