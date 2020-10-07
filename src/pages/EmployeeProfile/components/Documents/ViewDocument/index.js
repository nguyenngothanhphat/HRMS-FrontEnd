import React, { PureComponent } from 'react';
import { Button, Row, Col, Select, Spin } from 'antd';
import { Document, Page, pdfjs } from 'react-pdf';
import { formatMessage, connect } from 'umi';
import UploadImage from '@/components/UploadImage';
import { LoadingOutlined } from '@ant-design/icons';
import GoBackButton from '@/assets/goBack_icon.svg';

import ArrowLeftIcon from '@/assets/arrow-left_icon.svg';
import ArrowRightIcon from '@/assets/arrow-right_icon.svg';
import styles from './index.less';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const { Option } = Select;

const mockData = [
  {
    id: 123,
    value: 'ngoctuanitpy@gmail.com',
  },
  {
    id: 456,
    value: 'tuan@gmail.com',
  },
  {
    id: 789,
    value: 'example@hotmail.com',
  },
  {
    id: 777,
    value: 'elonmusk@gmail.com',
  },
  {
    id: 433,
    value: 'testemail1@gmail.com',
  },
  {
    id: 889,
    value: 'testemail2@gmail.com',
  },
  {
    id: 232,
    value: 'emailex1@hotmail.com',
  },
  {
    id: 298,
    value: 'emailex3@gmail.com',
  },
];

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

@connect(({ employeeProfile, loading }) => ({
  loading: loading.effects['upload/uploadFile'],
  employeeProfile,
}))
class ViewDocument extends PureComponent {
  constructor(props) {
    super(props);
    const { selectedFile } = this.props;
    this.state = {
      numPages: null,
      currentViewingFile: selectedFile,
      fileLoading: false,
    };
  }

  // File Viewing
  getCurrentViewingFileUrl = () => {
    const { currentViewingFile } = this.state;
    const { files } = this.props;
    let i;
    for (i = 1; i <= files.length; i += 1) {
      if (i === currentViewingFile) {
        return files[i - 1].source;
      }
    }
    return null;
  };

  handlePrevViewingFile = () => {
    const { currentViewingFile } = this.state;
    if (currentViewingFile > 1) {
      this.setState((prevState) => ({
        currentViewingFile: prevState.currentViewingFile - 1,
        fileLoading: true,
      }));
    }
    setTimeout(() => {
      this.setState({
        fileLoading: false,
      });
    }, 1000);
  };

  handleNextViewingFile = () => {
    const { files } = this.props;
    const { currentViewingFile } = this.state;
    if (currentViewingFile < files.length) {
      this.setState((prevState) => ({
        currentViewingFile: prevState.currentViewingFile + 1,
        fileLoading: true,
      }));
    }
    setTimeout(() => {
      this.setState({
        fileLoading: false,
      });
    }, 2000);
  };

  onDocumentLoadSuccess = ({ numPages }) => {
    this.setState({
      numPages,
    });
  };

  // on Save button click
  onSaveClick = () => {
    // eslint-disable-next-line no-alert
    alert('Save');
  };

  getUrl = (resp) => {
    const { statusCode, data = [] } = resp;
    if (statusCode === 200) {
      const [first] = data;
      // eslint-disable-next-line no-console
      console.log('URL Image', first.url);
    }
  };

  handleChange = (value) => {
    // eslint-disable-next-line no-console
    console.log(`selected emails ${value}`);
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
      console.log('======== visa: ', visa);
      files.forEach((file, index) => {
        console.log('->file: ', file);
        if (_id === file.id && visaNumber !== undefined && currentViewingFile === index) {
          visaNumberFinal = visa.visaNumber;
        }
      });
    });
    return visaNumberFinal;
  };

  render() {
    const { numPages, currentViewingFile, fileLoading } = this.state;
    const { onBackClick, typeOfSelectedFile, files, loading } = this.props;
    const {
      employeeProfile: {
        tempData: { passportData = {}, visaData = [] },
      },
    } = this.props;
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
            {identifyImageOrPdf(this.getCurrentViewingFileUrl()) === 0 ? (
              <div className={styles.imageFrame}>
                <img alt="preview" src={this.getCurrentViewingFileUrl()} />
              </div>
            ) : (
              <Document
                className={styles.pdfFrame}
                onLoadSuccess={this.onDocumentLoadSuccess}
                file={this.getCurrentViewingFileUrl()}
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
              <span>{currentViewingFile}</span>/{files.length}
            </div>
            <div className={styles.filesPagination}>
              <div>
                {fileLoading ? (
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
                {typeOfSelectedFile}
              </Col>
            </Row>

            <Row className={styles.infoRow}>
              <Col className={styles.infoCol1} span={7}>
                Document Name
              </Col>
              <Col className={styles.infoCol2} span={17}>
                {files[currentViewingFile - 1].fileName}
              </Col>
            </Row>

            {this.includeString(typeOfSelectedFile, 'identity') ? (
              <Row className={styles.infoRow}>
                <Col className={styles.infoCol1} span={7}>
                  {files[currentViewingFile - 1].fileName} Number
                </Col>
                <Col className={styles.infoCol2} span={17}>
                  {this.includeString(files[currentViewingFile - 1].fileName, 'passport')
                    ? passportData.passportNumber
                    : ''}
                  {this.includeString(files[currentViewingFile - 1].fileName, 'visa')
                    ? this.getVisaInformation(visaData, files, currentViewingFile - 1)
                    : ''}
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
                  className={styles.shareViaEmailInput}
                >
                  {mockData.map((d) => (
                    <Option key={d.value}>{d.value}</Option>
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
            getResponse={this.getUrl}
          />

          <Button onClick={this.onSaveClick} className={styles.saveButton}>
            {formatMessage({ id: 'pages.employeeProfile.documents.viewDocument.saveBtn' })}
          </Button>
        </div>
      </div>
    );
  }
}

export default ViewDocument;
