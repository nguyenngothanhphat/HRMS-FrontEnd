import React, { Component } from 'react';
import { Form, Row, Col, Select, Divider, Button, Modal, Tag } from 'antd';
import { CloseCircleOutlined, SearchOutlined } from '@ant-design/icons';
import path from '@/assets/path.svg';
import modalSuccess from '@/assets/modal_img_1.png';

import styles from './index.less';

const { Option } = Select;
class RequestDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };
  }

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

  render() {
    const { visible } = this.state;

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
                        suffixIcon={<SearchOutlined />}
                        tagRender={this.tagRender}
                        filterOption={(input, option) =>
                          option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                      >
                        <Option value="manager">Manager</Option>
                        <Option value="manager1">Manager1</Option>
                        <Option value="manager2">Manager2</Option>
                        <Option value="manager3">Manager2</Option>
                        <Option value="manager4">Manager2</Option>
                        <Option value="manager5">Manager2</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
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
