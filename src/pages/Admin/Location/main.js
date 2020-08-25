import React, { Component } from 'react';
import { formatMessage } from 'umi-plugin-react/locale';
import { Menu, Icon, Row, Col, Skeleton } from 'antd';
import { connect } from 'dva';
import { Link } from 'umi';
import pathToRegexp from 'path-to-regexp';
import { isUrl } from '@/utils/utils';
import General from './components/General';
import Financier from './components/Financier';
import Advanced from './components/Advanced';

const getIcon = icon => {
  if (typeof icon === 'string' && isUrl(icon)) {
    return <img src={icon} alt="icon" />;
  }

  if (typeof icon === 'string') {
    return <Icon type={icon} style={{ fontSize: '18px' }} />;
  }
  return icon;
};

function getCodeScreen(width) {
  let code;
  const screens = {
    xxl: 1600,
    xl: 1200,
    lg: 992,
    md: 768,
    sm: 576,
  };
  const match = Object.keys(screens).some(key => {
    const value = screens[key];
    code = key;
    return width >= value;
  });
  return match ? code : 'xs';
}

@connect(({ locations: { item }, loading, menu: { locationMenuData } }) => ({
  item,
  locationMenuData,
  loading: loading.effects['locations/fetchItem'],
}))
class MainPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      mode: 'inline',
      path: '/admin/location/:locationID(\\d+)/:page?',
    };
  }

  componentDidMount() {
    const {
      match: {
        params: { locationID },
      },
      dispatch,
    } = this.props;
    dispatch({ type: 'locations/fetchItem', payload: locationID });
    window.addEventListener('resize', this.resize);
    this.resize();
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({ type: 'locations/refreshItem' });
    window.removeEventListener('resize', this.resize);
  }

  resize = () => {
    if (!window) {
      return;
    }
    requestAnimationFrame(() => {
      if (!window) {
        return;
      }
      const { innerWidth } = window;
      const code = getCodeScreen(innerWidth);
      let modObj = {};
      ['xxl', 'xl', 'lg', 'md', 'sm', 'xs'].forEach(key => {
        modObj = { ...modObj, [key]: 'inline' };
      });
      modObj = { ...modObj, xs: 'horizontal', sm: 'horizontal', md: 'horizontal' };
      this.setState({
        mode: modObj[code],
      });
    });
  };

  render() {
    const {
      match: {
        params: { locationID, page = 'general' },
      },
      item,
      loading,
    } = this.props;
    const { mode, path } = this.state;
    const locationMenuData = [
      {
        key: 'general',
        name: 'menu.location.general',
        component: General,
      },
      {
        key: 'financier',
        name: 'menu.location.financier',
        component: Financier,
      },
      {
        key: 'advanced',
        name: 'menu.location.advanced',
        component: Advanced,
      },
    ];
    const { component: Children } =
      locationMenuData.find(el => el.key === page) || locationMenuData[0];
    return (
      <Row className="m-4 bg-white" type="flex">
        <Col span={24} lg={6} xl={5}>
          <Menu mode={mode} style={{ height: '100%' }} defaultSelectedKeys={[page]}>
            {locationMenuData.map(el => {
              const toPath = pathToRegexp.compile(path);

              return (
                <Menu.Item key={el.key}>
                  <Link to={toPath({ locationID, page: el.key })}>
                    {el.icon && getIcon(el.icon)}
                    {formatMessage({ id: el.name })}
                  </Link>
                </Menu.Item>
              );
            })}
          </Menu>
        </Col>
        <Col span={24} lg={18} xl={19} style={{ padding: '24px', minHeight: 280 }}>
          <Skeleton paragraph={{ rows: 8 }} loading={loading}>
            {item && <Children item={item} />}
          </Skeleton>
        </Col>
      </Row>
    );
  }
}

export default MainPage;
