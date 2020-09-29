import React, { PureComponent } from 'react';
import { Table } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { formatMessage, connect } from 'umi';
import styles from './index.less';

@connect(({ loading, documentsManagement }) => ({
  loadingDocumentDetail: loading.effects['documentsManagement/fetchDocumentDetail'],
  documentsManagement,
}))
class TableDocuments extends PureComponent {
  columns = [
    {
      title: 'Document ID',
      dataIndex: 'documentId',
      align: 'center',
      defaultSortOrder: 'ascend',
      sortDirections: ['ascend', 'descend', 'ascend'],
      sorter: {
        compare: (a, b) => a.documentId.localeCompare(b.documentId),
      },
    },
    {
      title: 'Document Type',
      dataIndex: 'documentType',
      align: 'center',
      sortDirections: ['ascend', 'descend', 'ascend'],
      sorter: {
        compare: (a, b) => a.documentType.localeCompare(b.documentType),
      },
    },
    {
      title: 'Document Name',
      dataIndex: 'documentName',
      align: 'center',
      sortDirections: ['ascend', 'descend', 'ascend'],
      sorter: {
        compare: (a, b) => a.documentName.localeCompare(b.documentName),
      },
    },
    {
      title: 'Uploaded By',
      dataIndex: 'uploadedBy',
      align: 'center',
      sortDirections: ['ascend', 'descend', 'ascend'],
      sorter: {
        compare: (a, b) => a.uploadedBy.localeCompare(b.uploadedBy),
      },
    },
    {
      title: 'Created Date',
      dataIndex: 'createdDate',
      align: 'center',
      sortDirections: ['ascend', 'descend', 'ascend'],
      sorter: {
        compare: (a, b) => new Date(a.createdDate) - new Date(b.createdDate),
      },
    },
    {
      title: 'User ID',
      dataIndex: 'userId',
      align: 'center',
      sorter: {
        compare: (a, b) => a.userId - b.userId,
      },
    },
    {
      title: 'Action',
      dataIndex: 'action',
      width: '5%',
      align: 'center',
      render: (text, record) => (
        <div className={styles.documentAction}>
          <DeleteOutlined
            onClick={(e) => this.deleteDocument(record.key, e)}
            className={styles.deleteDocumentBtn}
          />
        </div>
      ),
    },
  ];

  constructor(props) {
    super(props);
    this.state = {
      pageSelected: 1,
      selectedRowKeys: [],
    };
  }

  // user
  deleteDocument = (key, e) => {
    // e.preventDefault();
    alert('DELETE DOCUMENT');
    console.log('DELETE DOCUMENT', key);
  };

  // pagination
  onChangePagination = (pageNumber) => {
    this.setState({
      pageSelected: pageNumber,
    });
  };

  setFirstPage = () => {
    this.setState({
      pageSelected: 1,
    });
  };

  // onSortChange = (pagination, filters, sorter, extra) => {
  //   console.log('params', pagination, filters, sorter, extra);
  // };

  onSelectChange = (selectedRowKeys) => {
    console.log('selectedRowKeys changed: ', selectedRowKeys);
    this.setState({ selectedRowKeys });
  };

  render() {
    const { data = [], loading } = this.props;
    const { pageSelected, selectedRowKeys } = this.state;
    const rowSize = 10;
    const scroll = {
      x: '100%',
      y: '',
    };
    const pagination = {
      position: ['bottomLeft'],
      total: data.length,
      showTotal: (total, range) => (
        <span>
          {' '}
          {formatMessage({ id: 'component.directory.pagination.showing' })}{' '}
          <b>
            {range[0]} - {range[1]}
          </b>{' '}
          {formatMessage({ id: 'component.directory.pagination.of' })} {total}{' '}
        </span>
      ),
      pageSize: rowSize,
      current: pageSelected,
      onChange: this.onChangePagination,
    };

    const rowSelection = {
      type: 'checkbox',
      selectedRowKeys,
      onChange: this.onSelectChange,
    };

    return (
      <div className={styles.tableDocuments}>
        <Table
          size="small"
          loading={loading}
          rowSelection={rowSelection}
          pagination={{ ...pagination, total: data.length }}
          columns={this.columns}
          dataSource={data}
          scroll={scroll}
          rowKey="documentId"
          // onChange={this.onSortChange}
        />
      </div>
    );
  }
}
export default TableDocuments;
