import React, { useState } from 'react';
import { connect } from 'umi';
import CommonTable from '../CommonTable';
import styles from './index.less';
import RemoveIcon from '@/assets/homePage/removeIcon.svg';
import ChartIcon from '@/assets/homePage/chartIcon.svg';
import CommonModal from '../CommonModal';
import ChartPreviewModalContent from './components/ChartPreviewModalContent';

const mockData = [
  {
    id: '163134',
    description: 'How do you feel about getting back to office?',
    media: '',
    createdBy: 'Leslie Alexander',
    createdOn: '03-11-2021',
  },
  {
    id: '163134',
    description: 'How do you feel about getting back to office?',
    media: '',
    createdBy: 'Leslie Alexander',
    createdOn: '03-11-2021',
  },
];
const PollTable = () => {
  const [previewModalVisible, setPreviewModalVisible] = useState(false);
  const getColumns = () => {
    const columns = [
      {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
        render: (id) => <span className={styles.blueText}>#{id}</span>,
      },
      {
        title: 'Description',
        dataIndex: 'description',
        key: 'description',
      },
      {
        title: 'Media',
        dataIndex: 'media',
        key: 'media',
      },
      {
        title: 'Created By',
        dataIndex: 'createdBy',
        key: 'createdBy',
      },
      {
        title: 'Created On',
        dataIndex: 'createdOn',
        key: 'createdOn',
      },
      {
        title: 'Action',
        dataIndex: 'action',
        key: 'action',
        align: 'center',
        render: () => {
          return (
            <div className={styles.actions}>
              <img src={ChartIcon} alt="" onClick={() => setPreviewModalVisible(true)} />
              <img src={RemoveIcon} alt="" />
            </div>
          );
        },
      },
    ];
    return columns;
  };

  return (
    <div className={styles.PollTable}>
      <CommonTable list={mockData} columns={getColumns()} />
      <CommonModal
        visible={previewModalVisible}
        title="How do you feel about getting back to office?"
        hasFooter={false}
        onClose={() => setPreviewModalVisible(false)}
        content={<ChartPreviewModalContent />}
        width={500}
      />
    </div>
  );
};
export default connect(() => ({}))(PollTable);
