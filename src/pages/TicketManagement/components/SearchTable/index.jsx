import React, { Component } from 'react';
import { connect } from 'umi';
import closeIcon from '@/assets/closeIcon.svg';
import CustomSearchBox from '@/components/CustomSearchBox';
import FilterButton from '@/components/FilterButton';
import FilterPopover from '@/components/FilterPopover';
import FilterForm from './components/FilterForm';
import styles from './index.less';

@connect(({ ticketManagement: { filter = {} } = {} }) => ({ filter }))
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
    const { onChangeSearch = () => {}, filter, isFiltering } = this.props;
    const { visible } = this.state;
    return (
      <div className={styles.searchFilter}>
        <div>
          <FilterPopover
            content={<FilterForm visible={visible} {...this.props} />}
            title={this.renderTitle()}
            trigger="click"
            placement="bottomRight"
            visible={visible}
            onVisibleChange={this.openFilter}
            realTime
          >
            <FilterButton fontSize={14} showDot={isFiltering} />
          </FilterPopover>
        </div>
        <CustomSearchBox
          placeholder="Search by Name, user ID"
          onSearch={(e) => onChangeSearch(e.target.value)}
        />
      </div>
    );
  }
}

export default SearchTable;
