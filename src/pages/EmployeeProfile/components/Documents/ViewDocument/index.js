import React, { PureComponent } from 'react';
import { Button, Row, Col, Select, Spin, Upload, message } from 'antd';
import debounce from 'lodash/debounce';
import GoBackButton from '../../../../../assets/goBack_icon.svg';
import AttachmentIcon from '../../../../../assets/attachment_icon.svg';
import styles from './index.less';

const { Dragger } = Upload;
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
export default class ViewDocument extends PureComponent {
  constructor(props) {
    super(props);
    this.fetchUser = debounce(this.fetchUser, 800);
    this.state = {
      data: [],
      value: [],
      fetching: false,
    };
  }

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

  render() {
    const { fetching, data, value } = this.state;
    const { onBackClick, selectedFile } = this.props;
    // console.log('selected emails: ', value);
    console.log('selectedFile', selectedFile);
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
          <div className={styles.documentPreviewFrame}>
            <Dragger>
              <p className="ant-upload-text">
                <img src={AttachmentIcon} alt="upload" />{' '}
                <a style={{ color: '#2c6df9', fontWeight: 'bold' }}>Choose file</a> or drap files
                here
              </p>
            </Dragger>
          </div>
          <div className={styles.documentPages} />
          <div className={styles.documentInfo}>
            <Row className={styles.infoRow}>
              <Col className={styles.infoCol1} span={7}>
                Document Type
              </Col>
              <Col className={styles.infoCol2} span={17}>
                Adhaar Card
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
        <div className={styles.operationButton}>
          <Button className={styles.uploadButton} type="link">
            Upload new
          </Button>
          <Button className={styles.saveButton}>Save</Button>
        </div>
      </div>
    );
  }
}
