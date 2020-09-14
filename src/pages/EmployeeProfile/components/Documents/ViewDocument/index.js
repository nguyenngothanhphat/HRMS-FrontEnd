import React, { PureComponent } from 'react';
import { Button, Row, Col, Select, Spin } from 'antd';
import debounce from 'lodash/debounce';
import GoBackButton from '../../../../../assets/goBack_icon.svg';
import styles from './index.less';

const { Option } = Select;

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

  fetchUser = (value) => {
    console.log('fetching user', value);
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
            <span>Hi em</span>
          </div>
          <div className={styles.documentPages} />
          <div className={styles.documentInfo}>
            <Row className={styles.infoRow}>
              <Col className={styles.infoCol1} span={8}>
                Document Type
              </Col>
              <Col className={styles.infoCol2} span={16}>
                Adhaar Card
              </Col>
            </Row>
            <Row className={styles.infoRow}>
              <Col className={styles.infoCol1} span={8}>
                Adhaar Card Number
              </Col>
              <Col className={styles.infoCol2} span={16}>
                9999-0000-0000-0000
              </Col>
            </Row>
            <Row className={styles.infoRow}>
              <Col className={styles.infoCol1} span={8}>
                Share with
              </Col>
              <Col className={styles.infoCol2} span={16}>
                <Select
                  mode="multiple"
                  labelInValue
                  value={value}
                  placeholder="Select users"
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
