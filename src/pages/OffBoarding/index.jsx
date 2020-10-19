// import React, { PureComponent } from 'react';
// import { connect } from 'umi';
// import ManagerOffBoading from './ManagerOffBoarding';
// import EmployeeOffBoading from './EmployeeOffBoarding';

// @connect(({ user: { currentUser: { roles = [] } = {} } }) => ({
//   roles,
// }))
// class Overall extends PureComponent {
//   constructor(props) {
//     super(props);
//     this.state = {
//       // role: true,
//       // role: false,
//     };
//   }

//   render() {
//     const { roles } = this.props;

//     const mapRoles = roles.map((x) => x._id);

//     return (
//       <div>{mapRoles.includes('HR') === true ? <ManagerOffBoading /> : <EmployeeOffBoading />}</div>
//     );
//   }
// }

// export default Overall;
