import React, { Component } from 'react';
import { connect } from 'dva';
import Redirect from 'umi/redirect';
import RenderAuthorized from '@/components/Authorized';
import { getAuthority } from '@/utils/authority';
import { getToken } from '@/utils/token';

const Authority = getAuthority();
const Authorized = RenderAuthorized(Authority);
const { check } = Authorized;

@connect()
class AuthorizedPage extends Component {
  auth = async () => {
    const {
      dispatch,
      children: {
        props: {
          route: { authority },
        },
      },
    } = this.props;

    const { token } = getToken();
    if (!token) throw new Error();
    // const result =
    await dispatch({ type: 'user/fetchCurrent' });
    // if (!result && token) throw new Error();
    const flag = check(authority, true);
    if (!flag) throw new Error();
  };

  render() {
    const { children } = this.props;

    return (
      <Authorized authority={this.auth} noMatch={<Redirect to="/login" />}>
        {children}
      </Authorized>
    );
  }
}

export default AuthorizedPage;
