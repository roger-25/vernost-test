// Service Catalog - Pre-configured services available for deployment
const serviceCatalog = new Map();

// Initialize service catalog with 5 demo services
serviceCatalog.set('svc-web-app', {
  id: 'svc-web-app',
  name: 'Web Application',
  description: 'Full-stack web application with Node.js backend and React frontend',
  category: 'application',
  version: '1.0.0',
  techStack: ['Node.js', 'React', 'PostgreSQL'],
  dockerImage: 'nginx:latest',
  defaultPort: 80,
  resourceRequirements: {
    cpu: '2',
    memory: '4Gi',
    replicas: 2
  },
  configurationSchema: {
    type: 'object',
    properties: {
      domain: { type: 'string' },
      sslEnabled: { type: 'boolean' },
      databaseUrl: { type: 'string' }
    }
  },
  pricing: {
    hourly: 0.05,
    monthly: 36
  },
  createdAt: new Date().toISOString()
});

serviceCatalog.set('svc-api-gateway', {
  id: 'svc-api-gateway',
  name: 'API Gateway',
  description: 'REST/GraphQL API gateway with authentication and rate limiting',
  category: 'api',
  version: '1.0.0',
  techStack: ['Python', 'FastAPI', 'Redis'],
  dockerImage: 'python:3.11-slim',
  defaultPort: 8000,
  resourceRequirements: {
    cpu: '1',
    memory: '2Gi',
    replicas: 2
  },
  configurationSchema: {
    type: 'object',
    properties: {
      apiVersion: { type: 'string' },
      rateLimit: { type: 'integer' },
      authProvider: { type: 'string' }
    }
  },
  pricing: {
    hourly: 0.03,
    monthly: 22
  },
  createdAt: new Date().toISOString()
});

serviceCatalog.set('svc-data-processor', {
  id: 'svc-data-processor',
  name: 'Data Processor',
  description: 'Batch data processing service for ETL workflows',
  category: 'data',
  version: '1.0.0',
  techStack: ['Go', 'Apache Kafka'],
  dockerImage: 'golang:1.21',
  defaultPort: 9000,
  resourceRequirements: {
    cpu: '2',
    memory: '8Gi',
    replicas: 1
  },
  configurationSchema: {
    type: 'object',
    properties: {
      batchSize: { type: 'integer' },
      schedule: { type: 'string' },
      inputSource: { type: 'string' }
    }
  },
  pricing: {
    hourly: 0.06,
    monthly: 43
  },
  createdAt: new Date().toISOString()
});

serviceCatalog.set('svc-message-queue', {
  id: 'svc-message-queue',
  name: 'Message Queue',
  description: 'Asynchronous messaging service using RabbitMQ',
  category: 'messaging',
  version: '1.0.0',
  techStack: ['RabbitMQ', 'Erlang'],
  dockerImage: 'rabbitmq:3-management',
  defaultPort: 5672,
  resourceRequirements: {
    cpu: '1',
    memory: '2Gi',
    replicas: 1
  },
  configurationSchema: {
    type: 'object',
    properties: {
      maxQueueSize: { type: 'integer' },
      messageTTL: { type: 'integer' },
      enableDLX: { type: 'boolean' }
    }
  },
  pricing: {
    hourly: 0.02,
    monthly: 15
  },
  createdAt: new Date().toISOString()
});

serviceCatalog.set('svc-database', {
  id: 'svc-database',
  name: 'Managed Database',
  description: 'PostgreSQL managed database service with automated backups',
  category: 'database',
  version: '1.0.0',
  techStack: ['PostgreSQL'],
  dockerImage: 'postgres:15',
  defaultPort: 5432,
  resourceRequirements: {
    cpu: '2',
    memory: '4Gi',
    replicas: 1
  },
  configurationSchema: {
    type: 'object',
    properties: {
      dbName: { type: 'string' },
      dbUser: { type: 'string' },
      backupSchedule: { type: 'string' },
      maxConnections: { type: 'integer' }
    }
  },
  pricing: {
    hourly: 0.04,
    monthly: 29
  },
  createdAt: new Date().toISOString()
});

exports.getAllServices = async (req, res) => {
  try {
    const services = Array.from(serviceCatalog.values());
    
    res.json({
      success: true,
      data: services,
      count: services.length
    });
  } catch (error) {
    console.error('Get all services error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get services'
    });
  }
};

exports.getServiceById = async (req, res) => {
  try {
    const service = serviceCatalog.get(req.params.id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    res.json({
      success: true,
      data: service
    });
  } catch (error) {
    console.error('Get service error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get service'
    });
  }
};

exports.createService = async (req, res) => {
  // Admin-only endpoint to add new services to catalog
  try {
    const service = {
      id: req.body.id,
      ...req.body,
      createdAt: new Date().toISOString()
    };

    serviceCatalog.set(service.id, service);

    res.status(201).json({
      success: true,
      data: service
    });
  } catch (error) {
    console.error('Create service error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create service'
    });
  }
};

exports.updateService = async (req, res) => {
  try {
    const service = serviceCatalog.get(req.params.id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    const updated = { ...service, ...req.body };
    serviceCatalog.set(req.params.id, updated);

    res.json({
      success: true,
      data: updated
    });
  } catch (error) {
    console.error('Update service error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update service'
    });
  }
};

exports.deleteService = async (req, res) => {
  try {
    const deleted = serviceCatalog.delete(req.params.id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    res.json({
      success: true,
      message: 'Service deleted successfully'
    });
  } catch (error) {
    console.error('Delete service error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete service'
    });
  }
};

exports.getDeploymentTemplates = async (req, res) => {
  try {
    const service = serviceCatalog.get(req.params.id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    // Return Kubernetes deployment template
    const template = {
      apiVersion: 'apps/v1',
      kind: 'Deployment',
      metadata: {
        name: `${service.id}-deployment`,
        labels: {
          app: service.id
        }
      },
      spec: {
        replicas: service.resourceRequirements.replicas,
        selector: {
          matchLabels: {
            app: service.id
          }
        },
        template: {
          metadata: {
            labels: {
              app: service.id
            }
          },
          spec: {
            containers: [{
              name: service.id,
              image: service.dockerImage,
              ports: [{
                containerPort: service.defaultPort
              }],
              resources: {
                requests: {
                  cpu: service.resourceRequirements.cpu,
                  memory: service.resourceRequirements.memory
                },
                limits: {
                  cpu: service.resourceRequirements.cpu,
                  memory: service.resourceRequirements.memory
                }
              }
            }]
          }
        }
      }
    };

    res.json({
      success: true,
      data: template
    });
  } catch (error) {
    console.error('Get deployment templates error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get deployment templates'
    });
  }
};

exports.getServicePricing = async (req, res) => {
  try {
    const service = serviceCatalog.get(req.params.id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    res.json({
      success: true,
      data: {
        serviceId: service.id,
        serviceName: service.name,
        pricing: service.pricing,
        estimatedMonthly: service.pricing.monthly
      }
    });
  } catch (error) {
    console.error('Get service pricing error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get service pricing'
    });
  }
};
