import React, { PureComponent } from 'react';
import { Button, Row, Col, Select, Spin, Upload } from 'antd';
import debounce from 'lodash/debounce';
import { Document, Page, pdfjs } from 'react-pdf';
import { formatMessage } from 'umi';
import GoBackButton from '../../../../../assets/goBack_icon.svg';
import styles from './index.less';

import ArrowLeftIcon from '../../../../../assets/arrow-left_icon.svg';
import ArrowRightIcon from '../../../../../assets/arrow-right_icon.svg';

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
];

export default class ViewDocument extends PureComponent {
  constructor(props) {
    super(props);
    this.fetchEmails = debounce(this.fetchEmails, 800);
    const { selectedFile } = this.props;
    this.state = {
      data: [],
      value: [],
      fetching: false,
      numPages: null,
      currentViewingFile: selectedFile,
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
      }));
    }
  };

  handleNextViewingFile = () => {
    const { files } = this.props;
    const { currentViewingFile } = this.state;
    if (currentViewingFile < files.length) {
      this.setState((prevState) => ({
        currentViewingFile: prevState.currentViewingFile + 1,
      }));
    }
  };

  onDocumentLoadSuccess = ({ numPages }) => {
    this.setState({
      numPages,
    });
  };

  // search emails to share
  fetchEmails = (value) => {
    this.setState({
      data: [],
      fetching: true,
    });
    setTimeout(() => {
      const searchResult = mockData.filter((row = {}) => row.value.includes(value));
      if (searchResult.length > 0) {
        this.setState({
          data: searchResult,
          fetching: false,
        });
      } else {
        this.setState({
          data: [],
          fetching: false,
        });
      }
    }, 500);
  };

  handleChange = (value) => {
    this.setState({
      value,
      data: [],
      fetching: false,
    });
  };

  // on Save button click
  onSaveClick = () => {
    alert('Save');
  };

  render() {
    const { fetching, data, value, numPages, currentViewingFile } = this.state;
    const { onBackClick, typeOfSelectedFile, files } = this.props;

    return (
      <div className={styles.ViewDocument}>
        <div className={styles.tableTitle}>
          <span>
            {formatMessage({ id: 'pages.employeeProfile.documents.viewDocument.title' })} -{' '}
            {files[currentViewingFile - 1].fileName}
          </span>
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
            <Document
              className={styles.pdfFrame}
              onLoadSuccess={this.onDocumentLoadSuccess}
              // eslint-disable-next-line no-console
              onLoadError={console.error}
              file={this.getCurrentViewingFileUrl()}
              loading=""
              noData="Document Not Found"
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
          </div>

          {/* PAGINATION OF DOCUMENT VIEWER */}
          <div className={styles.documentPagination}>
            <div className={styles.numberOfFiles}>
              <span>{currentViewingFile}</span>/{files.length}
            </div>
            <div className={styles.filesPagination}>
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
                Adhaar Card Number
              </Col>
              <Col className={styles.infoCol2} span={17}>
                9999-0000-0000-0000
              </Col>
            </Row>
            <Row className={styles.infoRow}>
              <Col className={styles.infoCol1} span={7}>
                {formatMessage({ id: 'pages.employeeProfile.documents.viewDocument.shareWith' })}
              </Col>
              <Col className={styles.infoCol2} span={17}>
                <Select
                  mode="multiple"
                  labelInValue
                  value={value}
                  placeholder={formatMessage({
                    id: 'pages.employeeProfile.documents.viewDocument.emailPlaceholder',
                  })}
                  notFoundContent={fetching ? <Spin size="small" /> : null}
                  filterOption={false}
                  onSearch={this.fetchEmails}
                  onChange={this.handleChange}
                  className={styles.shareViaEmailInput}
                >
                  {data.map((d) => (
                    <Option key={d.id}>{d.value}</Option>
                  ))}
                </Select>
              </Col>
            </Row>
          </div>
        </div>

        {/* BUTTONS */}
        <div className={styles.operationButton}>
          <Upload showUploadList={false}>
            <Button className={styles.uploadButton} type="link">
              {formatMessage({ id: 'pages.employeeProfile.documents.viewDocument.uploadNewBtn' })}
            </Button>
          </Upload>
          <Button onClick={this.onSaveClick} className={styles.saveButton}>
            {formatMessage({ id: 'pages.employeeProfile.documents.viewDocument.saveBtn' })}
          </Button>
        </div>
      </div>
    );
  }
}
