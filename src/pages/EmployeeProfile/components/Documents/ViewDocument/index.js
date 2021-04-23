import React, { PureComponent } from 'react';
import { Button, Row, Col, Select, Spin } from 'antd';
import { Document, Page, pdfjs } from 'react-pdf';
import { formatMessage, connect } from 'umi';
import UploadImage from '@/components/UploadImage';
import { LoadingOutlined } from '@ant-design/icons';
import GoBackButton from '@/assets/goBack_icon.svg';
import CustomModal from '@/components/CustomModal';

import ArrowLeftIcon from '@/assets/arrow-left_icon.svg';
import ArrowRightIcon from '@/assets/arrow-right_icon.svg';
import ModalImg from '@/assets/modal_img_1.png';
import styles from './index.less';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const { Option } = Select;

const identifyImageOrPdf = (fileName) => {
  const parts = fileName.split('.');
  const ext = parts[parts.length - 1];
  switch (ext.toLowerCase()) {
    case 'jpg':
    case 'jpeg':
    case 'gif':
    case 'bmp':
    case 'png':
      return 0;
    case 'pdf':
      return 1;
    default:
      return 0;
  }
};

const ModalContent = ({ closeModal = () => {} }) => {
  return (
    <div className={styles.modal} style={{ textAlign: 'center', padding: 20 }}>
      <img src={ModalImg} alt="modalImg" style={{ maxWidth: '100%' }} />
      <h3 className={styles.title}>Share document successfully</h3>
      <Button
        onClick={() => closeModal()}
        style={{
          background: '#ffa100',
          borderRadius: 25,
          height: 40,
          width: 70,
          fontWeight: 600,
          fontSize: 14,
          lineHeight: '16px',
          textAlign: 'center',
          color: '#ffffff',
          border: 0,
        }}
      >
        OK
      </Button>
    </div>
  );
};

@connect(({ employeeProfile, loading }) => ({
  loading: loading.effects['upload/uploadFile'],
  loadingFileDetail: loading.effects['employeeProfile/fetchViewingDocumentDetail'],
  employeeProfile,
}))
class ViewDocument extends PureComponent {
  constructor(props) {
    super(props);
    const { selectedFile } = this.props;
    this.state = {
      numPages: null,
      currentViewingFile: selectedFile,
      shareWith: [],
      openModal: false,
      selectedStr: undefined,
    };
    this.shareRef = React.createRef();
  }

  // get document details
  fetchDocumentDetails = (selectedFile) => {
    const {
      employeeProfile: {
        groupViewingDocuments = [],
        tenantCurrentEmployee = '',
        idCurrentEmployee = '',
      },
      dispatch,
    } = this.props;
    const { currentViewingFile } = this.state;
    let i;
    for (i = 1; i <= groupViewingDocuments.length; i += 1) {
      if (i === currentViewingFile) {
        dispatch({
          type: 'employeeProfile/fetchViewingDocumentDetail',
          payload: {
            id: groupViewingDocuments[selectedFile - 1].id,
            tenantId: tenantCurrentEmployee,
            employee: idCurrentEmployee,
          },
        });
      }
    }
  };

  fetchEmailsListByCompany = () => {
    const {
      dispatch,
      employeeProfile: {
        tenantCurrentEmployee = '',
        tempData: { compensationData: { company = '' } = {} } = {},
      } = {},
    } = this.props;
    dispatch({
      type: 'employeeProfile/fetchEmailsListByCompany',
      payload: { company: [company], tenantId: tenantCurrentEmployee },
    });
  };

  renderEmailsList = () => {
    const {
      employeeProfile: { emailsList = [] },
    } = this.props;
    const list = emailsList.map((user) => {
      const { generalInfo: { workEmail = '' } = {} } = user;
      return workEmail;
    });
    return list.filter((value) => value !== '');
  };

  componentDidMount = () => {
    const { selectedFile } = this.props;
    this.fetchDocumentDetails(selectedFile);
    this.fetchEmailsListByCompany();
    window.scroll({ top: 0, left: 0, behavior: 'smooth' });
  };

