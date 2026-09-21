# CDAP - Cloud Deployment Automation Platform

## 🚀 Quick Start Guide

This guide will help you set up and run the CDAP portal locally with Minikube.

---

## Prerequisites

- **Node.js** 18+ (for backend and frontend)
- **Minikube** (for local Kubernetes cluster)
- **kubectl** (Kubernetes CLI)
- **Docker** (for containerization)

---

## Step 1: Start Minikube

```bash
# Start Minikube with adequate resources
minikube start --cpus=4 --memory=8192 --disk-size=50gb

# Enable required addons
minikube addons enable ingress
minikube addons enable metrics-server

# Verify cluster is running
kubectl cluster-info
```

---

## Step 2: Setup Backend

```bash
cd cdap-portal/backend

# Copy environment file
cp .env.example .env

# Install dependencies
npm install

# Start the backend server
npm run dev
```

The backend will be available at `http://localhost:3000`

---

## Step 3: Setup Frontend

```bash
cd cdap-portal/frontend

# Install dependencies
npm install

# Start the development server
npm start
```

The frontend will be available at `http://localhost:3001`

---

## Step 4: Deploy to Kubernetes (Optional)

```bash
cd cdap-portal/k8s

# Create namespace
kubectl apply -f namespace.yaml

# Build Docker images (you'll need to create Dockerfiles)
docker build -t cdap-backend:latest ../backend
docker build -t cdap-frontend:latest ../frontend

# Load images into Minikube
minikube image load cdap-backend:latest
minikube image load cdap-frontend:latest

# Deploy to Kubernetes
kubectl apply -f backend-deployment.yaml
kubectl apply -f frontend-deployment.yaml

# Check deployment status
kubectl get all -n cdap-system
```

---

## Step 5: Access the Portal

### Local Development
- **Frontend**: http://localhost:3001
- **Backend API**: http://localhost:3000
- **API Health Check**: http://localhost:3000/health

### Kubernetes Deployment
```bash
# Get the service URL
minikube service cdap-frontend-service -n cdap-system --url

# Or access via ingress if configured
```

---

## Step 6: Test the Application

1. **Login/Register**: Navigate to the frontend and create an account
2. **Browse Services**: Visit the Service Catalog page
3. **Onboard Tenant**: Use the onboarding wizard to select 4-5 services
4. **Deploy**: Review and deploy your selected services
5. **Monitor**: Check deployment status in the Deployments page

---

## Available Services (Demo)

| Service ID | Name | Monthly Cost |
|------------|------|--------------|
| svc-web-app | Web Application | $36 |
| svc-api-gateway | API Gateway | $22 |
| svc-data-processor | Data Processor | $43 |
| svc-message-queue | Message Queue | $15 |
| svc-database | Managed Database | $29 |

---

## API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login
- `GET /api/v1/auth/me` - Get current user
- `POST /api/v1/auth/logout` - Logout

### Services
- `GET /api/v1/services` - List all services
- `GET /api/v1/services/:id` - Get service details
- `GET /api/v1/services/:id/templates` - Get K8s templates
- `GET /api/v1/services/:id/pricing` - Get pricing info

### Tenants
- `GET /api/v1/tenants` - List tenants
- `POST /api/v1/tenants` - Create tenant
- `GET /api/v1/tenants/:id` - Get tenant details
- `GET /api/v1/tenants/:id/services` - Get tenant services

### Deployments
- `GET /api/v1/deployments` - List deployments
- `POST /api/v1/deployments` - Create deployment
- `GET /api/v1/deployments/:id` - Get deployment details
- `POST /api/v1/deployments/:id/scale` - Scale deployment
- `GET /api/v1/deployments/:id/logs` - Get deployment logs

---

## Troubleshooting

### Backend Issues
```bash
# Check if port 3000 is available
lsof -i :3000

# View logs
cd backend
npm run dev
```

### Frontend Issues
```bash
# Clear cache and reinstall
cd frontend
rm -rf node_modules package-lock.json
npm install
npm start
```

### Kubernetes Issues
```bash
# Check cluster status
minikube status

# View pod logs
kubectl get pods -n cdap-system
kubectl logs <pod-name> -n cdap-system
```

---

## Next Steps

1. **Add More Services**: Extend the service catalog in `backend/src/controllers/service.controller.js`
2. **Database Integration**: Replace mock data with PostgreSQL
3. **Real Kubernetes Integration**: Implement actual K8s deployment logic
4. **Monitoring**: Add Prometheus + Grafana for monitoring
5. **CI/CD**: Set up GitHub Actions for automated deployments

---

## Support

For questions or issues, please refer to the main architecture documentation in `CDAP_ARCHITECTURE.md`.
