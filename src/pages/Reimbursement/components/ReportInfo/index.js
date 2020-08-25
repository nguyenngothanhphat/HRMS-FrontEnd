import React, { PureComponent } from 'react';
import { formatMessage } from 'umi-plugin-react/locale';
import { Input, Form, Row, Col, Modal } from 'antd';
import moment from 'moment';
import styles from './index.less';

class ReportInfo extends PureComponent {
  static getDerivedStateFromProps({ value, list }) {
    return { value, list };
  }

  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };
  }

  openModal = () => {
    this.setState({ visible: true });
  };

  hideModal = () => {
    this.setState({ visible: false });
  };

  onChange = e => {
    const { getReportName = () => {} } = this.props;
    getReportName(e.target.value);
  };

  render() {
    const { item = {}, employee = {}, readOnly = true } = this.props;
    const { visible } = this.state;

    return (
      <div style={{ paddingBottom: '10px' }}>
        <div className={styles.title}>{formatMessage({ id: 'report.info' })}</div>
        <Form className={styles.containerForm}>
          <Form.Item
            colon={false}
            label={
              <span className={styles.labelForm}>{formatMessage({ id: 'report.name' })}:</span>
            }
          >
            <Input
              className={styles.inputText}
              onChange={this.onChange}
              readOnly={readOnly}
              defaultValue={item.name}
            />
          </Form.Item>
          <Row gutter={48}>
            <Col span={12}>
              <Form.Item
                colon={false}
                label={
                  <span className={styles.labelForm}>{formatMessage({ id: 'report.owner' })}:</span>
                }
              >
                <Input
                  onClick={() => this.openModal()}
                  className={styles.owner}
                  readOnly
                  defaultValue={item.owner}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                colon={false}
                label={
                  <span className={styles.labelForm}>
                    {formatMessage({ id: 'report.number' })}:
                  </span>
                }
              >
                <Input className={styles.inputText} readOnly defaultValue={item.number} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={48}>
            <Col span={12}>
              <Form.Item
                colon={false}
                label={
                  <span className={styles.labelForm}>
                    {formatMessage({ id: 'report.created' })}:
                  </span>
                }
              >
                <Input
                  className={styles.inputText}
                  readOnly
                  defaultValue={moment(item.created).format('MMM DD, YYYY')}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                colon={false}
                label={
                  <span className={styles.labelForm}>
                    {formatMessage({ id: 'report.submitted' })}:
                  </span>
                }
              >
                <Input
                  className={styles.inputText}
                  readOnly
                  defaultValue={moment(item.submitted).format('MMM DD, YYYY')}
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
        <Modal
          title={
            <span className={styles.modalTitle}>
              {formatMessage({ id: 'report.employee.info' })}
            </span>
          }
          visible={visible}
          onCancel={this.hideModal}
          footer={null}
          className={styles.modalStyle}
        >
          <Row gutter={48}>
            <Col span={12}>
              <Row>
                <Col className={styles.employeeTitle} span={10}>
                  <p>{formatMessage({ id: 'report.employee.fullname' })}</p>
                  <p>{formatMessage({ id: 'report.employee.id' })}</p>
                  <p>{formatMessage({ id: 'report.employee.company' })}</p>
                  <p>{formatMessage({ id: 'report.employee.location' })}</p>
                  <p>{formatMessage({ id: 'report.employee.department' })}</p>
                </Col>
                <Col className={styles.employeeValue} span={14}>
                  <p>{employee.name}</p>
                  <p>{employee.id}</p>
                  <p>{employee.company}</p>
                  <p>{employee.location}</p>
                  <p>{employee.department}</p>
                </Col>
              </Row>
            </Col>
            <Col span={12}>
              <Row>
                <Col className={styles.employeeTitle} span={8}>
                  <p>{formatMessage({ id: 'report.employee.email' })}</p>
                  <p>{formatMessage({ id: 'report.employee.phone' })}</p>
                  <p>{formatMessage({ id: 'report.employee.manager' })}</p>
                </Col>
                <Col className={styles.employeeValue} span={16}>
                  <p>{employee.email}</p>
                  <p>{employee.phone}</p>
                  <p>{employee.manager}</p>
                </Col>
              </Row>
            </Col>
          </Row>
        </Modal>
      </div>
    );
  }
}

export default ReportInfo;