  componentWillUnmount = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'employeeProfile/removeViewingDocumentDetail',
    });
  };

  // File Viewing
  getCurrentViewingFileUrl = () => {
    const { currentViewingFile } = this.state;
    const {
      employeeProfile: { groupViewingDocuments = [] },
    } = this.props;

    let i;
    for (i = 1; i <= groupViewingDocuments.length; i += 1) {
      if (i === currentViewingFile) {
        return groupViewingDocuments[i - 1].source;
      }
    }
    return null;
  };

  handlePrevViewingFile = () => {
    const { currentViewingFile } = this.state;
    if (currentViewingFile > 1) {
      this.setState((prevState) => ({
        currentViewingFile: prevState.currentViewingFile - 1,
      }));
      this.fetchDocumentDetails(currentViewingFile - 1);
    }
  };

  handleNextViewingFile = () => {
    const {
      employeeProfile: { groupViewingDocuments = [] },
    } = this.props;

    const { currentViewingFile } = this.state;
    if (currentViewingFile < groupViewingDocuments.length) {
      this.setState((prevState) => ({
        currentViewingFile: prevState.currentViewingFile + 1,
      }));
      this.fetchDocumentDetails(currentViewingFile + 1);
    }
  };

  onDocumentLoadSuccess = ({ numPages }) => {
    this.setState({
      numPages,
    });
  };

  // on Save button click
  onSaveClick = async () => {
    this.shareRef.current.value = '';
    const { shareWith = [] } = this.state;
    if (shareWith.length === 0) {
      return;
    }

    const {
      employeeProfile: { tenantCurrentEmployee = '', documentDetail: { _id } = {} } = {},
      dispatch,
    } = this.props;
    const res = await dispatch({
      type: 'employeeProfile/shareDocumentEffect',
      payload: {
        shareWith,
        id: _id,
        tenantId: tenantCurrentEmployee,
      },
    });

    if (res.statusCode === 200) {
      this.setState({
        openModal: true,
        shareWith: [],
        selectedStr: undefined,
      });
    }
  };

  uploadNew = (resp) => {
    const { statusCode, data = [] } = resp;

    const {
      dispatch,
      employeeProfile: { groupViewingDocuments = [] },
    } = this.props;
    const { currentViewingFile } = this.state;

    if (statusCode === 200) {
      const [attachment] = data;
      dispatch({
        type: 'employeeProfile/updateDocument',
        payload: {
          id: groupViewingDocuments[currentViewingFile - 1].id,
          attachment: attachment.id,
        },
      });
    }
    this.fetchDocumentDetails(currentViewingFile);
  };

  handleChange = (value) => {
    // eslint-disable-next-line no-console
    console.log(`selected emails ${value}`);
    this.setState({
      selectedStr: value,
    });
    if (value) {
      const shareEmail = value.toString().split(',');
      this.setState({
        shareWith: shareEmail,
      });
    }
  };

  documentWarning = (msg) => (
    <div className={styles.documentWarning}>
      <p>{msg}</p>
    </div>
  );

  includeString = (str1, str2) => {
    return str1.toLowerCase().includes(str2.toLowerCase());
  };

  // get visa information
  getVisaInformation = (visaData, files, currentViewingFile) => {
    let visaNumberFinal = '';
    visaData.forEach((visa) => {
      const { document, visaNumber } = visa;
      const { _id } = document;
      files.forEach((file, index) => {
        if (_id === file.id && visaNumber !== undefined && currentViewingFile === index) {
          visaNumberFinal = visaNumber;
        }
      });
    });
    return visaNumberFinal;
  };

  // get visa information
  getPassportInformation = (passportData, files, currentViewingFile) => {
    let passportNumberFinal = '';
    passportData.forEach((passport) => {
      const { document, passportNumber } = passport;
      const { _id } = document;
      files.forEach((file, index) => {
        if (_id === file.id && passportNumber !== undefined && currentViewingFile === index) {
          passportNumberFinal = passportNumber;
        }
      });
    });
    return passportNumberFinal;
  };

  render() {
    const { numPages, currentViewingFile, openModal, selectedStr } = this.state;
    const { onBackClick, loading, loadingFileDetail, loading2 } = this.props;
    const {
      employeeProfile: {
        tempData: { passportData = [], visaData = [], generalData: { adhaarCardNumber = '' } = {} },
        groupViewingDocuments,
        documentDetail,
      },
    } = this.props;
    const { key = '', employeeGroup = '', attachment: { url = '' } = {} } = documentDetail;

    return (
      <div className={styles.ViewDocument}>
        <div className={styles.tableTitle}>
          <span>{formatMessage({ id: 'pages.employeeProfile.documents.viewDocument.title' })}</span>
          <div onClick={onBackClick} className={styles.goBackButton}>
            <img src={GoBackButton} alt="back" />
            <span>
              {formatMessage({ id: 'pages.employeeProfile.documents.viewDocument.goBack' })}
            </span>
          </div>
        </div>

        <div className={styles.tableContent}>
          {/* DOCUMENT VIEWER FRAME */}
          <div className={styles.documentPreviewFrame}>
            {identifyImageOrPdf(url) === 0 ? (
              <div className={styles.imageFrame}>
                <img alt="preview" src={url} />
              </div>
            ) : (
              <Document
                className={styles.pdfFrame}
                onLoadSuccess={this.onDocumentLoadSuccess}
                file={url}
                loading={this.documentWarning('Loading document. Please wait...')}
                noData={this.documentWarning('URL is not available.')}
              >
                {Array.from(new Array(numPages), (el, index) => (
                  <Page
                    loading=""
                    className={styles.pdfPage}
                    key={`page_${index + 1}`}
                    pageNumber={index + 1}
                  />
                ))}
              </Document>
            )}
          </div>

          {/* PAGINATION OF DOCUMENT VIEWER */}
          <div className={styles.documentPagination}>
            <div className={styles.numberOfFiles}>
              <span>{currentViewingFile}</span>/{groupViewingDocuments.length}
            </div>
            <div className={styles.filesPagination}>
              <div>
                {loadingFileDetail ? (
                  <div>
                    <Spin />
                  </div>
                ) : (
                  ''
                )}
              </div>
              <img src={ArrowLeftIcon} alt="prev-file" onClick={this.handlePrevViewingFile} />
              <img src={ArrowRightIcon} alt="next-file" onClick={this.handleNextViewingFile} />
            </div>
          </div>

          {/* DOCUMENT INFORMATION & SHARING */}
          <div className={styles.documentInfo}>
            <Row className={styles.infoRow}>
              <Col className={styles.infoCol1} span={7}>
                {formatMessage({ id: 'pages.employeeProfile.documents.viewDocument.documentType' })}
              </Col>
              <Col className={styles.infoCol2} span={17}>
                {employeeGroup}
              </Col>
            </Row>

            <Row className={styles.infoRow}>
              <Col className={styles.infoCol1} span={7}>
                Document Name
              </Col>
              <Col className={styles.infoCol2} span={17}>
                {key}
              </Col>
            </Row>

            {this.includeString(employeeGroup, 'identity') ? (
              <Row className={styles.infoRow}>
                <Col className={styles.infoCol1} span={7}>
                  {key} Number
                </Col>
                <Col className={styles.infoCol2} span={17}>
                  {this.includeString(key, 'passport')
                    ? this.getPassportInformation(
                        passportData,
                        groupViewingDocuments,
                        currentViewingFile - 1,
                      )
                    : ''}
                  {this.includeString(key, 'visa')
                    ? this.getVisaInformation(
                        visaData,
                        groupViewingDocuments,
                        currentViewingFile - 1,
                      )
                    : ''}

                  {this.includeString(key, 'adhaar') ? adhaarCardNumber : ''}
                </Col>
              </Row>
            ) : (
              ''
            )}

            <Row className={styles.infoRow}>
              <Col className={`${styles.infoCol1} ${styles.shareWithLabel}`} span={7}>
                {formatMessage({ id: 'pages.employeeProfile.documents.viewDocument.shareWith' })}
              </Col>
              <Col className={styles.infoCol2} span={17}>
                <Select
                  mode="multiple"
                  placeholder={formatMessage({
                    id: 'pages.employeeProfile.documents.viewDocument.emailPlaceholder',
                  })}
                  onChange={this.handleChange}
                  showArrow
                  value={selectedStr}
                  className={styles.shareViaEmailInput}
                  ref={this.shareRef}
                >
                  {this.renderEmailsList().map((email) => (
                    <Option key={email}>{email}</Option>
                  ))}
                </Select>
              </Col>
            </Row>
          </div>
        </div>

        {/* BUTTONS */}
        <div className={styles.operationButton}>
          <UploadImage
            content={
              <>
                <span>
                  {formatMessage({
                    id: 'pages.employeeProfile.documents.viewDocument.uploadNewBtn',
                  })}
                </span>
                {loading && <LoadingOutlined className={styles.loadingIcon} />}
              </>
            }
            getResponse={this.uploadNew}
          />

          <Button loading={loading2} onClick={this.onSaveClick} className={styles.saveButton}>
            {formatMessage({ id: 'pages.employeeProfile.documents.viewDocument.saveBtn' })}
          </Button>
        </div>

        <CustomModal
          open={openModal}
          // open
          content={<ModalContent closeModal={() => this.setState({ openModal: false })} />}
        />
      </div>
    );
  }
}

export default ViewDocument;
