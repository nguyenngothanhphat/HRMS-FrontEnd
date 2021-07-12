import React, { Component } from 'react';
import { Form, DatePicker, Row, Col, Input, Select, Divider, Button, Tag } from 'antd';
import { SearchOutlined, CloseCircleOutlined } from '@ant-design/icons';
import warning from '@/assets/warning_filled.svg';
import path from '@/assets/path.svg';

import styles from './index.less';

const { TextArea } = Input;
const { Option } = Select;

class PutOnLeave extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handleCancel = () => {
    const { cancel = () => {} } = this.props;
    cancel();
  };

  onFinish = (value) => {
    console.log(value);
  };

  tagRender = (props) => {
    const { label, onClose } = props;

    return (
      <Tag icon={<CloseCircleOutlined className={styles.iconClose} onClick={onClose} />}>
        {label}
      </Tag>
    );
  };

  render() {
    return (
      <div className={styles.putOnLeaveRoot}>
        <div className={styles.putOnLeaveRoot__titleSection}>
          <div className={styles.spaceTitle}>
            <p className={styles.putOnLeaveRoot__titleSection__text}>Put on Leave (LWP)</p>
            <div onClick={this.handleCancel} className={styles.cancelButton}>
              <img alt="" src={path} />
              <span className={styles.editBtn}>Cancel & Return</span>
            </div>
          </div>
          <div className={styles.viewBottom}>
            <div className={styles.viewBottom__layout}>
              <div className={styles.notification}>
                <img alt="warning" src={warning} />
                <div className={styles.notification__text}>
                  This will put Aditya Venkatesh on leave for the days selected without pay, a
                  Notification for the update will be sent to the employee as well.
                </div>
              </div>
            </div>
            <div className={styles.lwpForm}>
              <Form onFinish={this.onFinish} className={styles.lwpForm__form}>
                <div className={styles.viewBottom__layout}>
                  <Row className={styles.lwpForm__form__row} gutter={[24, 0]}>
                    <Col className={styles.lwpForm__form__col} xs={24} sm={24} md={6} lg={6} xl={6}>
                      <div className={styles.lwpText}>Leave From</div>
                    </Col>
                    <Col
                      className={styles.lwpForm__form__col}
                      xs={24}
                      sm={24}
                      md={18}
                      lg={18}
                      xl={18}
                    >
                      <Form.Item
                        name="leaveFrom"
                        rules={[
                          {
                            required: true,
                            message: 'Please select Leave from date',
                          },
                        ]}
                      >
                        <DatePicker
                          className={styles}
                          placeholder="DD-MM-YYYY"
                          picker="date"
                          format="DD.MM.YYYY"
                          // onChange={(value) => _handleSelect(value, candidateField[1].title)}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row className={styles.lwpForm__form__row} gutter={[24, 0]}>
                    <Col className={styles.lwpForm__form__col} xs={24} sm={24} md={6} lg={6} xl={6}>
                      <div className={styles.lwpText}>Leave To</div>
                    </Col>
                    <Col
                      className={styles.lwpForm__form__col}
                      xs={24}
                      sm={24}
                      md={18}
                      lg={18}
                      xl={18}
                    >
                      <Form.Item
                        name="leaveTo"
                        rules={[
                          {
                            required: true,
                            message: 'Please select Leave to date',
                          },
                        ]}
                      >
                        <DatePicker
                          className={styles}
                          placeholder="DD-MM-YYYY"
                          picker="date"
                          format="DD.MM.YYYY"
                          // onChange={(value) => _handleSelect(value, candidateField[1].title)}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row className={styles.lwpForm__form__row} gutter={[24, 0]}>
                    <Col className={styles.lwpForm__form__col} xs={24} sm={24} md={6} lg={6} xl={6}>
                      <div className={styles.lwpText}>Reason</div>
                    </Col>
                    <Col
                      className={styles.lwpForm__form__col}
                      xs={24}
                      sm={24}
                      md={18}
                      lg={18}
                      xl={18}
                    >
                      <Form.Item
                        name="reason"
                        rules={[
                          {
                            required: true,
                            message: 'Please type the text box!',
                          },
                        ]}
                      >
                        <TextArea
                          className={styles.fieldModal}
                          placeholder="Type here..."
                          autoSize={{ minRows: 3, maxRows: 6 }}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row className={styles.lwpForm__form__row} gutter={[24, 0]}>
                    <Col className={styles.lwpForm__form__col} xs={24} sm={24} md={6} lg={6} xl={6}>
                      <div className={styles.lwpText}>Set Approval Chain</div>
                    </Col>
                    <Col
                      className={styles.lwpForm__form__col}
                      xs={24}
                      sm={24}
                      md={18}
                      lg={18}
                      xl={18}
                    >
                      <Form.Item
                        name="approvalChain"
                        rules={[
                          {
                            required: true,
                            message: 'Please type the text field!',
                          },
                        ]}
                        extra="Type Names of Manager, or any higher authority."
                      >
                        <Select
                          mode="multiple"
                          placeholder="Select your manager"
                          showArrow
                          showSearch
                          allowClear
                          suffixIcon={<SearchOutlined />}
                          tagRender={this.tagRender}
                          filterOption={(input, option) =>
                            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                          }
                        >
                          <Option value="manager">Manager</Option>
                          <Option value="manager1">Manager1</Option>
                          <Option value="manager2">Manager2</Option>
                        </Select>
                      </Form.Item>
                    </Col>
                  </Row>
                </div>
                <Divider />
                <div className={styles.btnSection}>
                  <Button htmlType="submit" className={styles.btnSubmit}>
                    Submit
                  </Button>
                </div>
              </Form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default PutOnLeave;
