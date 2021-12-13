import React, { Component } from 'react';
import {
  Form,
  DatePicker,
  Row,
  Col,
  Input,
  Select,
  Divider,
  Button,
  Radio,
  Modal,
  Tag,
} from 'antd';
import { CloseCircleOutlined, SearchOutlined } from '@ant-design/icons';
import path from '@/assets/path.svg';
import modalSuccess from '@/assets/modal_img_1.png';

import styles from './index.less';

const { TextArea } = Input;
const { Option } = Select;

class RaiseTermination extends Component {
  constructor(props) {
    super(props);
    this.state = {
      valueRadio: null,
      valueRadio1: null,
      valueRadio2: null,
      valueRadio3: null,
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

  handleOkay = () => {
    const { cancel = () => {} } = this.props;
    this.handleCandelModal();
    cancel();
  };

  onChangeRadio = (e) => {
    const { value } = e.target;
    this.setState({ valueRadio: value });
    if (value === 1) {
      this.setState({
        valueRadio1: value,
        valueRadio2: null,
        valueRadio3: null,
      });
    } else if (value === 2) {
      this.setState({
        valueRadio2: value,
        valueRadio1: null,
        valueRadio3: null,
      });
    } else {
      this.setState({
        valueRadio3: value,
        valueRadio1: null,
        valueRadio2: null,
      });
    }
  };

  onValueChange = (data) => {
    console.log(data);
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

  render() {
    const { valueRadio1, valueRadio2, valueRadio3, valueRadio, visible } = this.state;
    const arr = [
      {
        name: 'happenChanged',
        value: 1,
        optionName: 'A change that already happened.',
        isDisplayField: valueRadio1,
      },
      {
        name: 'immediateChanged',
        value: 2,
        optionName: 'An immediate change.',
        isDisplayField: valueRadio2,
      },
      {
        name: 'scheduledChanged',
        value: 3,
        optionName: 'Scheduled change',
        isDisplayField: valueRadio3,
      },
    ];
    return (
      <div className={styles.raiseTermination}>
        <div className={styles.raiseTermination__titleSection}>
          <div className={styles.spaceTitle}>
            <p className={styles.raiseTermination__titleSection__text}>Raise Termination</p>
            <div onClick={this.handleCancel} className={styles.cancelButton}>
              <img alt="" src={path} />
              <span className={styles.editBtn}>Cancel & Return</span>
            </div>
          </div>
          <div className={styles.viewBottom}>
            <div className={styles.viewBottom__layout}>
              <div className={styles.viewBottom__title}>
                When do you wish the changes to take effect?
              </div>
            </div>
            <div className={styles.raiseTerminationForm}>
              <Form
                onValuesChange={this.onValueChange}
                onFinish={this.onFinish}
                className={styles.raiseTerminationForm__form}
              >
                <div className={styles.viewBottom__layout}>
                  <Row gutter={[24, 0]}>
                    <Col className={styles.formItemRadio} xs={24} sm={24} md={24} lg={24} xl={24}>
                      <Form.Item
                        name="radio"
                        rules={[
                          {
                            required: true,
                            message: 'Please select Leave from date',
                          },
                        ]}
                      >
                        <Radio.Group onChange={this.onChangeRadio} value={valueRadio}>
                          {arr.map((item) => (
                            <Row className={styles.radioRow} gutter={[24, 0]}>
                              <Col
                                className={styles.radioRow__col}
                                xs={24}
                                sm={24}
                                md={7}
                                lg={7}
                                xl={7}
                              >
                                <Radio value={item.value}>{item.optionName}</Radio>
                              </Col>
                              {item.isDisplayField ? (
                                <Col
                                  className={styles.radioRow__col}
                                  xs={24}
                                  sm={24}
                                  md={17}
                                  lg={17}
                                  xl={17}
                                >
                                  <Form.Item
                                    name="dateChanged"
                                    rules={[
                                      {
                                        required: true,
                                        message: 'Please select date changed !',
                                      },
                                    ]}
                                  >
                                    <DatePicker
                                      className={styles}
                                      placeholder="DD-MM-YYYY"
                                      picker="date"
                                      format="DD.MM.YYYY"
                                    />
                                  </Form.Item>
                                </Col>
                              ) : null}
                            </Row>
                          ))}
                        </Radio.Group>
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row className={styles.raiseTerminationForm__form__row} gutter={[24, 0]}>
                    <Col
                      className={styles.raiseTerminationForm__form__col}
                      xs={24}
                      sm={24}
                      md={7}
                      lg={7}
                      xl={7}
                    >
                      <div className={styles.terminationText}>Reason</div>
                    </Col>
                    <Col
                      className={styles.raiseTerminationForm__form__col}
                      xs={24}
                      sm={24}
                      md={17}
                      lg={17}
                      xl={17}
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
                  <Row className={styles.raiseTerminationForm__form__row} gutter={[24, 0]}>
                    <Col
                      className={styles.raiseTerminationForm__form__col}
                      xs={24}
                      sm={24}
                      md={7}
                      lg={7}
                      xl={7}
                    >
                      <div className={styles.terminationText}>Set Approval Chain</div>
                    </Col>
                    <Col
                      className={styles.raiseTerminationForm__form__col}
                      xs={24}
                      sm={24}
                      md={17}
                      lg={17}
                      xl={17}
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

export default RaiseTermination;
