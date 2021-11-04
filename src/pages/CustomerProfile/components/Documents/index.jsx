import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { Popover, Input, Button, Table, Row, Col, message } from 'antd';
import React, { PureComponent } from 'react';
import { connect } from 'umi';
import moment from 'moment';
import { debounce } from 'lodash';
import DocumentFilter from './components/DocumentFilter';
import styles from './index.less';
import cancelIcon from '../../../../assets/cancelIcon.svg';
import { FilterIcon } from './components/FilterIcon';
import eye from '../../../../assets/eyes.svg';
import bin from '../../../../assets/bin.svg';
import ModalAddDoc from './components/ModalAddDoc';
import ViewDocumentModal from '@/components/ViewDocumentModal';

@connect(
  ({
    loading,
    customerProfile: { documents = [], documentType = [], info = {} } = {},
    user: { companiesOfUser = [], currentUser: { _id = '', firstName = '' } = {} } = {},
  }) => ({
    loadingDocument: loading.effects['customerProfile/fetchDocuments'],
    loadingDocumentType: loading.effects['customerProfile/fetchDocumentsTypes'],
    documents,
    info,
    _id,
    firstName,
    documentType,
    companiesOfUser,
  }),
)
class Documents extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      isUnhide: false,
      uploadedAttachments: [],
      fileUrl: '',
      fileName: '',
      link: '',
      viewDocumentModal: false,
      file: null,
    };
    this.delaySearch = debounce((value) => {
      this.handleSearch(value);
    }, 1000);
  }

  componentDidMount() {
    const { dispatch, reId } = this.props;

    dispatch({
      type: 'customerProfile/fetchDocuments',
      payload: {
        id: reId,
      },
    });

    dispatch({
      type: 'customerProfile/fetchDocumentsTypes',
    });
  }

  handlePreview = (fileName) => {
    this.setState({
      uploadedAttachments: fileName,
    });
  };

  beforeUpload = (file) => {
    const { maxFileSize = 25 } = this.props;
    const checkType = file.type === 'application/pdf' || file.type === 'image/jpeg';

    if (!checkType) {
      message.error('You can only upload JPG/PNG/PDF file!');
    }
    const isLtMaxFileSize = file.size / 1024 / 1024 < maxFileSize;
    if (!isLtMaxFileSize) {
      if (file.type === 'image/jpeg') {
        message.error(`Image must smaller than ${maxFileSize}MB!`);
      }
      if (file.type === 'application/pdf') {
        message.error(`File must smaller than ${maxFileSize}MB!`);
      }
    }
    return checkType && isLtMaxFileSize;
  };

  getResponse = (resp) => {
    const { statusCode, data = [] } = resp;
    const { id = '', fileName = '' } = data[0];
    if (statusCode === 200) {
      this.setState({
        fileUrl: id,
        fileName,
      });
    }
  };

  handleRemove = (file) => {
    const { uploadedAttachments } = this.state;
    let uploadedAttachmentsTemp = JSON.parse(JSON.stringify(uploadedAttachments));
    uploadedAttachmentsTemp = uploadedAttachmentsTemp.filter(
      (att) => att.name !== file.name && att.size !== file.size,
    );
    this.setState({
      uploadedAttachments: uploadedAttachmentsTemp,
    });
  };

  handleUpload = (file) => {
    const { dispatch } = this.props;
    const formData = new FormData();
    formData.append('uri', file);
    this.setState({
      file,
    });

    dispatch({
      type: 'customerProfile/uploadDoc',
      payload: formData,
    }).then((resp) => {
      const { statusCode = '', data = [] } = resp;
      if (statusCode === 200) {
        const { name = '' } = data[0];

        this.getResponse(resp);
        this.handlePreview(name);
      }
    });
  };

  // handleRemove = async (file) => {
  //   const { uploadedAttachments } = this.state;
  //   let uploadedAttachmentsTemp = JSON.parse(JSON.stringify(uploadedAttachments));
  //   uploadedAttachmentsTemp = uploadedAttachmentsTemp.filter(
  //     (att) => att.name !== file.name && att.size !== file.size,
  //   );
  //   this.setState({
  //     uploadedAttachments: uploadedAttachmentsTemp,
  //   });
  // };

  showFilter = () => {
    const { isUnhide } = this.state;
    this.setState({
      isUnhide: !isUnhide,
    });
  };

  closeFilter = () => {
    const { isUnhide } = this.state;
    this.setState({
      isUnhide: !isUnhide,
    });
  };

  showModal = () => {
    const { visible } = this.state;
    this.setState({
      visible: !visible,
    });
  };

  closeModal = () => {
    const { visible } = this.state;
    this.setState({
      visible: !visible,
    });
  };

  onFilter = (values) => {
    const { byType, fromDate, toDate, byCompany } = values;
    const { dispatch } = this.props;
    dispatch({
      type: 'customerProfile/filterDoc',
      payload: {
        type: parseInt(byType, 10) || '',
        uploadedBy: byCompany || '',
        fromDate: fromDate || '',
        toDate: toDate || '',
      },
    });
  };

  onAddDoc = (values) => {
    const { documentType, documentName, comments } = values;
    const { fileUrl } = this.state;
    const { reId, dispatch, id, firstName, info: { customerId = '' } = {} } = this.props;

    dispatch({
      type: 'customerProfile/addDoc',
      payload: {
        customerId,
        documentType,
        documentName,
        comments: comments || '',
        attachment: fileUrl,
        owner: id,
        ownerName: firstName,
      },
    }).then(() => {
      dispatch({
        type: 'customerProfile/fetchDocuments',
        payload: {
          id: reId,
        },
      });
      const { visible } = this.state;
      this.setState({
        visible: !visible,
      });
      window.location.reload(true);
    });
  };

  removeDoc = (id) => {
    const { dispatch, reId } = this.props;
    dispatch({
      type: 'customerProfile/removeDoc',
      payload: {
        id,
      },
    }).then(() => {
      dispatch({
        type: 'customerProfile/fetchDocuments',
        payload: {
          id: reId,
        },
      });
    });
  };

  setViewDocumentModal = (value) => {
    this.setState({
      viewDocumentModal: value,
    });
  };

  viewDocument = (doc) => {
    this.setViewDocumentModal(true);
    this.setState({
      link: doc.attachmentInfo.url,
    });
  };

  handleSearch = (value) => {
    const { dispatch, reId } = this.props;
    dispatch({
      type: 'customerProfile/searchDocuments',
      payload: {
        id: reId,
        searchKey: value,
      },
    });
  };

  generateColumns = () => {
    const columns = [
      {
        title: 'Document Name',
        dataIndex: 'documentName',
        align: 'center',
        fixed: 'left',
        width: '10%',
      },
      {
        title: 'Document Type',
        dataIndex: 'documentType',
        align: 'center',
        width: '10%',
      },
      {
        title: 'Uploaded By',
        dataIndex: 'ownerName',
        width: '10%',
        align: 'center',
      },
      {
        title: 'Uploaded On',
        dataIndex: 'createAt',
        width: '10%',
        align: 'center',
        render: (createdAt) => {
          const time = moment(createdAt).format('M/DD/YY');
          return <p>{time}</p>;
        },
      },
      {
        title: 'Action',
        // dataIndex: 'pendingTasks',
        width: '10%',
        align: 'center',
        render: (document) => {
          return (
            <div className={styles.action}>
              <span style={{ cursor: 'pointer' }} onClick={() => this.viewDocument(document)}>
                <img src={eye} alt="adf" />
              </span>

              <span
                onClick={() => this.removeDoc(document.id)}
                style={{ cursor: 'pointer', display: 'inline-block', marginLeft: '8px' }}
              >
                <img src={bin} alt="dfa" />
              </span>
            </div>
          );
        },
      },
    ];

    return columns.map((col) => ({
      ...col,
      title: col.title,
    }));
  };

  identifyImageOrPdf = (fileName) => {
    const parts = fileName.split('.');
    const ext = parts[parts.length - 1];
    switch (ext.toLowerCase()) {
      case 'jpg':
      case 'jpeg':
        // case 'gif':
        // case 'bmp':
        // case 'png':
        return 0;
      case 'pdf':
        return 1;
      default:
        return 0;
    }
  };

  render() {
    const { viewDocumentModal, visible, isUnhide, uploadedAttachments, link, fileName } =
      this.state;
    const { documents, documentType, companiesOfUser } = this.props;

    const filter = (
      <>
        <DocumentFilter
          onFilter={this.onFilter}
          companiesOfUser={companiesOfUser}
          documentType={documentType}
        />
        <div className={styles.btnForm}>
          <Button className={styles.btnClose} onClick={this.closeFilter}>
            Close
          </Button>
          <Button
            className={styles.btnApply}
            form="filter"
            htmlType="submit"
            key="submit"
            // onClick={this.onFilter}
          >
            Apply
          </Button>
        </div>
      </>
    );

    return (
      <div className={styles.Documents}>
        <div className={styles.documentHeader}>
          <div className={styles.documentHeaderTitle}>
            <p>Documents</p>
          </div>
          <div className={styles.documentHeaderFunction}>
            {/* Add doc */}
            <div>
              <p className={styles.buttonAddImport} onClick={this.showModal}>
                <PlusOutlined />
                Add Document
              </p>
            </div>
            <ModalAddDoc
              visible={visible}
              showModal={this.showModal}
              closeModal={this.closeModal}
              action={this.handleUpload}
              beforeUpload={this.beforeUpload}
              documentType={documentType}
              onRemove={this.handleRemove}
              uploadedAttachments={uploadedAttachments}
              fileName={fileName}
              identifyImageOrPdf={this.identifyImageOrPdf}
              onAddDoc={this.onAddDoc}
            />
            {/* Filter */}
            <div>
              <Popover
                placement="bottomLeft"
                content={filter}
                title={() => (
                  <div className={styles.popoverHeader}>
                    <p className={styles.headTitle}>Filters</p>
                    <p
                      className={styles.closeIcon}
                      style={{ cursor: 'pointer' }}
                      onClick={this.closeFilter}
                    >
                      <img src={cancelIcon} alt="close" />
                    </p>
                  </div>
                )}
                trigger="click"
                visible={isUnhide}
                onVisibleChange={this.closeFilter}
              >
                <div className={styles.filterButton} style={{ cursor: 'pointer' }}>
                  <FilterIcon />
                  <p className={styles.textButtonFilter}>Filter</p>
                </div>
              </Popover>
            </div>
            {/* Search */}
            <div className={styles.searchInp}>
              <Input
                onChange={(e) => this.delaySearch(e.target.value)}
                placeholder="Search by Document Type"
                prefix={<SearchOutlined />}
              />
            </div>
          </div>
        </div>
        <div className={styles.documentBody}>
          <Table columns={this.generateColumns()} dataSource={documents} pagination={false} />
          <ViewDocumentModal
            url={link}
            visible={viewDocumentModal}
            onClose={() => this.setViewDocumentModal(false)}
          />
        </div>
      </div>
    );
  }
}

export default Documents;
