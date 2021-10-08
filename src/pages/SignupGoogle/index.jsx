import React, { useEffect } from 'react';
import { connect } from 'umi';
import { Spin } from 'antd';

const SignupGoogle = (props) => {
  const { location: { query: { code = '' } = {} } = {}, dispatch } = props;
  useEffect(() => {
    dispatch({
      type: 'login/loginGoogle',
      payload: { code },
    });
  }, [code]);

  return (
    <Spin
      size="large"
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%',
      }}
    />
  );
};
export default connect(({ loading }) => ({ loadingSignin: loading.effects['login/loginGoogle'] }))(
  SignupGoogle,
);
