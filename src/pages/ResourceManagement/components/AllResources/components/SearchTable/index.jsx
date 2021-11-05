import React, { useState } from 'react';
import { Input, Popover } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import filterIcon from '@/assets/ticketManagement-filter.svg';
import closeIcon from '@/assets/closeIcon.svg';
import FilterForm from './components/FilterForm';
import styles from './index.less';

const SearchTable = () => {
    const [state, setState] = useState({
        visible: false,
    })
    const openFilter = () => {
        const { visible } = state;
        setState({ visible: !visible });
    }
    const renderTitle = () => {
        return (
          <div className={styles.title}>
            <div className={styles.title__text}>Filter</div>
            <img
              alt="close"
              src={closeIcon}
              onClick={() => {
                        setState({ visible: false })
                    }}
            />
          </div>
        );
    };
    const onPressEnter = ({ target: { value } }) => {

    };

    const onChangeInput = (e) => {
        e.preventDefault();

    };
    const { visible } = state;
    return (
      <div className={styles.searchFilter}>
        <div>
          <Popover
            content={<FilterForm />}
            title={renderTitle()}
            trigger="click"
            placement="bottomRight"
            visible={visible}
            onVisibleChange={openFilter}
            overlayClassName={styles.filterPopover}
          >
            <img alt="filter" src={filterIcon} className={styles.filterIcon} />
          </Popover>
        </div>
        <Input
          size="large"
          placeholder="Search by Name, user ID"
          onChange={(e) => onChangeInput(e)}
          prefix={<SearchOutlined />}
          onPressEnter={onPressEnter}
          className={styles.searchFilter__input}
        />
      </div>
    )
}

export default SearchTable
