import React from 'react';
import { Redirect, connect } from 'umi';
import { PageLoading } from '@/layouts/layout/src';
import { getToken } from '../utils/token';
import { getIsSwitchingRole } from '../utils/authority';

class SecurityLayout extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isReady: false,
    };
  }

  componentDidMount() {
    this.setState({
      isReady: true,
    });
    const token = getToken();
    const isSwitchingRole = getIsSwitchingRole();
    const { dispatch } = this.props;

    if (isSwitchingRole && dispatch && token) {
      dispatch({
        type: 'user/fetchCurrent',
        isSwitchingRole: true,
      });
    } else {
      dispatch({
        type: 'user/fetchCurrent',
        isSwitchingRole: false,
      });
    }
  }

  render() {
    const { isReady } = this.state;
    const { children, loading, currentUser } = this.props;
    const isLogin = currentUser && currentUser._id;

    if ((!isLogin && loading) || !isReady) {
      return <PageLoading />;
    }

    if (!isLogin && window.location.pathname !== '/login') {
      return <Redirect to="/login" />;
    }

    return children;
  }
}

export default connect(({ user, loading }) => ({
  currentUser: user.currentUser,
  loading: loading.models.user,
}))(SecurityLayout);
