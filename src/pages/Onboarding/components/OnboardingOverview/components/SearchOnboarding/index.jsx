import React, { Component } from 'react';
import { Input, Drawer, Button } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { connect } from 'umi';
import { isEmpty, values } from 'lodash';

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
        pendingStatus: undefined,
        otherStatus: undefined,
        title: [],
        location: [],
        dateOfJoinFrom: null,
        dateOfJoinTo: null,
      },
      isFilter: false,
    };
  }

  componentDidUpdate(prevProps, prevState) {
    const { filter } = this.state;
    this.disableScrollView();

    if (JSON.stringify(prevState.filter) !== JSON.stringify(filter)) {
      this.validateFilterFields(filter);
    }
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

  validateFilterFields = (filter) => {
    if (!filter.dateOfJoinFrom && !filter.dateOfJoinTo) {
      // in case without filter date
      const isEmptyValue = values(filter).every(isEmpty);
      this.setState({
        isFilter: !isEmptyValue, // if all fields value is empty => means not filtering
      });
    } else if (filter.dateOfJoinFrom && filter.dateOfJoinTo) {
      // in case filter date, must select 2 date fields
      this.setState({
        isFilter: true,
      });
    } else {
      this.setState({
        isFilter: false,
      });
    }
  };

  clearFilter = (value = {}) => {
    const { filter } = this.state;

    if (isEmpty(value)) {
      // press X or Clear button
      this.setState({
        filter: {
          pendingStatus: undefined,
          otherStatus: undefined,
          title: [],
          location: [],
          dateOfJoinFrom: null,
          dateOfJoinTo: null,
        },
        isFilter: false,
      });
    } else {
      this.setState({
        filter: {
          ...filter,
          ...value,
        },
      });
    }
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

    if (
      isEmpty(value?.location) &&
      isEmpty(value?.title) &&
      !value?.pendingStatus &&
      !value?.otherStatus &&
      !value?.dateOfJoinFrom &&
      !value?.dateOfJoinTo
    ) {
      this.clearFilter(value);
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
      pendingStatus: filter.pendingStatus || '',
      otherStatus: filter.otherStatus || '',
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
        <div className="site-drawer-render-in-current-wrapper">
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
            // getContainer={false}
            // style={{ position: 'absolute' }}
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
