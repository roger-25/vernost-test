const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const deploymentController = require('../controllers/deployment.controller');
const { authenticateToken } = require('../middleware/auth.middleware');

// All routes require authentication
router.use(authenticateToken);

// Get all deployments for current tenant
router.get('/', deploymentController.getAllDeployments);

// Create new deployment
router.post('/', [
  body('tenantId').notEmpty().isUUID(),
  body('serviceId').notEmpty(),
  body('configuration').optional().isObject(),
  body('environment').isIn(['dev', 'staging', 'production'])
], deploymentController.createDeployment);

// Get deployment by ID
router.get('/:id', deploymentController.getDeploymentById);

// Update deployment
router.put('/:id', deploymentController.updateDeployment);

// Delete deployment
router.delete('/:id', deploymentController.deleteDeployment);

// Get deployment logs
router.get('/:id/logs', deploymentController.getDeploymentLogs);

// Scale deployment
router.post('/:id/scale', [
  body('replicas').isInt({ min: 1, max: 100 })
], deploymentController.scaleDeployment);

// Restart deployment
router.post('/:id/restart', deploymentController.restartDeployment);

// Get deployment status
router.get('/:id/status', deploymentController.getDeploymentStatus);

// Rollback deployment
router.post('/:id/rollback', [
  body('targetVersion').notEmpty()
], deploymentController.rollbackDeployment);

module.exports = router;
