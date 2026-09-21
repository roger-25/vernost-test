import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Avatar,
  Button,
} from '@mui/material';
import DnsIcon from '@mui/icons-material/Dns';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import AssessmentIcon from '@mui/icons-material/Assessment';

function DashboardPage() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const stats = [
    { label: 'Active Services', value: '0', icon: <DnsIcon />, color: '#1976d2' },
    { label: 'Deployments', value: '0', icon: <CloudUploadIcon />, color: '#388e3c' },
    { label: 'Tenants', value: '1', icon: <AccountBalanceIcon />, color: '#f57c00' },
    { label: 'Total Cost/Month', value: '$0', icon: <AssessmentIcon />, color: '#7b1fa2' },
  ];

  return (
    <Layout>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h4" gutterBottom>
              Welcome to CDAP Portal
            </Typography>
            <Typography variant="subtitle1" color="textSecondary">
              {user.companyName ? `${user.companyName} Dashboard` : 'Manage your cloud deployments'}
            </Typography>
          </Box>
          <Button 
            variant="contained" 
            size="large"
            onClick={() => navigate('/onboard')}
            sx={{ mt: 2 }}
          >
            Start Onboarding
          </Button>
        </Box>

        <Grid container spacing={3}>
          {stats.map((stat, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar sx={{ bgcolor: stat.color, mr: 2 }}>
                      {stat.icon}
                    </Avatar>
                    <Typography variant="h4" component="div">
                      {stat.value}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="textSecondary">
                    {stat.label}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            Quick Start Guide
          </Typography>
          <Card sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="body1" paragraph>
                <strong>Step 1:</strong> Navigate to the Service Catalog to browse available services
              </Typography>
              <Typography variant="body1" paragraph>
                <strong>Step 2:</strong> Use the Onboarding wizard to select 4-5 services for your organization
              </Typography>
              <Typography variant="body1" paragraph>
                <strong>Step 3:</strong> Review your selections and deploy to your dedicated namespace
              </Typography>
              <Typography variant="body1">
                <strong>Step 4:</strong> Monitor and manage your deployments from the Deployments page
              </Typography>
            </CardContent>
          </Card>
        </Box>

        <Box sx={{ mt: 4, p: 3, bgcolor: 'background.default', borderRadius: 1 }}>
          <Typography variant="h6" gutterBottom>
            Platform Features
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2">✓ Multi-tenant architecture</Typography>
              <Typography variant="body2">✓ Self-service portal</Typography>
              <Typography variant="body2">✓ Automated deployments</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2">✓ Resource quota management</Typography>
              <Typography variant="body2">✓ Kubernetes-native</Typography>
              <Typography variant="body2">✓ Real-time monitoring</Typography>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Layout>
  );
}

export default DashboardPage;
