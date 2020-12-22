import React, { Component } from 'react';
import { Input, Dropdown } from 'antd';
import { SearchOutlined, EnterOutlined } from '@ant-design/icons';
import ViewHistory from './components/ViewHistory';
import ViewAdvancedSearch from './components/ViewAdvancedSearch';
import styles from './index.less';

class HeaderSearch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // q:'',
      mode: 'history',
      visible: false,
    };
  }

  changeMode = (mode) => {
    this.setState({
      mode,
    });
  };

  handleVisibleChange = (flag) => {
    this.setState({ visible: flag });
    if (!flag) {
      this.setState({
        mode: 'history',
      });
    }
  };

  renderAdvancedSearch = () => {
    const { mode } = this.state;
    return (
      <div className={styles.viewAdvancedSearch}>
        {mode === 'history' ? (
          <ViewHistory changeMode={this.changeMode} />
        ) : (
          <ViewAdvancedSearch changeMode={this.changeMode} />
        )}
      </div>
    );
  };

  render() {
    const { visible } = this.state;
    return (
      <div className={styles.root}>
        <Dropdown
          overlay={this.renderAdvancedSearch()}
          placement="bottomCenter"
          trigger={['click']}
          visible={visible}
          onVisibleChange={this.handleVisibleChange}
        >
          <Input
            size="large"
            placeholder="Search for Employees, Documents, Reports, Events and Requests"
            prefix={<SearchOutlined />}
            suffix={<EnterOutlined style={{ fontSize: '11px', opacity: 0.5, cursor: 'pointer' }} />}
          />
        </Dropdown>
      </div>
    );
  }
}

export default HeaderSearch;
