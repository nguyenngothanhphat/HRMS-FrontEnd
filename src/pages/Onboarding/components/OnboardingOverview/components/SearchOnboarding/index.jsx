import React, { Component } from 'react';
import { Input, Popover } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { connect } from 'umi';

import filterIcon from '@/assets/offboarding-filter.svg';
import closeIcon from '@/assets/closeIcon.svg';
import FilterForm from './components/FilterForm';

import styles from './index.less';

@connect()
class SearchOnboarding extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };
  }

  openFilter = () => {
    const { dispatch } = this.props;
    const { visible } = this.state;

    this.setState({ visible: !visible });

    if (!visible) {
      dispatch({
        type: 'onboarding/fetchJobTitleList',
        payload: {},
      });

      dispatch({
        type: 'onboarding/fetchLocationList',
        payload: {},
      });

      dispatch({
        type: 'onboarding/saveSearch',
        payload: { isFilter: true },
      });
    } else {
      dispatch({
        type: 'onboarding/saveSearch',
        payload: { isFilter: false },
      });
    }
  };

  renderTitle = () => {
    return (
      <div className={styles.title}>
        <div className={styles.title__text}>Filter</div>
        <img
          alt="close"
          src={closeIcon}
          onClick={() => {
            const { dispatch } = this.props;

            this.setState({ visible: false });
            dispatch({
              type: 'onboarding/saveSearch',
              payload: { isFilter: false },
            });
          }}
        />
      </div>
    );
  };

  render() {
    const { onChangeSearch = () => {} } = this.props;
    const { visible } = this.state;

    return (
      <div className={styles.search}>
        <div className="site-drawer-render-in-current-wrapper">
          <Popover
            content={<FilterForm />}
            title={this.renderTitle()}
            trigger="click"
            placement="bottomRight"
            visible={visible}
            onVisibleChange={this.openFilter}
          >
            <img alt="filter" src={filterIcon} className={styles.filterIcon} />
          </Popover>
        </div>
        <Input
          onChange={(e) => onChangeSearch(e.target.value)}
          placeholder="Search by name or ID"
          prefix={<SearchOutlined />}
        />
      </div>
    );
  }
}

export default SearchOnboarding;
