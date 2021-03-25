import React, { Component } from 'react';
import { Row, Col, Form, Input, Button } from 'antd';

import styles from './index.less';

class EditPrimary extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handleChange = (value) => {
    console.log('value: ', value)
  }

  handleChangeField = (value) => {
    console.log(value)
  }

  onFinish = (value) => {
    console.log(value)
  }

  render() {
    return (
      <div className={styles.primaryEdit}>
        <Form 
          className={styles.formAdminstrator}
          onValuesChange={this.handleChange}
          onFinish={this.onFinish}
        >
          <Row gutter={[0, 16]}>
            <Col span={4}>
              <div className={styles.formAdminstrator__left}>
                <div>Employee Name</div>
              </div>
            </Col>
            <Col span={18}>
              <Form.Item name="employeeName" className={styles.formAdminstrator__right}>
                <Input 
                  className={styles.inputForm}
                  onChange={(e) => this.handleChangeField(e.target.value)}
                />
              </Form.Item>
            </Col>

            <Col span={4}>
              <div className={styles.formAdminstrator__left}>
                <div>Email</div>
              </div>
            </Col>
            <Col span={18}>
              <Form.Item name="email" className={styles.formAdminstrator__right}>
                <Input 
                  className={styles.inputForm}
                  onChange={(e) => this.handleChangeField(e.target.value)}
                />
              </Form.Item>
            </Col>

            <Col span={4}>
              <div className={styles.formAdminstrator__left}>
                <div>Position</div>
              </div>
            </Col>
            <Col span={18}>
              <Form.Item name="position" className={styles.formAdminstrator__right}>
                <Input 
                  className={styles.inputForm}
                  onChange={(e) => this.handleChangeField(e.target.value)}
                />
              </Form.Item>
            </Col>
          </Row>
          <Button htmlType='submit'>
            Save
          </Button>
        </Form>
      </div>
    );
  }
}

export default EditPrimary;
