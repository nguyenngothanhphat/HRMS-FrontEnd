import React, { Component } from 'react';
import { Input, Drawer, Button } from 'antd';
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

  openFilter = (visible) => {
    const { dispatch } = this.props;

    this.setState({ visible });
    dispatch({
      type: 'onboarding/fetchJobTitleList',
      payload: {},
    });

    dispatch({
      type: 'onboarding/fetchLocationList',
      payload: {},
    });
  };

  onFilterChange = (value) => {
    console.log(value);
  };

  renderFooter = () => {
    return (
      <div className={styles.footer}>
        <Button className={styles.footer__clear}>Clear</Button>
        <Button className={styles.footer__apply}>Apply</Button>
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
