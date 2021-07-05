import React, { Component } from 'react';
import { Button, Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import filterIcon from '@/assets/offboarding-filter.svg';
import styles from '../RelievingTables/index.less';

class TableSearch extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  onPressEnter = ({ target: { value } }) => {
    // console.log('enter value: ', value);
  };

  onChangeInput = (e) => {
    e.preventDefault();
    const { onSearch = () => {} } = this.props;
    onSearch(e.target.value);
  };

  render() {
    return (
      <div className={styles.searchFilter}>
        <Button
          type="link"
          shape="round"
          icon={<img src={filterIcon} alt="" className={styles.searchFilter__icon} />}
          size="small"
        />

        <Input
          size="large"
          placeholder="Search for Ticket numer, resignee, request ..."
          onChange={this.onChangeInput}
          prefix={<SearchOutlined />}
          onPressEnter={this.onPressEnter}
          className={styles.searchFilter__input}
        />
      </div>
    );
  }
}

export default TableSearch;
