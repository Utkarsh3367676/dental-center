import React from 'react';
import { Box, Typography, Button, Container, Paper } from '@mui/material';
import { ErrorOutline } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <Container component="main" maxWidth="md">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper elevation={3} sx={{ p: 4, width: '100%', textAlign: 'center' }}>
          <ErrorOutline sx={{ fontSize: 60, color: 'error.main', mb: 2 }} />
          <Typography component="h1" variant="h4" color="error">
            Access Denied
          </Typography>
          <Typography variant="body1" sx={{ mt: 2 }}>
            You don't have permission to access this page.
          </Typography>
          <Button
            variant="contained"
            sx={{ mt: 3 }}
            onClick={() => navigate('/')}
          >
            Go to Dashboard
          </Button>
        </Paper>
      </Box>
    </Container>
  );
};

export default Unauthorized;
