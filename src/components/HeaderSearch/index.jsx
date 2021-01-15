import React, { Component } from 'react';
import { Input, Dropdown } from 'antd';
import { SearchOutlined, EnterOutlined } from '@ant-design/icons';
import { history } from 'umi';
import ViewHistory from './components/ViewHistory';
import ViewAdvancedSearch from './components/ViewAdvancedSearch';
import styles from './index.less';

class HeaderSearch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      q: '',
      mode: 'history',
      visible: false,
    };
  }

  changeMode = (mode) => {
    const { q } = this.state;
    this.setState({
      mode,
      q: mode === 'advanced' ? '' : q,
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

  closeSearch = () => {
    this.setState({ visible: false, mode: 'history' });
  };

  renderAdvancedSearch = () => {
    const { mode } = this.state;
    return (
      <div className={styles.viewAdvancedSearch}>
        {mode === 'history' ? (
          <ViewHistory changeMode={this.changeMode} />
        ) : (
          <ViewAdvancedSearch changeMode={this.changeMode} closeSearch={this.closeSearch} />
        )}
      </div>
    );
  };

  onChangeInput = ({ target: { value } }) => {
    this.setState({
      q: value,
    });
  };

  onPressEnter = ({ target: { value } }) => {
    history.push({
      pathname: '/search-result',
      query: { keySearch: value },
    });
  };

  render() {
    const { visible, q } = this.state;
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
            value={q}
            size="large"
            placeholder="Search for Employees, Documents, Reports, Events and Requests"
            onChange={this.onChangeInput}
            prefix={<SearchOutlined />}
            suffix={<EnterOutlined style={{ fontSize: '11px', opacity: 0.5, cursor: 'pointer' }} />}
            onPressEnter={this.onPressEnter}
          />
        </Dropdown>
      </div>
    );
  }
}

export default HeaderSearch;
