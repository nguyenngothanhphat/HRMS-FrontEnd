import { Table, Avatar } from 'antd';
import React, { Component } from 'react';
import { UserOutlined } from '@ant-design/icons';
import Download from '@/components/DownloadFile';
import s from './index.less';

const data = [];

// const data = [
//   {
//     name: 'ABC Document',
//     type: 'Type 1',
//     lastUpdate: '22nd Nov, 2020',
//     owner: {
//       name: 'Rajani Bathula',
//       avatar:
//         'https://www.freevector.com/uploads/vector/preview/12675/FreeVector-Man-Vector-Avatar.jpg',
//     },
//     url: 'http://api-stghrms.paxanimi.ai/api/attachments/600e5009a51df8566c4f8dae/test.jpg',
//   },
//   {
//     name: 'ABC Document',
//     type: 'Type 1',
//     lastUpdate: '22nd Nov, 2020',
//     owner: {
//       name: 'Rajani Bathula',
//       avatar: '',
//     },
//     url: '',
//   },
//   {
//     name: 'ABC Document',
//     type: 'Type 1',
//     lastUpdate: '22nd Nov, 2020',
//     owner: {
//       name: 'Rajani Bathula',
//       avatar: '',
//     },
//     url: '',
//   },
//   {
//     name: 'ABC Document',
//     type: 'Type 1',
//     lastUpdate: '22nd Nov, 2020',
//     owner: {
//       name: 'Rajani Bathula',
//       avatar: '',
//     },
//     url: '',
//   },
//   {
//     name: 'ABC Document',
//     type: 'Type 1',
//     lastUpdate: '22nd Nov, 2020',
//     owner: {
//       name: 'Rajani Bathula',
//       avatar: '',
//     },
//     url: '',
//   },
//   {
//     name: 'ABC Document',
//     type: 'Type 1',
//     lastUpdate: '22nd Nov, 2020',
//     owner: {
//       name: 'Rajani Bathula',
//       avatar: '',
//     },
//     url: '',
//   },
//   {
//     name: 'ABC Document',
//     type: 'Type 1',
//     lastUpdate: '22nd Nov, 2020',
//     owner: {
//       name: 'Rajani Bathula',
//       avatar: '',
//     },
//     url: '',
//   },
//   {
//     name: 'ABC Document',
//     type: 'Type 1',
//     lastUpdate: '22nd Nov, 2020',
//     owner: {
//       name: 'Rajani Bathula',
//       avatar: '',
//     },
//     url: '',
//   },

//   {
//     name: 'ABC Document',
//     type: 'Type 1',
//     lastUpdate: '22nd Nov, 2020',
//     owner: {
//       name: 'Rajani Bathula',
//       avatar: '',
//     },
//     url: '',
//   },
//   {
//     name: 'ABC Document',
//     type: 'Type 1',
//     lastUpdate: '22nd Nov, 2020',
//     owner: {
//       name: 'Rajani Bathula',
//       avatar: '',
//     },
//     url: '',
//   },
//   {
//     name: 'ABC Document',
//     type: 'Type 1',
//     lastUpdate: '22nd Nov, 2020',
//     owner: {
//       name: 'Rajani Bathula',
//       avatar: '',
//     },
//     url: '',
//   },
// ];

class TableDocuments extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pageNavigation: 1,
    };
  }

  componentDidMount() {}

  onChangePagination = (pageNumber) => {
    this.setState({
      pageNavigation: pageNumber,
    });
  };

  render() {
    // const { data = [] } = this.props;
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
        dataIndex: 'name',
        key: 'name',
        render: (name) => {
          return <p className={s.text}>{name}</p>;
        },
      },
      {
        title: <span className={s.title}>Type</span>,
        dataIndex: 'type',
        key: 'type',
        render: (type) => {
          return <p className={s.text}>{type}</p>;
        },
      },
      {
        title: <span className={s.title}>Last updated</span>,
        dataIndex: 'lastUpdate',
        key: 'lastUpdate',
        render: (lastUpdate) => {
          return <p className={s.text}>{lastUpdate}</p>;
        },
      },
      {
        title: <span className={s.title}>Owner</span>,
        dataIndex: 'owner',
        key: 'owner',
        render: (owner) => {
          const { name = '', avatar = '' } = owner;
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
        dataIndex: 'url',
        key: 'download',
        render: (url) => {
          return url ? (
            <div className={s.viewDownload}>
              <Download url={url} content={<p className={s.textDownload}>Download</p>} />
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
          }}
          rowKey="id"
          scroll={{ x: 'max-content' }}
          loading={false}
        />
      </div>
    );
  }
}
export default TableDocuments;
