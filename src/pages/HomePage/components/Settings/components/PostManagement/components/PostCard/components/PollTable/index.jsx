import { Popconfirm } from 'antd';
import Parser from 'html-react-parser';
import moment from 'moment';
import React, { useState } from 'react';
import { connect, Link } from 'umi';
import CommonModal from '@/components/CommonModal';
import EditIcon from '@/assets/homePage/editIcon.svg';
import RemoveIcon from '@/assets/homePage/removeIcon.svg';
import ChartIcon from '@/assets/homePage/chartIcon.svg';
import CommonTable from '../CommonTable';
import ChartPreviewModalContent from './components/ChartPreviewModalContent';
import styles from './index.less';

const PollTable = (props) => {
  const {
    dispatch,
    data = [],
    loading = false,
    refreshData = () => {},
    onEditPost = () => {},
  } = props;
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
        width: '20%',
        render: (pollDetail = {}) => {
          return Parser(pollDetail?.question || '');
        },
      },
      {
        title: 'Location',
        dataIndex: 'location',
        key: 'location',
        width: '10%',
        render: (location) => (
          <div style={{ lineHeight: '22px' }}>
            {location.map((x, index) => {
              return (
                <span key={x._id}>
                  {x.name}
                  {index + 1 < location.length ? ', ' : ''}
                </span>
              );
            })}
          </div>
        ),
      },
      {
        title: 'Start Date',
        dataIndex: 'pollDetail',
        key: 'startDate',
        render: (pollDetail = {}) => {
          return (
            <span>
              {pollDetail.startDate ? moment(pollDetail.startDate).format('MM/DD/YYYY') : ''}
            </span>
          );
        },
      },
      {
        title: 'End Date',
        dataIndex: 'pollDetail',
        key: 'endDate',
        render: (pollDetail = {}) => {
          return (
            <span>{pollDetail.endDate ? moment(pollDetail.endDate).format('MM/DD/YYYY') : ''}</span>
          );
        },
      },
      {
        title: 'Responses',
        dataIndex: 'responses',
        key: 'responses',
        render: (responses = 0) => responses || 0,
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
        title: 'Created By',
        dataIndex: 'createdBy',
        key: 'createdBy',
        render: (createdBy = {}) => {
          return (
            <Link
              style={{ fontWeight: 500 }}
              to={`/directory/employee-profile/${createdBy?.generalInfoInfo?.userId}`}
            >
              {createdBy?.generalInfoInfo?.legalName || ''}
            </Link>
          );
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
              <img src={EditIcon} alt="" onClick={() => onEditPost(record)} />
              <Popconfirm
                placement="left"
                title="Are you sure?"
                onConfirm={() => onDeletePoll(record)}
              >
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
