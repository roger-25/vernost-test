const { v4: uuidv4 } = require('uuid');

// Mock database (replace with actual DB calls)
const tenants = new Map();
const tenantServices = new Map();

// Initialize with sample data
tenants.set('tenant-1', {
  id: 'tenant-1',
  name: 'Acme Corp',
  email: 'admin@acme.com',
  plan: 'professional',
  status: 'active',
  namespace: 'acme-corp',
  resourceQuota: {
    cpu: '20',
    memory: '40Gi',
    pods: '50',
    services: '10'
  },
  createdAt: new Date().toISOString()
});

tenants.set('tenant-2', {
  id: 'tenant-2',
  name: 'TechStart Inc',
  email: 'admin@techstart.io',
  plan: 'starter',
  status: 'active',
  namespace: 'techstart',
  resourceQuota: {
    cpu: '5',
    memory: '10Gi',
    pods: '20',
    services: '5'
  },
  createdAt: new Date().toISOString()
});

exports.getAllTenants = async (req, res) => {
  try {
    // In production, filter by user's permissions
    const allTenants = Array.from(tenants.values());
    
    res.json({
      success: true,
      data: allTenants
    });
  } catch (error) {
    console.error('Get all tenants error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get tenants'
    });
  }
};

exports.createTenant = async (req, res) => {
  try {
    const { name, email, plan } = req.body;

    const tenant = {
      id: uuidv4(),
      name,
      email,
      plan,
      status: 'active',
      namespace: name.toLowerCase().replace(/\s+/g, '-'),
      resourceQuota: getResourceQuotaForPlan(plan),
      createdAt: new Date().toISOString()
    };

    tenants.set(tenant.id, tenant);

    res.status(201).json({
      success: true,
      data: tenant
    });
  } catch (error) {
    console.error('Create tenant error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create tenant'
    });
  }
};

exports.getTenantById = async (req, res) => {
  try {
    const tenant = tenants.get(req.params.id);

    if (!tenant) {
      return res.status(404).json({
        success: false,
        message: 'Tenant not found'
      });
    }

    res.json({
      success: true,
      data: tenant
    });
  } catch (error) {
    console.error('Get tenant error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get tenant'
    });
  }
};

exports.updateTenant = async (req, res) => {
  try {
    const tenant = tenants.get(req.params.id);

    if (!tenant) {
      return res.status(404).json({
        success: false,
        message: 'Tenant not found'
      });
    }

    const { name, status } = req.body;

    if (name) tenant.name = name;
    if (status) tenant.status = status;

    tenants.set(req.params.id, tenant);

    res.json({
      success: true,
      data: tenant
    });
  } catch (error) {
    console.error('Update tenant error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update tenant'
    });
  }
};

exports.getTenantServices = async (req, res) => {
  try {
    const services = tenantServices.get(req.params.id) || [];

    res.json({
      success: true,
      data: services
    });
  } catch (error) {
    console.error('Get tenant services error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get tenant services'
    });
  }
};

exports.addServiceToTenant = async (req, res) => {
  try {
    const { serviceId, configuration } = req.body;
    const tenantId = req.params.id;

    const tenant = tenants.get(tenantId);
    if (!tenant) {
      return res.status(404).json({
        success: false,
        message: 'Tenant not found'
      });
    }

    const serviceAssignment = {
      id: uuidv4(),
      tenantId,
      serviceId,
      configuration: configuration || {},
      status: 'active',
      deployedAt: new Date().toISOString()
    };

    if (!tenantServices.has(tenantId)) {
      tenantServices.set(tenantId, []);
    }

    tenantServices.get(tenantId).push(serviceAssignment);

    res.status(201).json({
      success: true,
      data: serviceAssignment
    });
  } catch (error) {
    console.error('Add service to tenant error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add service to tenant'
    });
  }
};

exports.removeServiceFromTenant = async (req, res) => {
  try {
    const tenantId = req.params.id;
    const serviceId = req.params.serviceId;

    const services = tenantServices.get(tenantId) || [];
    const filtered = services.filter(s => s.serviceId !== serviceId);

    tenantServices.set(tenantId, filtered);

    res.json({
      success: true,
      message: 'Service removed from tenant'
    });
  } catch (error) {
    console.error('Remove service error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to remove service'
    });
  }
};

exports.getTenantResources = async (req, res) => {
  try {
    const tenant = tenants.get(req.params.id);

    if (!tenant) {
      return res.status(404).json({
        success: false,
        message: 'Tenant not found'
      });
    }

    const services = tenantServices.get(req.params.id) || [];

    res.json({
      success: true,
      data: {
        quota: tenant.resourceQuota,
        used: {
          services: services.length
        }
      }
    });
  } catch (error) {
    console.error('Get tenant resources error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get tenant resources'
    });
  }
};

exports.suspendTenant = async (req, res) => {
  try {
    const tenant = tenants.get(req.params.id);

    if (!tenant) {
      return res.status(404).json({
        success: false,
        message: 'Tenant not found'
      });
    }

    tenant.status = 'suspended';
    tenants.set(req.params.id, tenant);

    res.json({
      success: true,
      data: tenant
    });
  } catch (error) {
    console.error('Suspend tenant error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to suspend tenant'
    });
  }
};

exports.reactivateTenant = async (req, res) => {
  try {
    const tenant = tenants.get(req.params.id);

    if (!tenant) {
      return res.status(404).json({
        success: false,
        message: 'Tenant not found'
      });
    }

    tenant.status = 'active';
    tenants.set(req.params.id, tenant);

    res.json({
      success: true,
      data: tenant
    });
  } catch (error) {
    console.error('Reactivate tenant error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reactivate tenant'
    });
  }
};

// Helper function
function getResourceQuotaForPlan(plan) {
  const quotas = {
    starter: {
      cpu: '5',
      memory: '10Gi',
      pods: '20',
      services: '5'
    },
    professional: {
      cpu: '20',
      memory: '40Gi',
      pods: '50',
      services: '10'
    },
    enterprise: {
      cpu: '100',
      memory: '200Gi',
      pods: '200',
      services: '50'
    }
  };

  return quotas[plan] || quotas.starter;
}
