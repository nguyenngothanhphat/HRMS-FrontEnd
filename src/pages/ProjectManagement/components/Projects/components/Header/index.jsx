import { SearchOutlined } from '@ant-design/icons';
import { Button, Input, Select } from 'antd';
import { debounce } from 'lodash';
import React, { useState } from 'react';
import { connect } from 'umi';
import { TYPE_LIST } from '@/utils/projectManagement';
import FilterIcon from '@/assets/projectManagement/filter.svg';
import ArrowDown from '@/assets/projectManagement/arrowDown.svg';
import AddIcon from '@/assets/projectManagement/add.svg';
import FilterPopover from '../FilterPopover';
import AddProjectModal from '../AddProjectModal';
import styles from './index.less';

const { Option } = Select;

const Header = (props) => {
  const { projectStatus = 'All', setProjectStatus = () => {}, fetchProjectList = () => {} } = props;
  const [addProjectModalVisible, setAddProjectModalVisible] = useState(false);

  const onSearchDebounce = debounce((value) => {
    fetchProjectList(value);
  }, 1000);

  const onSearch = (e = {}) => {
    const { value = '' } = e.target;
    onSearchDebounce(value);
  };

  const searchPrefix = () => {
    return (
      <SearchOutlined
        style={{
          fontSize: 16,
          color: 'black',
          marginRight: '10px',
        }}
      />
    );
  };

  // MAIN AREA
  return (
    <div className={styles.Header}>
      <div className={styles.Header__left}>
        <div className={styles.projectSelector}>
          <Select
            value={projectStatus}
            onChange={(val) => setProjectStatus(val)}
            suffixIcon={<img src={ArrowDown} alt="" />}
          >
            {TYPE_LIST.map((v) => (
              <Option value={v.id}>{v.name}</Option>
            ))}
          </Select>
        </div>
      </div>

      <div className={styles.Header__right}>
        <Button onClick={() => setAddProjectModalVisible(true)} icon={<img src={AddIcon} alt="" />}>
          Add new Project
        </Button>
        <FilterPopover placement="bottomRight">
          <div className={styles.filterIcon}>
            <img src={FilterIcon} alt="" />
            <span>Filter</span>
          </div>
        </FilterPopover>
        <div className={styles.searchBar}>
          <Input
            className={styles.searchInput}
            placeholder="Search by Project ID, customer name"
            prefix={searchPrefix()}
            onChange={onSearch}
          />
        </div>
      </div>

      <AddProjectModal
        visible={addProjectModalVisible}
        onClose={() => setAddProjectModalVisible(false)}
      />
    </div>
  );
};

export default connect(() => ({}))(Header);
