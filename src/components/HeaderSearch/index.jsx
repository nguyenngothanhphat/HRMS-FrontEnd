import React, { Component } from 'react';
import { Input, Dropdown } from 'antd';
import { SearchOutlined, CaretDownOutlined, CloseOutlined } from '@ant-design/icons';
import { history, connect } from 'umi';
import { getCurrentCompany, getCurrentTenant } from '@/utils/authority';
import ViewHistory from './components/ViewHistory';
import ViewAdvancedSearch from './components/ViewAdvancedSearch';
import styles from './index.less';

@connect(({ user: { currentUser = {} }, loading }) => ({
  currentUser,
  loadingProfile: loading.effects['employeeProfile/fetchGeneralInfo'],
}))
class HeaderSearch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      q: '',
      mode: 'history',
      visible: false,
    };
  }

  componentDidMount() {
    const { dispatch, currentUser } = this.props;
    dispatch({
      type: 'searchAdvance/getHistorySearch',
      payload: {
        user: currentUser._id,
        tenantId: getCurrentTenant(),
        company: getCurrentCompany(),
      },
    });
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

  closeSearch = (isChangeMode) => {
    this.setState({
      visible: false,
      mode: isChangeMode ? 'history' : 'advanced',
    });
  };

  forceOpenAdvanced = () => {
    this.setState({
      visible: true,
      mode: 'advanced',
    });
  };

  resetSearch = () => {
    this.setState({
      q: '',
      mode: 'history',
      visible: false,
    });
  };

  renderAdvancedSearch = () => {
    const { mode, q } = this.state;
    return (
      <div className={styles.viewAdvancedSearch}>
        {mode === 'history' ? (
          <ViewHistory
            changeMode={this.changeMode}
            closeSearch={this.closeSearch}
            setKeyword={this.setKeyword}
            resetSearch={this.resetSearch}
          />
        ) : (
          <ViewAdvancedSearch closeSearch={this.closeSearch} keySearch={q} />
        )}
      </div>
    );
  };

  setKeyword = (value) => {
    this.setState({ q: value });
  };

  onChangeInput = ({ target: { value } }) => {
    this.setState({
      q: value,
    });
  };

  onPressEnter = ({ target: { value } }) => {
    this.closeSearch(true);
    history.push({
      pathname: '/search-result',
      query: { keySearch: value },
    });
  };

  render() {
    const { visible, q } = this.state;
    const className = visible ? styles.viewOpen : styles.viewClose;
    return (
      <div className={className}>
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
            suffix={
              <div className={styles.viewSuffix}>
                {q && (
                  <div
                    className={styles.viewSuffix__circle}
                    style={{ marginRight: '12px' }}
                    onClick={() => {
                      this.setState({ q: '' });
                    }}
                  >
                    <CloseOutlined className={styles.viewSuffix__circle__icon} />
                  </div>
                )}
                <div className={styles.viewSuffix__circle} onClick={this.forceOpenAdvanced}>
                  <CaretDownOutlined className={styles.viewSuffix__circle__icon} />
                </div>
              </div>
            }
            onPressEnter={this.onPressEnter}
          />
        </Dropdown>
      </div>
    );
  }
}

export default HeaderSearch;
