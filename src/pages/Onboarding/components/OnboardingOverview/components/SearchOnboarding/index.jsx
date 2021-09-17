import React, { Component } from 'react';
import { Input, Drawer, Button } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { connect } from 'umi';
import { isEmpty } from 'lodash';

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
      filter: {
        processStatus: undefined,
        title: [],
        location: [],
      },
      isFilter: false,
    };
  }

  componentDidUpdate() {
    this.disableScrollView();
  }

  componentWillUnmount() {
    document.body.style.overflow = 'auto';
  }

  disableScrollView = () => {
    const { visible } = this.state;
    if (visible) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  };

  clearFilter = () => {
    this.setState({
      filter: {
        processStatus: undefined,
        title: [],
        location: [],
      },
      isFilter: false,
    });
  };

  openFilter = (visible) => {
    const { dispatch } = this.props;

    this.setState({ visible });

    if (visible) {
      dispatch({
        type: 'onboarding/fetchJobTitleList',
        payload: {},
      });

      dispatch({
        type: 'onboarding/fetchLocationList',
        payload: {},
      });
    } else {
      this.clearFilter();
    }
  };

  onFilterChange = (value) => {
    const { filter } = this.state;

    if (isEmpty(value?.location) && isEmpty(value?.title) && !value?.processStatus) {
      this.clearFilter();
    } else {
      this.setState({
        isFilter: true,
        filter: {
          ...filter,
          ...value,
        },
      });
    }
  };

  onApply = () => {
    const { filter } = this.state;
    const payload = {
      ...filter,
      processStatus: filter.processStatus || '',
    };
    console.log(payload);
  };

  renderFooter = () => {
    const { isFilter } = this.state;
    return (
      <div className={styles.footer}>
        <Button onClick={() => this.openFilter(false)} className={styles.footer__clear}>
          Clear
        </Button>
        <Button onClick={this.onApply} disabled={!isFilter} className={styles.footer__apply}>
          Apply
        </Button>
      </div>
    );
  };

  render() {
    const { onChangeSearch = () => {} } = this.props;
    const { visible } = this.state;

    return (
      <div className={styles.search}>
        <div>
          <img
            onClick={() => this.openFilter(true)}
            alt="filter"
            src={filterIcon}
            className={styles.filterIcon}
          />
          <Drawer
            title="Filters"
            placement="right"
            destroyOnClose
            closable
            onClose={() => this.openFilter(false)}
            visible={visible}
            mask={false}
            closeIcon={<img alt="close" src={closeIcon} />}
            footer={this.renderFooter()}
          >
            <FilterForm onFilterChange={this.onFilterChange} />
          </Drawer>
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
