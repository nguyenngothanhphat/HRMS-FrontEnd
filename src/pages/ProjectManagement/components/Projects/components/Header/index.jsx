import { Button, Select } from 'antd';
import { debounce } from 'lodash';
import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import AddIcon from '@/assets/projectManagement/add.svg';
import ArrowDown from '@/assets/projectManagement/arrowDown.svg';
import CommonModal from '@/components/CommonModal';
import CustomSearchBox from '@/components/CustomSearchBox';
import FilterButton from '@/components/FilterButton';
import AddProjectModalContent from '../AddProjectModalContent';
import FilterPopover from '../FilterPopover';
import styles from './index.less';

const { Option } = Select;

const Header = (props) => {
  const {
    dispatch,
    statusSummary = [],
    projectStatus = 'All',
    setProjectStatus = () => {},
    fetchProjectList = () => {},
    permissions = {},
    loadingAddProject = false,
  } = props;
  const [addProjectModalVisible, setAddProjectModalVisible] = useState(false);

  // permissions
  const addProjectPermission = permissions.addProject !== -1;

  // redux
  const { projectManagement: { projectStatusList = [] } = {} } = props;

  // if reselect project status or search, clear filter form
  const [needResetFilterForm, setNeedResetFilterForm] = useState(false);

  const onFilter = (payload) => {
    fetchProjectList(payload);
  };

  const onSearchDebounce = debounce((value) => {
    fetchProjectList({ searchKey: value });
    setNeedResetFilterForm(true);
  }, 1000);

  const onSearch = (e = {}) => {
    const { value = '' } = e.target;
    onSearchDebounce(value);
  };

  useEffect(() => {
    setNeedResetFilterForm(true);
  }, [projectStatus]);

  useEffect(() => {
    dispatch({
      type: 'projectManagement/fetchProjectStatusListEffect',
    });
  }, []);

  const allCount = statusSummary.find((x) => x.statusName === 'All Projects');

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
            <Option value="All">All Projects ({allCount?.count || 0})</Option>
            {projectStatusList.map((v) => {
              const find = statusSummary.find((x) => x.statusName === v.status);
              return (
                <Option value={v.id}>
                  {v.status} ({find?.count || 0})
                </Option>
              );
            })}
          </Select>
        </div>
      </div>

      <div className={styles.Header__right}>
        {addProjectPermission && (
          <Button
            onClick={() => setAddProjectModalVisible(true)}
            icon={<img src={AddIcon} alt="" />}
          >
            Add new Project
          </Button>
        )}
        <FilterPopover
          placement="bottomRight"
          onSubmit={onFilter}
          needResetFilterForm={needResetFilterForm}
          setNeedResetFilterForm={setNeedResetFilterForm}
        >
          <FilterButton />
        </FilterPopover>
        <CustomSearchBox onSearch={onSearch} placeholder="Search by Project ID, customer name" />
      </div>

      <CommonModal
        visible={addProjectModalVisible}
        title="Add new Project"
        loading={loadingAddProject}
        content={
          <AddProjectModalContent
            visible={addProjectModalVisible}
            onClose={() => setAddProjectModalVisible(false)}
          />
        }
        onClose={() => setAddProjectModalVisible(false)}
      />
    </div>
  );
};

export default connect(({ projectManagement, user: { permissions = {} }, loading }) => ({
  permissions,
  projectManagement,
  loadingAddProject: loading.effects['projectManagement/addProjectEffect'],
}))(Header);
