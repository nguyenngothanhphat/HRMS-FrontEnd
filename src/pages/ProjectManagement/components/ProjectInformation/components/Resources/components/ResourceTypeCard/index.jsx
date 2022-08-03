import { Card, Popover, Tooltip } from 'antd';
import { debounce } from 'lodash';
import React, { useState } from 'react';
import { connect } from 'umi';
import ActionIcon from '@/assets/projectManagement/actionIcon.svg';
import AssignIcon from '@/assets/projectManagement/assignIcon.svg';
import DeleteIcon from '@/assets/projectManagement/deleteIcon.svg';
import EditIcon from '@/assets/projectManagement/editIcon.svg';
import OrangeAddIcon from '@/assets/projectManagement/orangeAdd.svg';
import ViewIcon from '@/assets/projectManagement/viewIcon.svg';
import CommonModal from '@/components/CommonModal';
import CommonTable from '@/components/CommonTable';
import CustomOrangeButton from '@/components/CustomOrangeButton';
import CustomSearchBox from '@/components/CustomSearchBox';
import FilterCountTag from '@/components/FilterCountTag';
import FilterPopover from '@/components/FilterPopover';
import AddResourceTypeContent from '../AddResourceTypeContent';
import AssignResourcesModal from '../AssignResourcesModal';
import DeleteResourceTypeContent from '../DeleteResourceTypeContent';
import ViewResourceTable from '../ViewResourceTable';
import FilterResourceTypeContent from './components/FilterResourceTypeContent';
import styles from './index.less';

