import React from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Box,
  Chip,
  Paper,
} from '@mui/material';
import { serviceAPI } from '../services/api';

function ServiceCatalogPage() {
  const { data: servicesData, isLoading, error } = useQuery({
    queryKey: ['services'],
    queryFn: serviceAPI.getAll,
  });

  if (isLoading) return <Typography>Loading services...</Typography>;
  if (error) return <Typography color="error">Error loading services</Typography>;

  const services = servicesData?.data || [];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Service Catalog
      </Typography>
      <Typography variant="subtitle1" color="textSecondary" sx={{ mb: 3 }}>
        Browse available services for deployment
      </Typography>

      <Grid container spacing={3}>
        {services.map((service) => (
          <Grid item xs={12} sm={6} md={4} key={service.id}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="h6">{service.name}</Typography>
                  <Chip label={service.category} size="small" color="primary" variant="outlined" />
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
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" color="primary" fontWeight="bold">
                    ${service.pricing.monthly}/month
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    v{service.version}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default ServiceCatalogPage;
