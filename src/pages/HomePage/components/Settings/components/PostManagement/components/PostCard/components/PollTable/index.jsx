import React, { useState } from 'react';
import { connect } from 'umi';
import { Popconfirm } from 'antd';
import moment from 'moment';
import CommonTable from '../CommonTable';
import styles from './index.less';
import RemoveIcon from '@/assets/homePage/removeIcon.svg';
import ChartIcon from '@/assets/homePage/chartIcon.svg';
import CommonModal from '@/pages/HomePage/components/CommonModal';
import ChartPreviewModalContent from './components/ChartPreviewModalContent';

const PollTable = (props) => {
  const { dispatch, data = [], loading = false, refreshData = () => {} } = props;
  const [previewModalVisible, setPreviewModalVisible] = useState(false);
  const [viewingPoll, setViewingPoll] = useState('');

  const fetchPollResult = (pollId) => {
    return dispatch({
      type: 'homePage/fetchPollResultEffect',
      payload: {
        pollId,
      },
    });
  };

  const onViewPoll = async (record) => {
    setViewingPoll(record);
    if (record?._id) {
      const res = await fetchPollResult(record._id);
      if (res.statusCode === 200) {
        setPreviewModalVisible(true);
      }
    }
  };

  const onDeletePoll = async (record) => {
    if (record?._id) {
      const res = await dispatch({
        type: 'homePage/deletePostEffect',
        payload: {
          postId: record?._id,
        },
      });
      if (res.statusCode === 200) {
        refreshData();
      }
    }
  };

  const getColumns = () => {
    const columns = [
      {
        title: 'ID',
        dataIndex: 'postID',
        key: 'postID',
        render: (postID) => <span className={styles.blueText}>#{postID}</span>,
      },
      {
        title: 'Description',
        dataIndex: 'pollDetail',
        key: 'pollDetail',
        render: (pollDetail = {}) => {
          return <span>{pollDetail?.question || ''}</span>;
        },
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
        render: (createdBy = {}) => {
          return <span>{createdBy?.generalInfoInfo?.legalName || ''}</span>;
        },
      },
      {
        title: 'Created On',
        dataIndex: 'createdAt',
        key: 'createdAt',
        render: (createdAt = {}) => {
          return <span>{createdAt ? moment(createdAt).format('MM/DD/YYYY') : ''}</span>;
        },
      },
      {
        title: 'Action',
        dataIndex: 'action',
        key: 'action',
        align: 'center',
        render: (_, record) => {
          return (
            <div className={styles.actions}>
              <img src={ChartIcon} alt="" onClick={() => onViewPoll(record)} />
              <Popconfirm title="Are you sure?" onConfirm={() => onDeletePoll(record)}>
                <img src={RemoveIcon} alt="" />
              </Popconfirm>
            </div>
          );
        },
      },
    ];
    return columns;
  };

  return (
    <div className={styles.PollTable}>
      <CommonTable list={data} columns={getColumns()} loading={loading} />
      <CommonModal
        visible={previewModalVisible}
        title={viewingPoll?.pollDetail?.question || 'Question here'}
        hasFooter={false}
        onClose={() => setPreviewModalVisible(false)}
        content={<ChartPreviewModalContent pollDetail={viewingPoll?.pollDetail} />}
        width={500}
      />
    </div>
  );
};
export default connect(() => ({}))(PollTable);