const ResourceTypeCard = (props) => {
  const {
    loadingFetch = false,
    data = [],
    refreshResourceType = () => {},
    loadingAdd = false,
    loadingEdit = false,
    loadingDelete = false,
    setFilter = () => {},
    setSearchValue = () => {},
    filter = {},
  } = props;

  // permissions
  const { allowModify = false } = props;
  const [action, setAction] = useState('');

  const [addResourceTypeModalVisible, setAddResourceTypeModalVisible] = useState(false);
  const [deleteResourceType, setDeleteResourceType] = useState(false);
  const [viewResourceType, setViewResourceType] = useState(false);
  const [visiblePopover, setVisiblePopover] = useState(false);
  const [assignResourceModalVisible, setAssignResourceModalVisible] = useState(false);
  const [resourceTypeId, setResourceTypeId] = useState('');
  const [assigningRecord, setAssigningRecord] = useState({});
  const [editRecord, setEditRecord] = useState({});
  const [deleteRecord, setDeleteRecord] = useState({});
  const [viewRecord, setViewRecord] = useState({});

  const onSearchDebounce = debounce((value) => {
    setSearchValue(value);
  }, 1000);

  const onSearch = (e = {}) => {
    const { value = '' } = e.target;
    onSearchDebounce(value);
  };

  const handleLongString = (str) => {
    if (str.length <= 72) return str;
    return `${str.slice(0, 72)}...`;
  };

  const onFilter = (values) => {
    setFilter(values);
  };

  const renderComment = (str = '') => {
    if (str.length <= 72) return str;
    return (
      <span>
        {handleLongString(str)}{' '}
        <Tooltip
          title={str}
          placement="bottomLeft"
          // we have this prop for customizing antd tooltip
          getPopupContainer={(trigger) => {
            return trigger;
          }}
        >
          <span className={styles.readMoreBtn}>Read More</span>
        </Tooltip>
      </span>
    );
  };

  const handleAddResourceTypeModalVisible = () => {
    setAddResourceTypeModalVisible(true);
    setAction('add');
  };

  const renderMenuDropdown = (row) => {
    return (
      <div className={styles.containerDropdown}>
        <div
          className={styles.btnActionView}
          onClick={() => {
            setResourceTypeId('');
            setViewRecord(row);
            setViewResourceType(true);
            setAssignResourceModalVisible(false);
            setDeleteResourceType(false);
          }}
        >
          <img src={ViewIcon} alt="" />
          <span>View</span>
        </div>
        <div
          className={styles.btnActionAssign}
          onClick={() => {
            setResourceTypeId('');
            setAssigningRecord(row);
            setAssignResourceModalVisible(true);
            setViewResourceType(false);
            setDeleteResourceType(false);
          }}
        >
          <img src={AssignIcon} alt="" />
          <span>Assign</span>
        </div>
        <div
          className={styles.btnActionEdit}
          onClick={() => {
            setResourceTypeId('');
            setEditRecord(row);
            setAddResourceTypeModalVisible(true);
            setAction('edit');
            setViewResourceType(false);
            setAssignResourceModalVisible(false);
            setDeleteResourceType(false);
          }}
        >
          <img src={EditIcon} alt="" />
          <span>Edit</span>
        </div>
        <div
          className={styles.btnActionDelete}
          onClick={() => {
            setResourceTypeId('');
            setDeleteRecord(row);
            setDeleteResourceType(true);
            setViewResourceType(false);
            setAssignResourceModalVisible(false);
          }}
        >
          <img src={DeleteIcon} alt="" />
          <span>Delete</span>
        </div>
      </div>
    );
  };

  const generateColumns = () => {
    const columns = [
      {
        title: 'Resource Type',
        dataIndex: 'resourceType',
        key: 'resourceType',
        render: (resourceType) => {
          return <span>{resourceType?.name || '-'}</span>;
        },
      },
      {
        title: 'Division',
        dataIndex: 'division',
        key: 'division',
        render: (division) => {
          return <span>{division || '-'}</span>;
        },
      },
      {
        title: 'Billing Status',
        dataIndex: 'billingStatus',
        key: 'billingStatus',
        width: '10%',
        render: (billingStatus) => {
          return <span>{billingStatus || '-'}</span>;
        },
      },
      {
        title: 'Estimated Effort',
        dataIndex: 'estimatedEffort',
        key: 'estimatedEffort',
        width: '10%',
        render: (estimatedEffort) => {
          return <span>{estimatedEffort || '-'}</span>;
        },
      },
      {
        title: 'No. of Resources',
        dataIndex: 'noOfResources',
        key: 'noOfResources',
        width: '10%',
        render: (noOfResources) => {
          return <span>{noOfResources || '-'}</span>;
        },
      },
      {
        title: 'Comments/Notes',
        dataIndex: 'comments',
        key: 'comments',
        width: '25%',
        render: (comments) => {
          return renderComment(comments || '-');
        },
      },
      {
        title: 'Action',
        dataIndex: 'action',
        key: 'action',
        width: '7%',
        align: 'center',
        render: (resourceType, row) => {
          return (
            <Popover
              trigger="click"
              visible={row?.id === resourceTypeId}
              onVisibleChange={
                resourceTypeId
                  ? () => setResourceTypeId('')
                  : () => setVisiblePopover(!visiblePopover)
              }
              overlayClassName={styles.dropdownPopover}
              content={renderMenuDropdown(row)}
              placement="bottomRight"
            >
              <div
                style={{
                  cursor: 'pointer',
                  color: '#2c6df9',
                }}
                onClick={() => setResourceTypeId(row?.id)}
                onBlur={() => setResourceTypeId('')}
              >
                <img src={ActionIcon} alt="" />
              </div>
            </Popover>
          );
        },
      },
    ];

    return columns;
  };

  const renderOption = () => {
    const applied = Object.values(filter).filter((v) => v).length;

    const content = <FilterResourceTypeContent onFilter={onFilter} filter={filter} />;
    return (
      <div className={styles.options}>
        <FilterCountTag
          count={applied}
          onClearFilter={() => {
            onFilter({});
          }}
        />
        <FilterPopover placement="bottomRight" content={content}>
          <CustomOrangeButton showDot={applied > 0} />
        </FilterPopover>
        {allowModify && (
          <CustomOrangeButton
            icon={OrangeAddIcon}
            onClick={handleAddResourceTypeModalVisible}
            fontSize={13}
          >
            Add Resource Type
          </CustomOrangeButton>
        )}
        <CustomSearchBox onSearch={onSearch} placeholder="Search by Resource Type" />
      </div>
    );
  };

  return (
    <div className={styles.ResourceTypeCard}>
      <Card title="Resource Type" extra={renderOption()}>
        <div className={styles.tableContainer}>
          <CommonTable columns={generateColumns()} list={data} loading={loadingFetch} />
        </div>
        <CommonModal
          visible={addResourceTypeModalVisible}
          onClose={() => setAddResourceTypeModalVisible(false)}
          firstText={action === 'add' ? 'Add' : 'Update'}
          content={
            <AddResourceTypeContent
              visible={addResourceTypeModalVisible}
              onClose={() => setAddResourceTypeModalVisible(false)}
              refreshData={refreshResourceType}
              action={action}
              editRecord={editRecord}
            />
          }
          title={action === 'add' ? 'Add Resource Type' : 'Edit Resource Type'}
          loading={loadingAdd || loadingEdit}
        />

        <CommonModal
          visible={deleteResourceType}
          onClose={() => setDeleteResourceType(false)}
          firstText="Delete"
          width="500px"
          content={
            <DeleteResourceTypeContent
              visible={deleteResourceType}
              onClose={() => setDeleteResourceType(false)}
              refreshData={refreshResourceType}
              deleteRecord={deleteRecord}
            />
          }
          title="Delete"
          loading={loadingDelete}
        />

        <CommonModal
          visible={viewResourceType}
          onClose={() => setViewResourceType(false)}
          hasFooter={false}
          withPadding
          hasHeader={false}
          width={800}
          content={
            <ViewResourceTable
              visible={deleteResourceType}
              onClose={() => setViewResourceType(false)}
              refreshData={refreshResourceType}
              viewRecord={viewRecord}
            />
          }
          loading={loadingDelete}
        />

        <AssignResourcesModal
          visible={assignResourceModalVisible}
          onClose={() => setAssignResourceModalVisible(false)}
          data={assigningRecord}
          refreshData={refreshResourceType}
        />
      </Card>
    </div>
  );
};
export default connect(({ loading }) => ({
  loadingFetch: loading.effects['projectDetails/fetchResourceTypeListEffect'],
  loadingAdd: loading.effects['projectDetails/addResourceTypeEffect'],
  loadingEdit: loading.effects['projectDetails/editResourceTypeEffect'],
  loadingDelete: loading.effects['projectDetails/deleteResourceTypeEffect'],
}))(ResourceTypeCard);
