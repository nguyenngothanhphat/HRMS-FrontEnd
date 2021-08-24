import React, { Component } from 'react';
import { Form, Row, Col, Select, Divider, Button, Modal, Tag } from 'antd';
import { CloseCircleOutlined, SearchOutlined } from '@ant-design/icons';
import path from '@/assets/path.svg';
import modalSuccess from '@/assets/modal_img_1.png';

import Checkbox from 'antd/lib/checkbox/Checkbox';
import styles from './index.less';

const { Option } = Select;
class RequestDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      reqType: '',
    };
  }

  componentDidMount = () => {
    this.scroppTopView();
  };

  scroppTopView = () => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
  };

  handleCancel = () => {
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

  tagRender = (props) => {
    const { label, onClose } = props;

    return (
      <Tag icon={<CloseCircleOutlined className={styles.iconClose} onClick={onClose} />}>
        {label}
      </Tag>
    );
  };

  onChangeSelect = (value) => {
    this.setState({ reqType: value });
  };

  render() {
    const { visible, reqType } = this.state;

    return (
      <div className={styles.requestDetail}>
        <div className={styles.requestDetail__titleSection}>
          <div className={styles.spaceTitle}>
            <p className={styles.requestDetail__titleSection__text}>Request Details</p>
            <div onClick={this.handleCancel} className={styles.cancelButton}>
              <img alt="" src={path} />
              <span className={styles.editBtn}>Cancel & Return</span>
            </div>
          </div>
          <div className={styles.viewBottom}>
            <Form onFinish={this.onFinish} className={styles.lwpForm__form}>
              <div className={styles.viewBottom__layout}>
                <Row className={styles.lwpForm__form__row} gutter={[24, 0]}>
                  <Col className={styles.lwpForm__form__col} xs={24} sm={24} md={6} lg={6} xl={6}>
                    <div className={styles.lwpText}>Request Type</div>
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
                      name="requestType"
                      rules={[
                        {
                          required: true,
                          message: 'Please select the type',
                        },
                      ]}
                    >
                      <Select
                        mode="multiple"
                        placeholder="Select the type"
                        showArrow
                        showSearch
                        allowClear
                        suffixIcon={reqType ? null : <SearchOutlined />}
                        onChange={this.onChangeSelect}
                        tagRender={this.tagRender}
                        filterOption={(input, option) =>
                          option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                      >
                        <Option value="1">Eligibility Documents</Option>
                        <Option value="2">Bank Details</Option>
                        <Option value="3">Adhaar ID Details</Option>
                        <Option value="4">Passport Information</Option>
                        <Option value="5">TDS Certificate</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
                {reqType ? (
                  <Row
                    style={{ marginTop: '24px' }}
                    className={styles.lwpForm__form__row}
                    gutter={[24, 0]}
                  >
                    <Col className={styles.lwpForm__form__col} xs={24} sm={24} md={6} lg={6} xl={6}>
                      <div className={styles.lwpText}>Additional Info</div>
                    </Col>
                    <Col
                      className={styles.lwpForm__form__col}
                      xs={24}
                      sm={24}
                      md={18}
                      lg={18}
                      xl={18}
                    >
                      <Form.Item name="additionalInfo">
                        <Checkbox>Request Proof of Eligibility</Checkbox>
                      </Form.Item>
                    </Col>
                  </Row>
                ) : null}
              </div>
              <Divider className={styles.divider} />
              <div className={styles.btnGroup}>
                <Button htmlType="submit" className={styles.btnSubmit}>
                  Submit
                </Button>
              </div>
            </Form>
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

export default RequestDetails;
