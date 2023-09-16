import React from 'react';
import Dashboard from '@/components/Dashboard';
import StudentDetails from '@/components/StudentDetails';


const Details: React.FC = () => {
  return (
    <Dashboard pageTitle="Student Details">
      <StudentDetails />
    </Dashboard>
  );
};

export default Details;