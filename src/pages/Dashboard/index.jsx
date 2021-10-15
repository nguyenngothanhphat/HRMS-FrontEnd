import React from 'react';
import { isOwner } from '@/utils/authority';
import DashboardOld from '../DashboardOld';
import DashboardNew from '../DashboardNew';

const Dashboard = () => {
  // if (isOwner()) {
  //   return <DashboardOld />;
  // }
  // return <DashboardNew />;
  return <DashboardOld />
};
export default Dashboard;
