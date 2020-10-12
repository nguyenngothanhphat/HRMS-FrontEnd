import React, { PureComponent } from 'react';
// import { connect } from 'dva';
import ManagerOffBoading from './ManagerOffBoarding';
import EmployeeOffBoading from './EmployeeOffBoarding';
// @connect(({ user: { currentUser: { role = '' } = {} } }) => ({
//   role,
// }))
class Overall extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      // role: true,
      role: false,
    };
  }

  render() {
    const { role } = this.state;
    return <div>{role === true ? <EmployeeOffBoading /> : <ManagerOffBoading />}</div>;
  }
}

export default Overall;
