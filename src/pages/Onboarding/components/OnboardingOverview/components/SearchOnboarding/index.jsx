import React, { Component } from 'react';
import { Input, Popover, Tag } from 'antd';
import { CloseOutlined, SearchOutlined } from '@ant-design/icons';
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
      applied: 0,
      form: null,
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

  onClose = () => {
    const { form } = this.state;
    this.setState({ applied: 0 });
    form();
  };

  callback = (apply) => {
    const filteredObj = Object.entries(apply).filter(
      ([key, value]) => (value !== undefined && value?.length > 0) || value?.isValid,
    );
    const newObj = Object.fromEntries(filteredObj);
    this.setState({ applied: Object.keys(newObj).length });
    // console.log(apply, Object.keys(newObj).length);
  };

  callbackClose = (close) => {
    this.setState({ form: close });
  };

  render() {
    const { onChangeSearch = () => {} } = this.props;
    const { visible, applied } = this.state;

    return (
      <div className={styles.search}>
        {applied > 0 && (
          <Tag
            className={styles.tagCountFilter}
            closable
            onClose={this.onClose}
            closeIcon={<CloseOutlined />}
          >
            {applied} applied
          </Tag>
        )}
        <div className="site-drawer-render-in-current-wrapper">
          <Popover
            content={<FilterForm callback={this.callback} callbackClose={this.callbackClose} />}
            title={this.renderTitle()}
            trigger="click"
            placement="bottomRight"
            visible={visible}
            onVisibleChange={this.openFilter}
            overlayClassName={styles.filterPopover}
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
