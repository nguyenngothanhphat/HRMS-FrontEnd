import React, { PureComponent } from 'react';
import { Row, Col, Form, Select, DatePicker, Button, Checkbox } from 'antd';
import moment from 'moment';
import styles from './index.less';

const { Option } = Select;
export default class OptionsHeader extends PureComponent {
  onFinish = (values) => {
    // eslint-disable-next-line no-console
    // console.log('values', values);
    const { status = [], fromDate = '', toDate = '' } = values;
    const from = moment(fromDate).locale('en').format('MM.DD.YY');
    const to = moment(toDate).locale('en').format('MM.DD.YY');
    const filterData = {
      status,
      fromDate: fromDate !== '' && fromDate !== null ? from : '',
      toDate: toDate !== '' && toDate !== null ? to : '',
    };
    const { reloadData = () => {} } = this.props;
    reloadData(filterData);
  };

  render() {
    const dateFormat = 'MM.DD.YY';

    const statusType = {
      inProgress: 'IN-PROGRESS',
      draft: 'DRAFT',
      completed: 'COMPLETED',
      deleted: 'DELETED',
      done: 'DONE',
      onHold: 'ON-HOLD',
      accepted: 'ACCEPTED',
      rejected: 'REJECTED',
    };

    const options = [
      { value: statusType.accepted, label: 'Approved' },
      { value: statusType.inProgress, label: 'In Progress' },
      { value: statusType.rejected, label: 'Rejected' },
      { value: statusType.draft, label: 'Draft' },
      { value: statusType.onHold, label: 'On-hold' },
      { value: statusType.deleted, label: 'Deleted' },
      { value: statusType.done, label: 'Done' },
      { value: statusType.completed, label: 'Completed' },
    ];
    const nameOpt = options.map((op) => op.value);

    return (
      <div className={styles.OptionsHeader}>
        <div className={styles.container}>
          <Form name="uploadForm" ref={this.formRef} onFinish={this.onFinish}>
            <Row gutter={['20', '20']}>
              <Col xs={7}>
                <span className={styles.itemLabel}>User ID - Name</span>
                <Form.Item name="userIdName">
                  <Select placeholder="Select an user" onChange={() => {}}>
                    <Option value="User A">User A</Option>
                    <Option value="User B">User B</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={9}>
                <span className={styles.itemLabel}>Duration</span>
                <div>
                  <Row gutter={['20', '20']}>
                    <Col xs={12}>
                      <Form.Item name="fromDate">
                        <DatePicker placeholder="From Date" format={dateFormat} />
                      </Form.Item>
                    </Col>
                    <Col xs={12}>
                      <span />
                      <Form.Item name="toDate">
                        <DatePicker placeholder="To Date" format={dateFormat} />
                      </Form.Item>
                    </Col>
                  </Row>
                </div>
              </Col>
              <Col className={styles.buttons} xs={8}>
                <Button className={styles.submitBtn} htmlType="submit">
                  Get data
                </Button>
                <Button className={styles.downloadCSVBtn}>Download as CSV</Button>
              </Col>
            </Row>
            <Row>
              <Col className={styles.statusFilter}>
                <span className={styles.itemLabel}>Status</span>
                <Form.Item name="status" className={styles.filterItem}>
                  <Checkbox.Group options={options} name={nameOpt} />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </div>
      </div>
    );
  }
}

// inProgress: 'IN-PROGRESS',
// draft: 'DRAFT',
// completed: 'COMPLETED',
// deleted: 'DELETED',
// done: 'DONE',
// onHold: 'ON-HOLD',
// accepted: 'ACCEPTED',
// rejected: 'REJECTED',
// },
