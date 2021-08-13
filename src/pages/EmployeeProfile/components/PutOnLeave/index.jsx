import React, { Component } from 'react';
import { Form, DatePicker, Row, Col, Input, Select, Divider, Button, Tag, Modal } from 'antd';
import { SearchOutlined, CloseCircleOutlined } from '@ant-design/icons';
import moment from 'moment';
import { connect } from 'umi';

import warning from '@/assets/warning_filled.svg';
import modalSuccess from '@/assets/modal_img_1.png';
import path from '@/assets/path.svg';

import styles from './index.less';

const { TextArea } = Input;
const { Option } = Select;

@connect(({ employeeProfile: { tempData: { generalData = {} } = {} } = {} }) => ({
  generalData,
}))
class PutOnLeave extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      durationFrom: '',
      durationTo: '',
    };
  }

  handleCancelAction = () => {
    const { cancel = () => {} } = this.props;
    cancel();
  };

  openFeedback = () => {
    this.setState({
      visible: true,
    });
  };

  handleCandelModal = () => {
    this.setState({
      visible: false,
    });
  };

  handleOkay = () => {
    const { cancel = () => {} } = this.props;
    this.handleCandelModal();
    cancel();
  };

  onFinish = (value) => {
    console.log(value);
    this.openFeedback();
  };

  tagRender = (props) => {
    const { label, onClose } = props;

    return (
      <Tag icon={<CloseCircleOutlined className={styles.iconClose} onClick={onClose} />}>
        {label}
      </Tag>
    );
  };

  disabledFromDate = (current) => {
    const { durationTo } = this.state;
    return (
      (current && current > moment(durationTo)) ||
      moment(current).day() === 0 ||
      moment(current).day() === 6
    );
  };

  disabledToDate = (current) => {
    const { durationFrom } = this.state;
    return (
      (current && current < moment(durationFrom)) ||
      moment(current).day() === 0 ||
      moment(current).day() === 6
    );
  };

  dateOnChange = (value, name) => {
    if (name === 'fromDate') {
      if (value === null) {
        this.setState({
          durationFrom: '',
        });
      } else {
        this.setState({
          durationFrom: value,
        });
      }
    } else if (value === null) {
      this.setState({
        durationTo: '',
      });
    } else {
      this.setState({
        durationTo: value,
      });
    }
  };

  render() {
    const { visible } = this.state;
    const { generalData: { firstName = '', lastName = '' } = {} } = this.props;
    const fullName = `${firstName} ${lastName}`;

    return (
      <div className={styles.putOnLeaveRoot}>
        <div className={styles.putOnLeaveRoot__titleSection}>
          <div className={styles.spaceTitle}>
            <p className={styles.putOnLeaveRoot__titleSection__text}>Put on Leave (LWP)</p>
            <div onClick={this.handleCancelAction} className={styles.cancelButton}>
              <img alt="" src={path} />
              <span className={styles.editBtn}>Cancel & Return</span>
            </div>
          </div>
          <div className={styles.viewBottom}>
            <div className={styles.viewBottom__layout}>
              <div className={styles.notification}>
                <img alt="warning" src={warning} />
                <div className={styles.notification__text}>
                  This will put {fullName} on leave for the days selected without pay, a
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
                          disabledDate={this.disabledFromDate}
                          className={styles}
                          placeholder="DD-MM-YYYY"
                          picker="date"
                          format="DD.MM.YYYY"
                          onChange={(value) => {
                            this.dateOnChange(value, 'fromDate');
                          }}
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
                          disabledDate={this.disabledToDate}
                          className={styles}
                          placeholder="DD-MM-YYYY"
                          picker="date"
                          format="DD.MM.YYYY"
                          onChange={(value) => {
                            this.dateOnChange(value, 'toDate');
                          }}
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
                <div className={styles.btnGroup}>
                  <Button htmlType="submit" className={styles.btnSubmit}>
                    Submit
                  </Button>
                </div>
              </Form>
            </div>
          </div>
        </div>
        <Modal
          visible={visible}
          title={false}
          onCancel={this.handleCandelModal}
          destroyOnClose={this.handleCandelModal}
          footer={false}
          className={styles.modalPopup}
        >
          <img alt="success" src={modalSuccess} />
          <div className={styles.modalText}>Your request has been registered successfully!</div>
          <Button onClick={this.handleOkay} className={styles.btnModal}>
            Okay
          </Button>
        </Modal>
      </div>
    );
  }
}

export default PutOnLeave;
