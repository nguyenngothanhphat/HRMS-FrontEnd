import React, { PureComponent } from 'react';
import { Layout } from 'antd';
import Animate from 'rc-animate';
import { connect } from 'dva';
import GlobalHeader from '@/components/GlobalHeader';

const { Header } = Layout;
@connect(({ user, global }) => ({
  currentUser: user.currentUser,
  collapsed: global.collapsed,
}))
class HeaderView extends PureComponent {
  state = {
    visible: true,
  };

  static getDerivedStateFromProps(props, state) {
    if (!props.autoHideHeader && !state.visible) {
      return {
        visible: true,
      };
    }
    return null;
  }

  handleMenuClick = ({ key }) => {
    const { dispatch } = this.props;
    if (key === 'logout') {
      dispatch({
        type: 'login/logout',
      });
    }
  };

  render() {
    const { handleMenuCollapse } = this.props;
    const { visible } = this.state;
    const HeaderDom = visible ? (
      <Header
        style={{
          padding: 0,
          width: '100%',
          backgroundColor: '#000',
          height: '4rem',
          lineHeight: '0',
        }}
      >
        <GlobalHeader
          onCollapse={handleMenuCollapse}
          onMenuClick={this.handleMenuClick}
          {...this.props}
        />
      </Header>
    ) : null;
    return (
      <Animate component="" transitionName="fade">
        {HeaderDom}
      </Animate>
    );
  }
}

export default HeaderView;
