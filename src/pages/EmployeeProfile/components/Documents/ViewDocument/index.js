import React, { PureComponent } from 'react';
import { Button, Row, Col, Select, Spin, Upload, message } from 'antd';
import debounce from 'lodash/debounce';
import { InboxOutlined } from '@ant-design/icons';
import GoBackButton from '../../../../../assets/goBack_icon.svg';
import AttachmentIcon from '../../../../../assets/attachment_icon.svg';
import styles from './index.less';

const { Dragger } = Upload;

const { Option } = Select;

const propsUploadFile = {
  name: 'file',
  multiple: true,
  action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
  onChange(info) {
    const { status } = info.file;
    if (status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (status === 'done') {
      message.success(`${info.file.name} file uploaded successfully.`);
    } else if (status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  },
};
export default class ViewDocument extends PureComponent {
  constructor(props) {
    super(props);
    this.lastFetchId = 0;
    this.fetchUser = debounce(this.fetchUser, 800);
  }

  state = {
    data: [],
    value: [],
    fetching: false,
  };

  fetchUser = () => {
    this.lastFetchId += 1;
    const fetchId = this.lastFetchId;
    this.setState({ data: [], fetching: true });
    fetch('https://randomuser.me/api/?results=5')
      .then((response) => response.json())
      .then((body) => {
        if (fetchId !== this.lastFetchId) {
          // for fetch callback order
          return;
        }
        const data = body.results.map((user) => ({
          text: `${user.name.first} ${user.name.last}`,
          value: user.login.username,
        }));
        this.setState({ data, fetching: false });
      });
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
    return (
      <div className={styles.ViewDocument}>
        <div className={styles.tableTitle}>
          <span>View Document - Preview</span>
          <div className={styles.goBackButton}>
            <img src={GoBackButton} alt="back" />
            <span>Go back</span>
          </div>
        </div>
        <div className={styles.tableContent}>
          <div className={styles.documentPreviewFrame}>
            <Dragger {...propsUploadFile}>
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
                    <Option key={d.value}>{d.text}</Option>
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
