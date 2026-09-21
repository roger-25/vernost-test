import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import {
  Container,
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Checkbox,
  Chip,
  Paper,
  Stepper,
  Step,
  StepLabel,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { serviceAPI, deploymentAPI } from '../services/api';

const steps = ['Select Services', 'Configure', 'Review & Deploy'];

function TenantOnboardingPage() {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [selectedServices, setSelectedServices] = useState([]);
  const [configuration] = useState({});

  const { data: servicesData, isLoading } = useQuery({
    queryKey: ['services'],
    queryFn: serviceAPI.getAll,
  });

  const services = servicesData?.data || [];

  const handleServiceToggle = (serviceId) => {
    setSelectedServices((prev) =>
      prev.includes(serviceId)
        ? prev.filter((id) => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const handleNext = () => {
    if (activeStep === 0 && selectedServices.length === 0) {
      alert('Please select at least one service');
      return;
    }
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleDeploy = async () => {
    try {
      // Create deployments for each selected service
      const tenantId = JSON.parse(localStorage.getItem('user'))?.companyName || 'default';
      
      for (const serviceId of selectedServices) {
        await deploymentAPI.create({
          tenantId,
          serviceId,
          environment: 'dev',
          configuration: configuration[serviceId] || {},
        });
      }

      alert('Deployments initiated successfully!');
      navigate('/deployments');
    } catch (error) {
      alert('Deployment failed: ' + error.message);
    }
  };

  const calculateTotalPrice = () => {
    return selectedServices
      .map((id) => services.find((s) => s.id === id))
      .filter(Boolean)
      .reduce((sum, service) => sum + service.pricing.monthly, 0);
  };

  return (
    <Layout>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" gutterBottom>
            Welcome to CDAP - Service Onboarding
          </Typography>
          <Typography variant="subtitle1" color="textSecondary" sx={{ mb: 3 }}>
            Select and configure the services you want to deploy
          </Typography>

          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {activeStep === 0 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Select Services (Choose 4-5 services)
              </Typography>
              {isLoading ? (
                <Typography>Loading services...</Typography>
              ) : (
                <Grid container spacing={3}>
                  {services.map((service) => (
                    <Grid item xs={12} sm={6} md={4} key={service.id}>
                      <Card
                        sx={{
                          height: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                          borderColor: selectedServices.includes(service.id)
                            ? 'primary.main'
                            : 'grey.300',
                          borderWidth: 2,
                          borderStyle: 'solid',
                        }}
                      >
                        <CardContent sx={{ flexGrow: 1 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography variant="h6">{service.name}</Typography>
                            <Checkbox
                              checked={selectedServices.includes(service.id)}
                              onChange={() => handleServiceToggle(service.id)}
                            />
                          </Box>
                          <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                            {service.description}
                          </Typography>
                          <Box sx={{ mb: 2 }}>
                            {service.techStack.map((tech) => (
                              <Chip
                                key={tech}
                                label={tech}
                                size="small"
                                sx={{ mr: 0.5, mb: 0.5 }}
                              />
                            ))}
                          </Box>
                          <Typography variant="body2" color="primary">
                            ${service.pricing.monthly}/month
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              )}
            </Box>
          )}

          {activeStep === 1 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Configure Selected Services
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Basic configuration will be applied. Advanced configuration available after deployment.
              </Typography>
            </Box>
          )}

          {activeStep === 2 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Review & Deploy
              </Typography>
              <Paper sx={{ p: 3, mb: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Selected Services:
                </Typography>
                {selectedServices.map((id) => {
                  const service = services.find((s) => s.id === id);
                  return service ? (
                    <Box key={id} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography>{service.name}</Typography>
                      <Typography>${service.pricing.monthly}/month</Typography>
                    </Box>
                  ) : null;
                })}
                <Box sx={{ borderTop: 1, borderColor: 'divider', mt: 2, pt: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
                    <Typography>Total Monthly Cost:</Typography>
                    <Typography color="primary">${calculateTotalPrice()}/month</Typography>
                  </Box>
                </Box>
              </Paper>
            </Box>
          )}

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
            <Button disabled={activeStep === 0} onClick={handleBack}>
              Back
            </Button>
            {activeStep === steps.length - 1 ? (
              <Button variant="contained" onClick={handleDeploy}>
                Deploy Services
              </Button>
            ) : (
              <Button variant="contained" onClick={handleNext}>
                Next
              </Button>
            )}
          </Box>
        </Paper>
      </Container>
    </Layout>
  );
}

export default TenantOnboardingPage;
