import { Button, Card, Tooltip } from 'antd';
import { debounce } from 'lodash';
import React, { useState } from 'react';
import { connect } from 'umi';
import ViewIcon from '@/assets/projectManagement/view.svg';
import OrangeAddIcon from '@/assets/projectManagement/orangeAdd.svg';
import OrangeAddButton from '../../../OrangeAddButton';
import CommonModal from '../../../CommonModal';
import CommonTable from '../../../CommonTable';
import FilterButton from '@/components/FilterButton';
import FilterPopover from '@/components/FilterPopover';
import CustomSearchBox from '@/components/CustomSearchBox';
import AddResourceTypeContent from '../AddResourceTypeContent';
import AssignResourcesModal from '../AssignResourcesModal';
import FilterResourceTypeContent from './components/FilterResourceTypeContent';
import styles from './index.less';

const ResourceTypeCard = (props) => {
  const {
    loadingFetch = false,
    data = [],
    refreshResourceType = () => {},
    loadingAdd = false,
  } = props;

  // permissions
  const { allowModify = false } = props;

  const [addResourceTypeModalVisible, setAddResourceTypeModalVisible] = useState(false);
  const [assignResourceModalVisible, setAssignResourceModalVisible] = useState(false);
  const [assigningRecord, setAssigningRecord] = useState({});

  const onSearchDebounce = debounce((value) => {
    refreshResourceType(value);
  }, 1000);

  const onSearch = (e = {}) => {
    const { value = '' } = e.target;
    onSearchDebounce(value);
  };

  const handleLongString = (str) => {
    if (str.length <= 72) return str;
    return `${str.slice(0, 72)}...`;
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
          if (!resourceType && allowModify) {
            return (
              <Button
                className={styles.assignBtn}
                icon={<img src={OrangeAddIcon} alt="" />}
                onClick={() => {
                  setAssigningRecord(row);
                  setAssignResourceModalVisible(true);
                }}
              >
                Assign
              </Button>
            );
          }
          return <img src={ViewIcon} alt="" />;
        },
      },
    ];

    return columns;
  };

  const renderOption = () => {
    const content = (
      <FilterResourceTypeContent onFilter={(values) => refreshResourceType('', values)} />
    );
    return (
      <div className={styles.options}>
        <FilterPopover placement="bottomRight" content={content}>
          <FilterButton />
        </FilterPopover>
        {allowModify && (
          <OrangeAddButton
            text="Add Resource Type"
            onClick={() => setAddResourceTypeModalVisible(true)}
          />
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
          firstText="Add Resource Type"
          content={
            <AddResourceTypeContent
              visible={addResourceTypeModalVisible}
              onClose={() => setAddResourceTypeModalVisible(false)}
              refreshResourceType={refreshResourceType}
            />
          }
          title="Add Resource Type"
          loading={loadingAdd}
        />
        <AssignResourcesModal
          visible={assignResourceModalVisible}
          onClose={() => setAssignResourceModalVisible(false)}
          data={assigningRecord}
          refreshResourceType={refreshResourceType}
        />
      </Card>
    </div>
  );
};
export default connect(({ loading }) => ({
  loadingFetch: loading.effects['projectDetails/fetchResourceTypeListEffect'],
  loadingAdd: loading.effects['projectDetails/addResourceTypeEffect'],
}))(ResourceTypeCard);
