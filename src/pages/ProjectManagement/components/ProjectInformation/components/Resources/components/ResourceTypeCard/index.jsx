import { Button, Card } from 'antd';
import { debounce } from 'lodash';
import React, { useState } from 'react';
import { connect } from 'umi';
import ViewIcon from '@/assets/projectManagement/view.svg';
import OrangeAddIcon from '@/assets/projectManagement/orangeAdd.svg';
import AddButton from '../../../AddButton';
import CommonModal from '../../../CommonModal';
import CommonTable from '../../../CommonTable';
import FilterButton from '../../../FilterButton';
import FilterPopover from '../../../FilterPopover';
import SearchBar from '../../../SearchBar';
import AddResourceTypeContent from '../AddResourceTypeContent';
import AssignResourcesModal from '../AssignResourcesModal';
import FilterResourceTypeContent from './components/FilterResourceTypeContent';
import styles from './index.less';

const ResourceTypeCard = () => {
  const [addResourceTypeModalVisible, setAddResourceTypeModalVisible] = useState(false);
  const [assignResourceModalVisible, setAssignResourceModalVisible] = useState(false);
  const onSearchDebounce = debounce((value) => {
    console.log('value', value);
  }, 1000);

  const onSearch = (e = {}) => {
    const { value = '' } = e.target;
    onSearchDebounce(value);
  };

  const data = [
    {
      resourceType: 'UX Designer',
      division: 'Design',
      billingStatus: 'Billable',
      estimatedEffort: 1,
      noOfResources: 3,
      comments: 'Amet minim mollit non deserunt ullamco est sit ali...',
    },
    {
      resourceType: 'SR. UX Designer',
      division: 'Design',
      billingStatus: 'Billable',
      estimatedEffort: 1,
      noOfResources: 3,
      comments: 'Amet minim mollit non deserunt ullamco est sit ali...',
    },
  ];

  const generateColumns = () => {
    const columns = [
      {
        title: 'Resource Type',
        dataIndex: 'resourceType',
        key: 'resourceType',
        render: (resourceType) => {
          return <span>{resourceType || '-'}</span>;
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
        render: (billingStatus) => {
          return <span>{billingStatus || '-'}</span>;
        },
      },
      {
        title: 'No. of Resources',
        dataIndex: 'noOfResources',
        key: 'noOfResources',
        render: (noOfResources) => {
          return <span>{noOfResources || '-'}</span>;
        },
      },
      {
        title: 'Comments/Notes',
        dataIndex: 'comments',
        key: 'comments',
        render: (comments) => {
          return <span>{comments || '-'}</span>;
        },
      },
      {
        title: 'Action',
        dataIndex: 'action',
        key: 'action',
        render: (resourceType) => {
          if (!resourceType) {
            return (
              <Button
                className={styles.assignBtn}
                icon={<img src={OrangeAddIcon} alt="" />}
                onClick={() => setAssignResourceModalVisible(true)}
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
    const content = <FilterResourceTypeContent />;
    return (
      <div className={styles.options}>
        <AddButton text="Add Resource Type" onClick={() => setAddResourceTypeModalVisible(true)} />
        <FilterPopover placement="bottomRight" content={content}>
          <FilterButton />
        </FilterPopover>
        <SearchBar onSearch={onSearch} placeholder="Search by Resource Type" />
      </div>
    );
  };

  return (
    <div className={styles.ResourceTypeCard}>
      <Card title="Resource Type" extra={renderOption()}>
        <div className={styles.tableContainer}>
          <CommonTable columns={generateColumns()} list={data} />
        </div>
        <CommonModal
          visible={addResourceTypeModalVisible}
          onClose={() => setAddResourceTypeModalVisible(false)}
          firstText="Add Resource Type"
          content={<AddResourceTypeContent />}
          title="Add Resource Type"
        />
        <AssignResourcesModal
          visible={assignResourceModalVisible}
          onClose={() => setAssignResourceModalVisible(false)}
        />
      </Card>
    </div>
  );
};
export default connect(() => ({}))(ResourceTypeCard);
