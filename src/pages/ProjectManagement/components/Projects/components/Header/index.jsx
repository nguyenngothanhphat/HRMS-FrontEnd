import { Tag, Button, Select, Skeleton } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import { debounce } from 'lodash';
import React, { Suspense, useEffect, useState } from 'react';
import { connect } from 'umi';
import AddIcon from '@/assets/projectManagement/add.svg';
import ArrowDown from '@/assets/projectManagement/arrowDown.svg';
import CommonModal from '@/components/CommonModal';
import CustomSearchBox from '@/components/CustomSearchBox';
import FilterButton from '@/components/FilterButton';
import AddProjectModalContent from '../AddProjectModalContent';
import FilterPopover from '@/components/FilterPopover';
import FilterContent from '../FilterContent';
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
  const [applied, setApplied] = useState(0);
  const [form, setForm] = useState('');

  // permissions
  const addProjectPermission = permissions.addProject !== -1;

  // redux
  const { projectManagement: { projectStatusList = [] } = {} } = props;

  // if reselect project status or search, clear filter form
  const [needResetFilterForm, setNeedResetFilterForm] = useState(false);
  const [isFiltering, setIsFiltering] = useState(false);

  const onSearchDebounce = debounce((value) => {
    fetchProjectList({ searchKey: value });
    setNeedResetFilterForm(true);
  }, 1000);

  const onSearch = (e = {}) => {
    const { value = '' } = e.target;
    onSearchDebounce(value);
  };

  const onFilter = (payload) => {
    fetchProjectList(payload);
    if (Object.keys(payload).length > 0) {
      setIsFiltering(true);
      setApplied(Object.keys(payload).length);
    } else {
      setIsFiltering(false);
      setApplied(0);
    }
  };

  const clearFilter = () => {
    fetchProjectList();
    form?.resetFields();
    setApplied(0);
    setIsFiltering(false);
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
        {applied > 0 && (
          <Tag
            className={styles.tagCountFilter}
            closable
            closeIcon={<CloseOutlined />}
            onClose={() => {
              clearFilter();
            }}
          >
            {applied} applied
          </Tag>
        )}
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
          content={
            <Suspense fallback={<Skeleton active />}>
              <FilterContent
                needResetFilterForm={needResetFilterForm}
                setNeedResetFilterForm={setNeedResetFilterForm}
                onFilter={onFilter}
                setForm={setForm}
              />
            </Suspense>
          }
          realTime
        >
          <FilterButton showDot={isFiltering} />
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
