import React, { PureComponent } from 'react';
import { Input, Popover } from 'antd';
import { debounce } from 'lodash';
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

  onSearchDebounce = debounce((value) => {
    const { searchTable = () => {} } = this.props;
    searchTable({ searchKey: value });
  }, 1000);

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

  onChangeInput = (e = {}) => {
    const { value = '' } = e.target;
    this.onSearchDebounce(value);
  };

  openFilter = () => {
    const { visible } = this.state;
    this.setState({ visible: !visible });
  };

  render() {
    const { visible } = this.state;
    const { filter, onFilterChange } = this.props;
    return (
      <div className={styles.searchFilter}>
        <div>
          <Popover
            content={
              <FilterForm onFilterChange={onFilterChange} filter={filter} visible={visible} />
            }
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
          />
        </div>
      </div>
    );
  }
}

export default SearchTable;
