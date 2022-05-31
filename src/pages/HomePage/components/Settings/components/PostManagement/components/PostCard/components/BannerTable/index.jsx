/* eslint-disable react/jsx-props-no-spreading */
import { Popconfirm, Image } from 'antd';
import React, { useEffect, useState } from 'react';
import { connect, Link } from 'umi';
import moment from 'moment';
import { SortableContainer, SortableElement, SortableHandle } from 'react-sortable-hoc';
import { MenuOutlined } from '@ant-design/icons';
import CommonTable from '../CommonTable';
import styles from './index.less';
import RemoveIcon from '@/assets/homePage/removeIcon.svg';
import EditIcon from '@/assets/homePage/editIcon.svg';
import AddButton from '../AddButton';

const DragHandle = SortableHandle(() => <MenuOutlined style={{ cursor: 'grab', color: '#999' }} />);
const SortableItem = SortableElement((props) => <tr {...props} />);
const SortableBody = SortableContainer((props) => <tbody {...props} />);

const BannerTable = (props) => {
  const {
    dispatch,
    data = [],
    loading = false,
    refreshData = () => {},
    onEditPost = () => {},
    onAddPost = () => {},
  } = props;

  const [dataSource, setDataSource] = useState([]);

  useEffect(() => {
    const dataSourceTemp = [1, 2, 3, 4, 5].map((x) => {
      const find = data.find((y) => y.position === x);
      if (find) return find;
      return {
        position: x,
      };
    });
    setDataSource(dataSourceTemp);
  }, [JSON.stringify(data)]);

  // functions
  const onDeleteAttachment = async (record) => {
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
        dataIndex: 'sort',
        width: '7%',
        align: 'center',
        render: () => <DragHandle />,
      },
      {
        title: 'ID',
        dataIndex: 'position',
        key: 'position',
        width: '15%',
        render: (position) => <span className={styles.blueText}>{position}</span>,
      },
      {
        title: 'Location',
        dataIndex: 'location',
        key: 'location',
        render: (location = []) => (
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
        title: 'Media',
        dataIndex: 'attachments',
        key: 'attachments',
        width: '10%',
        render: (attachments = []) => {
          return (
            <Image.PreviewGroup>
              {attachments.map((x) => {
                return <Image width={32} height={32} src={x.url} />;
              })}
            </Image.PreviewGroup>
          );
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
        title: 'Created On',
        dataIndex: 'createdAt',
        key: 'createdAt',
        render: (createdAt) => {
          return <span>{createdAt ? moment(createdAt).format('MM/DD/YYYY') : ''}</span>;
        },
      },
      {
        title: 'Action',
        dataIndex: 'action',
        key: 'action',
        width: '10%',
        align: 'center',
        render: (_, record) => {
          if (record?.postID) {
            return (
              <div className={styles.actions}>
                <img src={EditIcon} alt="" onClick={() => onEditPost(record)} />
                <Popconfirm
                  placement="left"
                  title="Are you sure?"
                  onConfirm={() => onDeleteAttachment(record)}
                >
                  <img src={RemoveIcon} alt="" />
                </Popconfirm>
              </div>
            );
          }
          return <AddButton text="Add Banner" onClick={() => onAddPost(record)} />;
        },
      },
    ];
    return columns;
  };

  const onSortEnd = async ({ oldIndex, newIndex }) => {
    if (oldIndex !== newIndex) {
      const find1 = dataSource.find((x) => x.position === oldIndex + 1);
      const find2 = dataSource.find((x) => x.position === newIndex + 1);
      let payload = {};
      if (find1?.postID) {
        payload = {
          postID: find1.postID,
          currPosition: oldIndex + 1,
          newPosition: newIndex + 1,
        };
      } else if (find2?.postID) {
        payload = {
          postID: find2.postID,
          currPosition: newIndex + 1,
          newPosition: oldIndex + 1,
        };
      }

      if (Object.keys(payload).length > 0) {
        const res = await dispatch({
          type: 'homePage/updateBannerPositionEffect',
          payload,
        });
        if (res.statusCode === 200) {
          refreshData();
        }
      }
    }
  };

  const DraggableContainer = (props1) => (
    <SortableBody
      useDragHandle
      disableAutoscroll
      helperClass="row-dragging"
      onSortEnd={onSortEnd}
      {...props1}
    />
  );

  const DraggableBodyRow = ({ className, style, ...restProps }) => {
    // function findIndex base on Table rowKey props and should always be a right array index
    const index = dataSource.findIndex((x) => x.position === restProps['data-row-key']);
    return <SortableItem index={index} {...restProps} />;
  };

  return (
    <div className={styles.BannerTable}>
      <CommonTable
        list={dataSource}
        loading={loading}
        columns={getColumns()}
        rowKey="position"
        components={{
          body: {
            wrapper: DraggableContainer,
            row: DraggableBodyRow,
          },
        }}
      />
    </div>
  );
};
export default connect(() => ({}))(BannerTable);
