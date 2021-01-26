import { Table, Avatar } from 'antd';
import React, { Component } from 'react';
import { UserOutlined } from '@ant-design/icons';
import moment from 'moment';
import Download from '@/components/DownloadFile';
import s from './index.less';

class TableDocuments extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pageNavigation: 1,
    };
  }

  onChangePagination = (pageNumber) => {
    this.setState({
      pageNavigation: pageNumber,
    });
  };

  render() {
    const { loading, data = [] } = this.props;
    const { pageNavigation } = this.state;
    const rowSize = 10;
    const pagination = {
      position: ['bottomLeft'],
      total: data.length,
      showTotal: (total, range) => (
        <span>
          Showing{' '}
          <b>
            {range[0]} - {range[1]}
          </b>{' '}
          total
        </span>
      ),
      pageSize: rowSize,
      current: pageNavigation,
      onChange: this.onChangePagination,
    };

    const columns = [
      {
        title: <span className={s.title}>Document name</span>,
        dataIndex: 'key',
        key: 'name',
        render: (key) => {
          return <p className={s.text}>{key}</p>;
        },
      },
      {
        title: <span className={s.title}>Type</span>,
        dataIndex: 'documentType',
        key: 'documentType',
        render: (documentType) => {
          return <p className={s.text}>{documentType}</p>;
        },
      },
      {
        title: <span className={s.title}>Last updated</span>,
        dataIndex: 'updatedAt',
        key: 'updatedAt',
        render: (updatedAt) => {
          return <p className={s.text}>{moment(updatedAt).format('YYYY/MM/DD')}</p>;
        },
      },
      {
        title: <span className={s.title}>Owner</span>,
        dataIndex: 'owner',
        key: 'owner',
        render: (owner = {}) => {
          const { generalInfo: { firstName: name = '', avatar = '' } = {} } = owner;
          return (
            <div className={s.viewOwner}>
              <Avatar
                size={21}
                src={avatar}
                icon={<UserOutlined />}
                style={{ marginRight: '10px' }}
              />
              <p className={s.text}>{name}</p>
            </div>
          );
        },
      },
      {
        title: <span className={s.title}>Action</span>,
        dataIndex: 'attachment',
        key: 'download',
        render: (attachment) => {
          return attachment?.url ? (
            <div className={s.viewDownload}>
              <Download
                url={attachment?.url}
                content={<p className={s.textDownload}>Download</p>}
              />
            </div>
          ) : null;
        },
      },
    ];

    return (
      <div className={s.tableDocuments}>
        <Table
          columns={columns}
          dataSource={data}
          hideOnSinglePage
          pagination={{
            ...pagination,
            total: data.length,
            // hideOnSinglePage: true,
          }}
          rowKey="_id"
          scroll={{ x: 'max-content' }}
          loading={loading}
        />
      </div>
    );
  }
}
export default TableDocuments;
