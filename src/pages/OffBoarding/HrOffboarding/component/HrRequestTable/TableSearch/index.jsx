import React, { Component } from 'react';
import { Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import filterIcon from '@/assets/offboarding-filter.svg';
import styles from '../index.less';

class TableSearch extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  onPressEnter = ({ target: { value } }) => {
    console.log('enter value: ', value);
  };

  onChangeInput = (e) => {
    e.preventDefault();
    const { onSearch = () => {} } = this.props;
    onSearch(e.target.value);
  };

  render() {
    return (
      <div className={styles.searchFilter}>
        <img src={filterIcon} alt="" className={styles.searchFilter__icon} />
        <Input
          size="large"
          placeholder="Search for Ticket numer, resignee, request ..."
          onChange={(e) => this.onChangeInput(e)}
          prefix={<SearchOutlined />}
          onPressEnter={this.onPressEnter}
          className={styles.searchFilter__input}
        />
      </div>
    );
  }
}

export default TableSearch;
