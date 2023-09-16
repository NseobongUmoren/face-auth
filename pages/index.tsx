import React from 'react';
import Dashboard from '@/components/Dashboard';
import AdmissionList from '@/components/AdmissionList';


const HomePage: React.FC = () => {
  return (
    <Dashboard pageTitle="Admission List">
      <AdmissionList />
    </Dashboard>
  );
};

export default HomePage;
