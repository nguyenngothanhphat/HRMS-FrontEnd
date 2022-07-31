import CommonTable from '@/components/CommonTable';
import { POST_TYPE } from '@/utils/homePage';
import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import FilterButton from '@/components/FilterButton';
import FilterPopover from '@/components/FilterPopover';
import styles from './index.less';

function EmployeePostManagement(props) {
  const { dispatch } = props;

  const [visible, setVisible] = useState(false);

  const fetchData = (limit = 10, page = 1) => {
    dispatch({
      type: 'homePage/fetchAnnouncementsEffect',
      payload: {
        postType: POST_TYPE.SOCIAL,
        limit,
        page,
      },
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const generateColumns = () => {
    const columns = [
      {
        title: 'ID',
        dataIndex: 'postID',
        key: 'postID',
        width: '10%',
        render: (linkId) => <span className={styles.blueText}>#{linkId}</span>,
      },
      {
        title: 'Description',
        dataIndex: 'description',
        key: 'description',
        width: '15%',
        render: (description = '') => (
          <div style={{ lineHeight: '22px' }}>{Parser(description)}</div>
        ),
      },
      {
        title: 'Media',
        dataIndex: 'media',
        key: 'media',
        width: '10%',
        render: (locations) => (
          <div style={{ lineHeight: '22px' }}>
            {locations.map((x, index) => {
              return (
                <span key={x._id}>
                  {x.name}
                  {index + 1 < locations.length ? ', ' : ''}
                </span>
              );
            })}
          </div>
        ),
      },
      {
        title: 'Created By',
        dataIndex: 'createdBy',
        key: 'createdBy',
        width: '15%',
        render: (attachments = []) => {
          return attachments.map((x) => <div>{x.name}</div>);
        },
      },
      {
        title: 'Created On',
        dataIndex: 'createdOn',
        key: 'createdOn',
        width: '15%',
        render: (employees = {}) => {
          return employees.map((employee) => (
            <Link
              style={{ fontWeight: 500 }}
              to={`/directory/employee-profile/${employee?.userId}`}
            >
              {employee?.legalName || ''}
            </Link>
          ));
        },
      },
      {
        title: 'Flag as Inappropriate',
        dataIndex: 'flag',
        key: 'flag',
        width: '5%',
        align: 'center',
        render: (createdAt = {}) => {
          return <span>{createdAt ? moment(createdAt).format('MM-DD-YYYY') : ''}</span>;
        },
      },
      {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        width: '10%',
        render: (createdAt = {}) => {
          return <span>{createdAt ? moment(createdAt).format('MM-DD-YYYY') : ''}</span>;
        },
      },
      {
        title: 'Action',
        dataIndex: 'action',
        key: 'action',
        width: '10%',
        align: 'center',
        render: (_, record) => {
          return (
            <div className={styles.actions}>
              <img src={EditIcon} alt="" onClick={() => onEditQuickLink(record)} />
              <Popconfirm
                placement="left"
                title="Are you sure?"
                onConfirm={() => onDeleteAttachment(record)}
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
    <div className={styles.PostCard}>
      <div className={styles.title}>
        <div className={styles.filter}>
          <FilterPopover
            // content={<FilterForm visible={visible} {...this.props} />}
            // title={this.renderTitle()}
            trigger="click"
            placement="bottomRight"
            visible={visible}
            onVisibleChange={() => setVisible(!visible)}
          >
            <FilterButton fontSize={14} showDot={false} />
          </FilterPopover>
        </div>
      </div>
      <div className={styles.table}>
        <CommonTable columns={generateColumns()} />
      </div>
    </div>
  );
}

export default connect(({}) => ({}))(EmployeePostManagement);
