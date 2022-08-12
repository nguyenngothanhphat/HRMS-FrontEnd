import { Select, Skeleton } from 'antd';
import { debounce } from 'lodash';
import React, { Suspense, useEffect, useState } from 'react';
import { connect } from 'umi';
import ArrowDown from '@/assets/projectManagement/arrowDown.svg';
import CommonModal from '@/components/CommonModal';
import CustomAddButton from '@/components/CustomAddButton';
import CustomOrangeButton from '@/components/CustomOrangeButton';
import CustomSearchBox from '@/components/CustomSearchBox';
import FilterCountTag from '@/components/FilterCountTag';
import FilterPopover from '@/components/FilterPopover';
import AddProjectModalContent from '../AddProjectModalContent';
import FilterContent from '../FilterContent';
import styles from './index.less';

const { Option } = Select;

const Header = (props) => {
  const {
    dispatch,
    statusSummary = [],
    projectStatus = 'All',
    setProjectStatus = () => {},

    permissions = {},
    loadingAddProject = false,
    filter = {},
    setFilter = () => {},
    setSearchValue = () => {},
  } = props;
  const [addProjectModalVisible, setAddProjectModalVisible] = useState(false);

  // permissions
  const addProjectPermission = permissions.addProject !== -1;

  // redux
  const { projectManagement: { projectStatusList = [] } = {} } = props;

  const onSearchDebounce = debounce((value) => {
    setSearchValue(value);
  }, 1000);

  const onSearch = (e = {}) => {
    const { value = '' } = e.target;
    onSearchDebounce(value);
  };

  const onFilter = (values) => {
    setFilter(values);
  };

  useEffect(() => {
    onFilter({});
  }, [projectStatus]);

  useEffect(() => {
    dispatch({
      type: 'projectManagement/fetchProjectStatusListEffect',
    });
  }, []);

  const allCount = statusSummary.find((x) => x.statusName === 'All Projects');
  const applied = Object.values(filter).filter((v) => v).length;

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
        <FilterCountTag
          count={applied}
          onClearFilter={() => {
            onFilter({});
          }}
        />
        {addProjectPermission && (
          <CustomAddButton onClick={() => setAddProjectModalVisible(true)}>
            Add new Project
          </CustomAddButton>
        )}

        <FilterPopover
          placement="bottomRight"
          content={
            <Suspense fallback={<Skeleton active />}>
              <FilterContent filter={filter} onFilter={onFilter} />
            </Suspense>
          }
          realTime
        >
          <CustomOrangeButton showDot={applied > 0} />
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
