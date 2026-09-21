import React from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Box,
  Button,
} from '@mui/material';
import { deploymentAPI } from '../services/api';

function DeploymentsPage() {
  const { data: deploymentsData, isLoading, refetch } = useQuery({
    queryKey: ['deployments'],
    queryFn: deploymentAPI.getAll,
    refetchInterval: 5000, // Auto-refresh every 5 seconds
  });

  const deployments = deploymentsData?.data || [];

  const getStatusColor = (status) => {
    const colors = {
      running: 'success',
      provisioning: 'warning',
      restarting: 'info',
      'rolling-back': 'error',
      failed: 'error',
    };
    return colors[status] || 'default';
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">My Deployments</Typography>
        <Button variant="contained" onClick={() => window.location.href = '/onboard'}>
          New Deployment
        </Button>
      </Box>

      {isLoading ? (
        <Typography>Loading deployments...</Typography>
      ) : deployments.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" gutterBottom>
            No deployments yet
          </Typography>
          <Typography color="textSecondary" sx={{ mb: 2 }}>
            Get started by deploying your first service
          </Typography>
          <Button variant="contained" onClick={() => window.location.href = '/onboard'}>
            Deploy Services
          </Button>
        </Paper>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Service ID</TableCell>
                <TableCell>Environment</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Replicas</TableCell>
                <TableCell>Version</TableCell>
                <TableCell>Created</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {deployments.map((deployment) => (
                <TableRow key={deployment.id}>
                  <TableCell>{deployment.serviceId}</TableCell>
                  <TableCell>
                    <Chip label={deployment.environment} size="small" />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={deployment.status}
                      size="small"
                      color={getStatusColor(deployment.status)}
                    />
                  </TableCell>
                  <TableCell>{deployment.replicas}</TableCell>
                  <TableCell>v{deployment.version}</TableCell>
                  <TableCell>
                    {new Date(deployment.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Button
                      size="small"
                      onClick={() => deploymentAPI.restart(deployment.id)}
                    >
                      Restart
                    </Button>
                    <Button
                      size="small"
                      color="error"
                      onClick={() => deploymentAPI.delete(deployment.id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
}

export default DeploymentsPage;
