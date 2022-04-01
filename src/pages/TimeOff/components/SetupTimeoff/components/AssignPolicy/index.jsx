import React, { Component } from 'react';
import { Select, Form, Divider, Row, Col, Button } from 'antd';
// import ModalNotice from '../Modalupload';
import styles from './index.less';
import WorkInProgress from "@/components/WorkInProgress";

class AssignPolicies extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };
  }

  handleCandelSchedule = () => {
    this.setState({
      visible: false,
    });
  };

  handleClick = () => {
    this.setState({
      visible: true,
    });
  };

  onChange = () => {};

  render() {
    const { visible } = this.state;
    return (
      <div>
        <WorkInProgress />
        <div className={styles.titleHeader}>Assign Policies</div>
        <div className={styles.balance}>
          <div className={styles.balanceFrom}>
            <div className={styles.header}>Standard Holiday calendar</div>
            <Divider />
            <Form requiredMark={false} onFinish={this.onFinish} colon={false}>
              <div className={styles.fromBody}>
                <Row gutter={[90, 0]}>
                  <Col xs={24} sm={24} md={24} lg={24} xl={11}>
                    <Form.Item
                      label="Assign to"
                      rules={[{ required: true, message: 'Please select' }]}
                    >
                      <Select className={styles.select} placeholder="All employees" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={24} md={24} lg={24} xl={11}>
                    <Form.Item
                      label="Excluding"
                      rules={[{ required: true, message: 'Please select' }]}
                    >
                      <Select className={styles.select} placeholder="None" />
                    </Form.Item>
                  </Col>
                </Row>
                <div className={styles.textContent}>Standard Workhours and days</div>
                <Row gutter={[90, 0]}>
                  <Col xs={24} sm={24} md={24} lg={24} xl={11}>
                    <Form.Item
                      label="Assign to"
                      rules={[{ required: true, message: 'Please select' }]}
                    >
                      <Select className={styles.select} placeholder="All employees" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={24} md={24} lg={24} xl={11}>
                    <Form.Item
                      label="Excluding"
                      rules={[{ required: true, message: 'Please select' }]}
                    >
                      <Select className={styles.select} placeholder="None" />
                    </Form.Item>
                  </Col>
                </Row>
                <div className={styles.textContent}>Standard Workhours and days</div>
                <Row gutter={[90, 0]}>
                  <Col xs={24} sm={24} md={24} lg={24} xl={11}>
                    <Form.Item
                      label="Assign to"
                      rules={[{ required: true, message: 'Please select' }]}
                    >
                      <Select className={styles.select} placeholder="All employees" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={24} md={24} lg={24} xl={11}>
                    <Form.Item
                      label="Excluding"
                      rules={[{ required: true, message: 'Please select' }]}
                    >
                      <Select className={styles.select} placeholder="None" />
                    </Form.Item>
                  </Col>
                </Row>
                <div className={styles.textContent}>Casual Leave policy</div>
                <Row gutter={[90, 0]}>
                  <Col xs={24} sm={24} md={24} lg={24} xl={11}>
                    <Form.Item
                      label="Assign to"
                      rules={[{ required: true, message: 'Please select' }]}
                    >
                      <Select className={styles.select} placeholder="All employees" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={24} md={24} lg={24} xl={11}>
                    <Form.Item
                      label="Excluding"
                      rules={[{ required: true, message: 'Please select' }]}
                    >
                      <Select className={styles.select} placeholder="None" />
                    </Form.Item>
                  </Col>
                </Row>
                <div className={styles.textContent}>Sick Leave policy</div>
                <Row gutter={[90, 0]}>
                  <Col xs={24} sm={24} md={24} lg={24} xl={11}>
                    <Form.Item
                      label="Assign to"
                      rules={[{ required: true, message: 'Please select' }]}
                    >
                      <Select className={styles.select} placeholder="All employees" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={24} md={24} lg={24} xl={11}>
                    <Form.Item
                      label="Excluding"
                      rules={[{ required: true, message: 'Please select' }]}
                    >
                      <Select className={styles.select} placeholder="None" />
                    </Form.Item>
                  </Col>
                </Row>
              </div>
              <div className={styles.straightLine} />
              <div className={styles.footer}>
                <Button onClick={this.handleClick}>Finish</Button>
              </div>
            </Form>
            {/* <ModalNotice
            modalContent="Syncing all data and setting up your Timeoff app."
            visible={visible}
            handleCancel={this.handleCandelSchedule}
          /> */}
          </div>
        </div>
      </div>
    );
  }
}

export default AssignPolicies;
