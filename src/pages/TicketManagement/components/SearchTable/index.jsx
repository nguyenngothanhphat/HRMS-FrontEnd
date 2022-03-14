import React, { Component } from 'react';
import { Input, Popover } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { connect } from 'umi';
import filterIcon from '@/assets/ticketManagement-filter.svg';
import closeIcon from '@/assets/closeIcon.svg';
import FilterForm from './components/FilterForm';
import styles from './index.less';

@connect()
class SearchTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };
  }

  openFilter = () => {
    const { visible } = this.state;

    this.setState({ visible: !visible });
  };

  renderTitle = () => {
    return (
      <div className={styles.title}>
        <div className={styles.title__text}>Filter</div>
        <img
          alt="close"
          src={closeIcon}
          onClick={() => {
            this.setState({ visible: false });
          }}
        />
      </div>
    );
  };

  render() {
    const { onChangeSearch = () => {} } = this.props;
    const { visible } = this.state;
    return (
      <div className={styles.searchFilter}>
        <div>
          <Popover
            content={<FilterForm visible={visible} />}
            title={this.renderTitle()}
            trigger="click"
            placement="bottomRight"
            visible={visible}
            onVisibleChange={this.openFilter}
            overlayClassName={styles.filterPopoverTicket}
          >
            <img alt="filter" src={filterIcon} className={styles.filterIcon} />
          </Popover>
        </div>
        <Input
          size="large"
          placeholder="Search by Name, user ID"
          onChange={(e) => onChangeSearch(e.target.value)}
          prefix={<SearchOutlined />}
          className={styles.searchFilter__input}
        />
      </div>
    );
  }
}

export default SearchTable;
