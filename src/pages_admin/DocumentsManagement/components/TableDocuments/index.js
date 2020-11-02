import React, { PureComponent } from 'react';
import { Table } from 'antd';
import { DeleteOutlined, FileTextOutlined } from '@ant-design/icons';
import { formatMessage, connect } from 'umi';
import moment from 'moment';
import ViewDocument from '@/components/ViewDocument';
import ConfirmRemoveModal from '../ConfirmRemoveModal';
import styles from './index.less';

@connect(({ loading, documentsManagement }) => ({
  loadingDocumentDetail: loading.effects['documentsManagement/fetchDocumentDetail'],
  documentsManagement,
}))
class TableDocuments extends PureComponent {
  columns = [
    {
      title: 'Document ID',
      dataIndex: '_id',
      align: 'center',
      defaultSortOrder: 'ascend',
      sortDirections: ['ascend', 'descend', 'ascend'],
      sorter: {
        compare: (a, b) => a._id.localeCompare(b._id),
      },
    },
    {
      title: 'Document Type',
      dataIndex: 'employeeGroup',
      align: 'center',
      sortDirections: ['ascend', 'descend', 'ascend'],
      sorter: {
        compare: (a, b) => a.employeeGroup.localeCompare(b.employeeGroup),
      },
    },
    {
      title: 'Document Name',
      dataIndex: 'key',
      align: 'center',
      sortDirections: ['ascend', 'descend', 'ascend'],
      sorter: {
        compare: (a, b) => a.key.localeCompare(b.key),
      },
    },
    {
      title: 'Uploaded By',
      // dataIndex: 'uploadedBy',
      align: 'center',
      // sortDirections: ['ascend', 'descend', 'ascend'],
      render: () => <span>Terralogic</span>,
      // sorter: {
      //   compare: (a, b) => a.uploadedBy.localeCompare(b.uploadedBy),
      // },
    },
    {
      title: 'Company',
      dataIndex: 'company',
      align: 'center',
      width: '8%',
      // sortDirections: ['ascend', 'descend', 'ascend'],
      render: () => <span>Company</span>,
      // sorter: {
      //   compare: (a, b) => a.company.localeCompare(b.company),
      // },
    },
    {
      title: 'Created Date',
      dataIndex: 'createdAt',
      align: 'center',
      sortDirections: ['ascend', 'descend', 'ascend'],
      render: (createdAt) => {
        const formatedDate = moment(createdAt).format('MM/DD/YYYY');
        return <span>{formatedDate}</span>;
      },
      sorter: {
        compare: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
      },
    },
    {
      title: 'Action',
      dataIndex: 'action',
      width: '5%',
      align: 'center',
      render: (text, record) => (
        <div className={styles.documentAction}>
          <FileTextOutlined
            onClick={() => this.viewDocument(record)}
            className={styles.viewDocumentBtn}
          />
          <DeleteOutlined
            onClick={() => this.deleteDocument(record)}
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
      confirmRemoveModalVisible: false,
      documentId: '',
      documentName: '',
      isViewingDocument: false,
      selectedDocumentId: null,
    };
  }

  // delete
  deleteDocument = (record) => {
    this.setState({
      confirmRemoveModalVisible: true,
      documentId: record._id,
      documentName: record.key,
    });
  };

  closeConfirmRemoveModal = () => {
    this.setState({
      confirmRemoveModalVisible: false,
      documentId: '',
      documentName: '',
    });
  };

  // view document
  viewDocument = (record) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'documentsManagement/fetchDocumentDetail',
      payload: record._id,
    });
    this.setState({
      isViewingDocument: true,
      selectedDocumentId: record._id,
    });
  };

  closeDocument = () => {
    this.setState({
      isViewingDocument: false,
      selectedDocumentId: null,
    });
    const { dispatch } = this.props;
    dispatch({
      type: 'documentsManagement/clearDocumentDetail',
    });
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
    const {
      pageSelected,
      selectedRowKeys,
      documentId,
      documentName,
      confirmRemoveModalVisible,
      isViewingDocument,
      selectedDocumentId,
    } = this.state;
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

    const {
      documentsManagement: { listDocumentDetail = [] },
    } = this.props;

    // console.log('listDocumentDetail', listDocumentDetail);
    return (
      <div>
        {isViewingDocument && selectedDocumentId && listDocumentDetail ? (
          <ViewDocument data={listDocumentDetail} onBackClick={this.closeDocument} />
        ) : (
          <div className={styles.tableDocuments}>
            {documentId !== '' && (
              <ConfirmRemoveModal
                visible={confirmRemoveModalVisible}
                titleModal="Remove Document Confirm"
                handleCancel={this.closeConfirmRemoveModal}
                id={documentId}
                name={documentName}
              />
            )}
            <Table
              size="small"
              loading={loading}
              rowSelection={rowSelection}
              pagination={{ ...pagination, total: data.length }}
              columns={this.columns}
              dataSource={data}
              scroll={scroll}
              rowKey="_id"
            />
          </div>
        )}
      </div>
    );
  }
}
export default TableDocuments;
