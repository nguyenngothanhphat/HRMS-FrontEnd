import React from 'react';
import { connect } from 'dva';
import Step1 from './Step1';
import Step2 from './Step2';

const Login = props => {
  const { login: { companyCode = [] } = {} } = props;
  return <React.Fragment>{companyCode.length > 0 ? <Step2 /> : <Step1 />}</React.Fragment>;
};

export default connect(({ login }) => ({
  login,
}))(Login);
