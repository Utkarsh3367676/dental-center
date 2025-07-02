import React from 'react';
import SimpleDashboard from '../components/dashboard/SimpleDashboard';

const Home = () => {
  // Use SimpleDashboard instead of Dashboard to fix rendering issues
  return <SimpleDashboard />;
};

export default Home;
