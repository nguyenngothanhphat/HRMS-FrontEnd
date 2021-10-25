// import React, { useEffect } from 'react';
// import styles from './index.less';
// import { history, connect } from 'umi';
// import { Tabs } from 'antd';
// import { PageContainer } from '@/layouts/layout/src';
// //  import OverView from './components/OverView';
// //import AllTickets from './components/AllTickets';
// import AllTickets from './Manager Tickets/components/AllTickets';
// import TicketQueue from './Employee Tickets/components/TicketQueue';
// import MyTickets from './Employee Tickets/components/My Tickets';
// import TicketDetails from './components/TicketDetails'
// const { TabPane } = Tabs;

// const TicketManagement = (props) => {
//   const {
//     match: { params: { tabName = '' } = {} },
//     permissions = {},
//     dispatch,
//   } = props;
//   useEffect(() => {
//     if (!tabName) {
//       history.replace(`/ticket-management/overview`);
//     }
//   }, [tabName]);
//   //clear state when unmounting
//   // useEffect(() => {
//   //     return () => {
//   //         dispatch({
//   //             type: 'ticket-management/clearState',
//   //         });
//   //     };
//   // }, []);
//   return (
//     <div className={styles.TicketManagement}>
//       <PageContainer>
//         <Tabs
//           activeKey={tabName || 'alltickets'}
//           onChange={(key) => {
//             history.push(`/ticket-management/${key}`);
//           }}
//         >
//           <TabPane tab="Ticket Queue" key="overview">
//             {/* <AllTickets /> */}
//             <TicketDetails/>
//           </TabPane>
//           <TabPane tab="My Tickets" key="alltickets">
//             <MyTickets />
//           </TabPane>
//         </Tabs>
//       </PageContainer>
//     </div>
//   );
// };

// export default TicketManagement


// class components

import React, { PureComponent } from 'react';
import { initViewOffboarding } from '@/utils/authority';
import EmployyeTicket from './EmployeeTickets'
import ManagerTicket from './ManagerTickets'

class TicketsManagement extends PureComponent {
  findRole = (roles) => {
    const manager = roles.find((item) => item === 'manager');
    const employee = roles.find((item) => item === 'employee');
    const role = manager || employee
    return role;
  };

  render() {
    const {
      match: { params: { tabName = '', type = '' } = {} },
      location: { state: { isEmployeeMode = false } = {} } = {},
    } = this.props;

    //const viewOffboarding = initViewOffboarding();
    const renderComponent = {
      manager: <ManagerTicket tabName={tabName} />,
      employee: <EmployyeTicket tabName={tabName} />,
    };

    const listRole = localStorage.getItem('antd-pro-authority');
    const role = this.findRole(JSON.parse(listRole));

    return renderComponent[role];
  }
}

export default TicketsManagement;
