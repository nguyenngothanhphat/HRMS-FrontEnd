import React, { Component } from 'react';
import { Form, DatePicker, Row, Col, Input, Select, Divider, Button, Radio } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import path from '@/assets/path.svg';

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
    };
  }

  handleCancel = () => {
    const { cancel = () => {} } = this.props;
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

  render() {
    const { valueRadio1, valueRadio2, valueRadio3, valueRadio } = this.state;
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
                                md={12}
                                lg={12}
                                xl={12}
                              >
                                <Radio value={item.value}>{item.optionName}</Radio>
                              </Col>
                              {item.isDisplayField ? (
                                <Col
                                  className={styles.radioRow__col}
                                  xs={24}
                                  sm={24}
                                  md={12}
                                  lg={12}
                                  xl={12}
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
                      md={6}
                      lg={6}
                      xl={6}
                    >
                      <div className={styles.terminationText}>Reason</div>
                    </Col>
                    <Col
                      className={styles.raiseTerminationForm__form__col}
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
                  <Row className={styles.raiseTerminationForm__form__row} gutter={[24, 0]}>
                    <Col
                      className={styles.raiseTerminationForm__form__col}
                      xs={24}
                      sm={24}
                      md={6}
                      lg={6}
                      xl={6}
                    >
                      <div className={styles.terminationText}>Set Approval Chain</div>
                    </Col>
                    <Col
                      className={styles.raiseTerminationForm__form__col}
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
      </div>
    );
  }
}

export default RaiseTermination;
