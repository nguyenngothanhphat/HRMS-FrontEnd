import React, { PureComponent } from 'react';
import { Button, Row, Col, Select, Spin, Upload, message } from 'antd';
import { ArrowLeftOutlined, ArrowRightOutlined } from '@ant-design/icons';
import debounce from 'lodash/debounce';
import { Document, Page, pdfjs } from 'react-pdf';
import GoBackButton from '../../../../../assets/goBack_icon.svg';
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
];

const mockPdfFiles = [
  {
    id: 1,
    source: '/sample_2.pdf',
  },
  {
    id: 2,
    source: '/sample_1.pdf',
  },
];
export default class ViewDocument extends PureComponent {
  constructor(props) {
    super(props);
    this.fetchUser = debounce(this.fetchUser, 800);
    this.state = {
      data: [],
      value: [],
      fetching: false,
      numPages: null,
      currentViewingFile: 1,
    };
  }

  getCurrentViewingFileUrl = () => {
    const { currentViewingFile } = this.state;
    let i;
    for (i = 1; i <= mockPdfFiles.length; i += 1) {
      if (i === currentViewingFile) {
        return mockPdfFiles[i - 1].source;
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
    const { currentViewingFile } = this.state;
    if (currentViewingFile < mockPdfFiles.length) {
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

  fetchUser = (value) => {
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

  onSaveClick = () => {
    alert('Save');
  };

  render() {
    const { fetching, data, value, numPages, currentViewingFile } = this.state;
    const { onBackClick, typeOfSelectedFile } = this.props;
    // const { selectedFile } = this.props;
    // console.log('selected emails: ', value);
    // console.log('selectedFile', selectedFile);
    return (
      <div className={styles.ViewDocument}>
        <div className={styles.tableTitle}>
          <span>View Document - Preview</span>
          <div onClick={onBackClick} className={styles.goBackButton}>
            <img src={GoBackButton} alt="back" />
            <span>Go back</span>
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
            >
              {Array.from(new Array(numPages), (el, index) => (
                <Page className={styles.pdfPage} key={`page_${index + 1}`} pageNumber={index + 1} />
              ))}
            </Document>
          </div>

          {/* PAGINATION OF DOCUMENT VIEWER */}
          <div className={styles.documentPagination}>
            <div className={styles.numberOfFiles}>
              <span>{currentViewingFile}</span>/{mockPdfFiles.length}
            </div>
            <div className={styles.filesPagination}>
              <ArrowLeftOutlined onClick={this.handlePrevViewingFile} />
              <ArrowRightOutlined onClick={this.handleNextViewingFile} />
            </div>
          </div>

          {/* DOCUMENT INFORMATION & SHARING */}
          <div className={styles.documentInfo}>
            <Row className={styles.infoRow}>
              <Col className={styles.infoCol1} span={7}>
                Document Type
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
                Share with
              </Col>
              <Col className={styles.infoCol2} span={17}>
                <Select
                  mode="multiple"
                  labelInValue
                  value={value}
                  placeholder="Choose email address"
                  notFoundContent={fetching ? <Spin size="small" /> : null}
                  filterOption={false}
                  onSearch={this.fetchUser}
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
              Upload new
            </Button>
          </Upload>
          ,
          <Button onClick={this.onSaveClick} className={styles.saveButton}>
            Save
          </Button>
        </div>
      </div>
    );
  }
}
