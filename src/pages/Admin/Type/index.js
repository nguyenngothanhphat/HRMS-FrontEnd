import React, { Component } from 'react';
import { Drawer } from 'antd';
import pathToRegexp from 'path-to-regexp';
import { formatMessage } from 'umi-plugin-react/locale';
import TypeList from '@/components/TypeList';
import TypeBox from './TypeBox';
import LayoutContent from '@/layouts/LayoutContent';

const defaultItem = {
  type: '',
  thumbnailUrl: '',
};

class Type extends Component {
  state = {
    item: defaultItem,
    visible: false,
  };

  showDrawer = () => {
    this.setState({
      item: defaultItem,
      visible: true,
    });
  };

  onClose = () => {
    this.setState({
      item: defaultItem,
      visible: false,
    });
  };

  handleOnClick = item => {
    this.setState({ item, visible: true });
  };

  render() {
    const {
      location: { pathname },
    } = this.props;
    const { item, visible } = this.state;
    const regexp = pathToRegexp('/admin/type/:status');
    let [, status] = regexp.exec(pathname) || ['', 'active'];
    const parse = {
      active: 'ACTIVE',
      disabled: 'INACTIVE',
    };
    status = parse[status];
    const content = (
      <div className="wrapper bg-white">
        <TypeList
          selectTypeStatus={status}
          onClick={this.handleOnClick}
          showDrawer={this.showDrawer}
        />

        <Drawer
          placement="right"
          width={303}
          onClose={this.onClose}
          visible={visible}
          destroyOnClose
        >
          <TypeBox
            selectTypeStatus={status}
            item={item}
            onClose={this.onClose}
            pathname={pathname}
          />
        </Drawer>
      </div>
    );
    return (
      <LayoutContent
        activeKey={status}
        tabs={[
          {
            name: formatMessage({ id: 'active' }),
            key: 'ACTIVE',
            content,
            link: '/admin/type/active',
          },
          {
            name: formatMessage({ id: 'disabled' }),
            key: 'INACTIVE',
            content,
            link: '/admin/type/disabled',
          },
        ]}
      />
    );
  }
}

export default Type;
