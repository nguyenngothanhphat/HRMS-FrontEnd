import React, { Component } from 'react';
import { Col, Form, Row, Select } from 'antd';
import { DownOutlined } from '@ant-design/icons';

import AddIcon from '@/assets/add-symbols.svg';
import TrashIcon from '@/assets/trash.svg';
import iconPDF from '@/assets/pdf-2.svg';

import styles from './index.less';

const { Option } = Select;

class HealthWellbeing extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visionPlanDoc1: 'visionPlanDoc1',
      annualCost: '10,000',
      employeeContribution: '5,000',
      employerContribution: '5,000',
    };
  }

  onChangeSelect = (value) => {
    this.setState({ visionPlanDoc1: value });
  };

  onFinish = (value) => {
    console.log(value);
  };

  vision = () => {
    const { visionPlanDoc1, annualCost, employeeContribution, employerContribution } = this.state;
    return (
      <div className={styles.vision}>
        <div className={styles.vision__title}>Vision</div>
        <div className={styles.vision__subTitle}>
          <div className={styles.vision__subTitle__left}>Deduction Will be done on 20/04/2020</div>
          <div className={styles.vision__subTitle__right}>Valid Till 26/04/2020</div>
        </div>
        <div className={styles.planDocuments}>
          <div className={styles.planDocuments__first}>
            <div className={styles.labelDocs}>Choice Plan Document (01)</div>
            <Row gutter={[24, 0]}>
              <Col span={15}>
                <Form.Item name="visionPlanDoc1">
                  <Select
                    showSearch
                    showArrow
                    // allowClear
                    placeholder="Choice Plan Document (01)"
                    onChange={this.onChangeSelect}
                    suffixIcon={
                      visionPlanDoc1 ? (
                        <img
                          style={{ marginTop: '-6px', marginLeft: '-12px' }}
                          alt="pdf-img"
                          src={iconPDF}
                        />
                      ) : (
                        <DownOutlined />
                      )
                    }
                    filterOption={(input, option) => {
                      return (
                        option.props.children[1].toLowerCase().indexOf(input.toLowerCase()) >= 0
                      );
                    }}
                  >
                    <Option value="visionPlanDoc1">
                      [ 2020 ] Open Access Plus - Choice Plan.pdf
                    </Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={8} />
              <Col span={1} style={{ paddingLeft: 0 }}>
                <img alt="delete" src={TrashIcon} />
              </Col>
            </Row>
          </div>
          <div className={styles.planDocuments__second}>
            <Row justify="space-between">
              <Col span={8}>
                <div className={styles.label}>Annual Cost</div>
                <Form.Item name="annualCost">
                  <Select
                    showSearch
                    showArrow
                    className={styles.inputNumber}
                    // allowClear
                    placeholder="Choose annual cost"
                    // onChange={this.onChangeSelect}
                    suffixIcon={annualCost ? <span>₹</span> : <DownOutlined />}
                    filterOption={(input, option) => {
                      return (
                        option.props.children[1].toLowerCase().indexOf(input.toLowerCase()) >= 0
                      );
                    }}
                  >
                    {['10,000', '15,000', '20,000'].map((item) => (
                      <Option value={item}>{item}</Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={8}>
                <div className={styles.label}>Employee Contribution</div>
                <Form.Item name="employeeContribution">
                  <Select
                    showSearch
                    showArrow
                    className={styles.inputNumber}
                    // allowClear
                    placeholder="Choose employee contribution"
                    // onChange={this.onChangeSelect}
                    suffixIcon={employeeContribution ? <span>₹</span> : <DownOutlined />}
                    filterOption={(input, option) => {
                      return (
                        option.props.children[1].toLowerCase().indexOf(input.toLowerCase()) >= 0
                      );
                    }}
                  >
                    {['5,000', '10,000', '15,000'].map((item) => (
                      <Option value={item}>{item}</Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={8}>
                <div className={styles.label}>Employer&lsquo;s Contribution</div>
                <Form.Item name="employerContribution">
                  <Select
                    showSearch
                    showArrow
                    className={styles.inputNumber}
                    // allowClear
                    placeholder="Choose employer's contribution"
                    // onChange={this.onChangeSelect}
                    suffixIcon={employerContribution ? <span>₹</span> : <DownOutlined />}
                    filterOption={(input, option) => {
                      return (
                        option.props.children[1].toLowerCase().indexOf(input.toLowerCase()) >= 0
                      );
                    }}
                  >
                    {['5,000', '10,000', '15,000'].map((item) => (
                      <Option value={item}>{item}</Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <div className={styles.addDocs}>
              <img alt="add" src={AddIcon} />
              <div className={styles.addDocs__text}>Add Documents</div>
            </div>
          </div>
        </div>

        {/* <Form.Item>

        </Form.Item> */}
      </div>
    );
  };

  render() {
    const { visionPlanDoc1, annualCost, employeeContribution, employerContribution } = this.state;
    return (
      <div className={styles.healthWellbeing}>
        <Form
          onFinish={this.onFinish}
          initialValues={{ visionPlanDoc1, annualCost, employeeContribution, employerContribution }}
        >
          <div className={styles.formVision}>{this.vision()}</div>
          {/* {this.dental()} */}
        </Form>
      </div>
    );
  }
}

export default HealthWellbeing;
