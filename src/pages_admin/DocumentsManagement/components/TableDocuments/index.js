import React, { PureComponent } from 'react';
import { Table } from 'antd';
import { DeleteOutlined, FileTextOutlined } from '@ant-design/icons';
import { formatMessage, connect, history } from 'umi';
import moment from 'moment';
import ViewDocumentModal from '@/components/ViewDocumentModal';
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
      // sortDirections: ['ascend', 'descend', 'ascend'],
      // sorter: {
      //   compare: (a, b) => a.employeeGroup.localeCompare(b.employeeGroup),
      // },
    },
    {
      title: 'Document Name',
      dataIndex: 'key',
      align: 'center',
      // sortDirections: ['ascend', 'descend', 'ascend'],
      // sorter: {
      //   compare: (a, b) => a.key.localeCompare(b.key),
      // },
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
        const formatedDate = moment(createdAt).format('MM.DD.YY');
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
            onClick={(e) => this.deleteDocument(e, record)}
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
      viewDocumentModalVisible: false,
      viewingUrl: '',
    };
  }

  // delete
  deleteDocument = (e, record) => {
    e.stopPropagation();
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
  viewDocument = (key, url) => {
    // history.push(`/view-document/${record._id}`);
    // history.push({
    //   pathname: `/view-document/${record._id}`,
    //   state: { renderBackButton: true },
    // });
    this.setState({
      viewDocumentModalVisible: true,
      documentName: key,
      viewingUrl: url,
    });
  };

  onCloseViewDocument = () => {
    this.setState({
      viewDocumentModalVisible: false,
    });
    setTimeout(() => {
      this.setState({
        documentName: '',
        viewingUrl: '',
      });
    }, 500);
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
    // console.log('selectedRowKeys changed: ', selectedRowKeys);
    this.setState({ selectedRowKeys });
  };

  render() {
    const { data = [], loading, pageSelected, size, total: totalData, getPageAndSize } = this.props;
    const {
      selectedRowKeys,
      documentId,
      documentName,
      confirmRemoveModalVisible,
      viewDocumentModalVisible,
      viewingUrl,
    } = this.state;
    // const rowSize = 10;
    const scroll = {
      x: '100%',
      y: '',
    };
    const pagination = {
      position: ['bottomLeft'],
      total: totalData,
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
      defaultPageSize: size,
      showSizeChanger: true,
      pageSizeOptions: ['10', '25', '50', '100'],
      pageSize: size,
      current: pageSelected,
      onChange: (page, pageSize) => {
        getPageAndSize(page, pageSize);
      },
    };

    const rowSelection = {
      type: 'checkbox',
      selectedRowKeys,
      onChange: this.onSelectChange,
    };

    // console.log('listDocumentDetail', listDocumentDetail);
    return (
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
        <ViewDocumentModal
          visible={viewDocumentModalVisible}
          fileName={documentName}
          url={viewingUrl}
          onClose={this.onCloseViewDocument}
        />
        <Table
          size="middle"
          loading={loading}
          onRow={(record) => {
            return {
              onClick: () => {
                const { key = '', attachment = {} } = record;
                this.viewDocument(key, attachment?.url);
              },
              // click row
            };
          }}
          rowSelection={rowSelection}
          pagination={pagination}
          columns={this.columns}
          dataSource={data}
          scroll={scroll}
          rowKey="_id"
        />
      </div>
    );
  }
}
export default TableDocuments;
