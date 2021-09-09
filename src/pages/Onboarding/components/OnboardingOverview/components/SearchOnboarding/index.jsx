import React, { Component } from 'react';
import { Input } from 'antd';
import filterIcon from '@/assets/offboarding-filter.svg';
import { SearchOutlined } from '@ant-design/icons';

import styles from './index.less';

class SearchOnboarding extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { onChangeSearch = () => {} } = this.props;
    return (
      <div className={styles.search}>
        <img alt="filter" src={filterIcon} className={styles.filterIcon} />
        <Input
          onChange={(e) => onChangeSearch(e.target.value)}
          placeholder="Search"
          prefix={<SearchOutlined />}
        />
      </div>
    );
  }
}

export default SearchOnboarding;
