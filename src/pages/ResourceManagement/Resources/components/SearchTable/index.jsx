import React, { PureComponent } from 'react';
import { Input, Popover } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import filterIcon from '@/assets/ticketManagement-filter.svg';
import closeIcon from '@/assets/closeIcon.svg';
import FilterForm from './components/FilterForm';
import styles from './index.less';

class SearchTable extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };
  }

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

  onPressEnter = ({ target: { value } }) => {
    console.log(value);
  };

  onChangeInput = (e) => {
    e.preventDefault();
    const { onSearch = () => {} } = this.props;
    onSearch(e.target.value);
  };

  openFilter = () => {
    const { visible } = this.state;
    this.setState({ visible: !visible });
  };

  render() {
    const {visible} = this.state;
    const {filter, onFilterChange} = this.props
    return (
      <div className={styles.searchFilter}>
        <div>
          <Popover
            on
            content={<FilterForm onFilterChange={onFilterChange} filter={filter} />}
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
        <div className={styles.searchFilter__input}>
          <Input
            size="large"
            placeholder="Search by Name, user ID"
            onChange={this.onChangeInput}
            prefix={<SearchOutlined />}
            onPressEnter={this.onPressEnter}
          />
        </div>
      </div>
    );
  }
}

export default SearchTable;
