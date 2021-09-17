import React, { Component } from 'react';
import { Input, Drawer } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

import filterIcon from '@/assets/offboarding-filter.svg';
import closeIcon from '@/assets/closeIcon.svg';
import FilterForm from './components/FilterForm';

import styles from './index.less';

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
    this.setState({ visible });
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
            getContainer
          >
            <FilterForm />
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
