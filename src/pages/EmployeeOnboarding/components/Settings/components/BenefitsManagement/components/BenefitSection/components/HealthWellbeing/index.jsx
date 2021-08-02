import React, { Component } from 'react';
import { Col, Divider, Form, Row, Select } from 'antd';
import { connect } from 'umi';

import AddIcon from '@/assets/add-symbols.svg';
import TrashIcon from '@/assets/trash.svg';
import iconPDF from '@/assets/pdf-2.svg';

import styles from './index.less';

// const { Option } = Select;

@connect(({ onboardingSettings: { listBenefit = [] } = {}, loading }) => ({
  listBenefit,
  loadingFetchCountry: loading.effects['country/fetchListCountry'],
}))
class HealthWellbeing extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  onFinish = (value) => {
    console.log(value);
  };

  handleAddPlanDocs = (benefitName) => {
    const { visionPlanDocs, dentalPlanDocs } = this.state;
    let arrTemp = [];

    if (benefitName === 'Vision') {
      arrTemp = [...visionPlanDocs];
      arrTemp.push(visionPlanDocs.length + 1);
      this.setState({ visionPlanDocs: arrTemp });
    } else {
      arrTemp = [...dentalPlanDocs];
      arrTemp.push(dentalPlanDocs.length + 1);
      this.setState({ dentalPlanDocs: arrTemp });
    }
  };

  handleRemovePlanDocs = (benefit, documentId) => {
    const { dispatch } = this.props;
    const { _id: benefitId = '', country = '' } = benefit;

    dispatch({
      type: 'onboardingSettings/deleteBenefit',
      payload: {
        payload: {
          benefitId,
          documentId,
        },
        country,
      },
    });
  };

  planDocuments = (benefit) => {
    const { documents = [] } = benefit;
    return (
      <div className={styles.planDocuments}>
        <div className={styles.planDocuments__first}>
          <div className={styles.labelDocs}>Choice Plan Document (01)</div>
          {documents.map((item, itemIndex) => (
            <Row gutter={[24, 0]}>
              <Col span={15}>
                <Form.Item name={`planDoc%${itemIndex}`}>
                  <Select
                    showSearch
                    showArrow
                    // allowClear
                    placeholder="Choice Plan Document"
                    // onChange={this.onChangeSelect}
                    defaultValue={item.attachmentName}
                    suffixIcon={
                      <img
                        style={{ marginTop: '-6px', marginLeft: '-12px' }}
                        alt="pdf-img"
                        src={iconPDF}
                      />
                    }
                    filterOption={(input, option) => {
                      return (
                        option.props.children[1].toLowerCase().indexOf(input.toLowerCase()) >= 0
                      );
                    }}
                  />
                </Form.Item>
              </Col>
              <Col span={8} />
              <Col
                span={1}
                style={{ paddingLeft: 0 }}
                onClick={() => this.handleRemovePlanDocs(benefit, item._id)}
              >
                <img style={{ cursor: 'pointer' }} alt="delete" src={TrashIcon} />
              </Col>
            </Row>
          ))}
        </div>
        <div className={styles.planDocuments__second}>
          <Row justify="space-between">
            <Col span={8}>
              <div className={styles.label}>Annual Cost</div>
              <Form.Item name="annualCost">
                <Select
                  disabled
                  showSearch
                  showArrow
                  className={styles.inputNumber}
                  placeholder="Choose annual cost"
                  suffixIcon={<span>₹</span>}
                  filterOption={(input, option) => {
                    return option.props.children[1].toLowerCase().indexOf(input.toLowerCase()) >= 0;
                  }}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <div className={styles.label}>Employee Contribution</div>
              <Form.Item name="employeeContribution">
                <Select
                  disabled
                  showSearch
                  showArrow
                  className={styles.inputNumber}
                  // allowClear
                  placeholder="Choose employee contribution"
                  // onChange={this.onChangeSelect}
                  suffixIcon={<span>₹</span>}
                  filterOption={(input, option) => {
                    return option.props.children[1].toLowerCase().indexOf(input.toLowerCase()) >= 0;
                  }}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <div className={styles.label}>Employer&lsquo;s Contribution</div>
              <Form.Item name="employerContribution">
                <Select
                  disabled
                  showSearch
                  showArrow
                  className={styles.inputNumber}
                  // allowClear
                  placeholder="Choose employer's contribution"
                  // onChange={this.onChangeSelect}
                  suffixIcon={<span>₹</span>}
                  filterOption={(input, option) => {
                    return option.props.children[1].toLowerCase().indexOf(input.toLowerCase()) >= 0;
                  }}
                />
              </Form.Item>
            </Col>
          </Row>
        </div>
      </div>
    );
  };

  formItem = (benefit, index) => {
    const { category: benefitCategoryName = '', deductionDate = '', validTill } = benefit;

    return (
      <>
        <div className={styles.benefit}>
          <div className={styles.benefit__title}>{benefitCategoryName}</div>
          <div className={styles.benefit__subTitle}>
            <div className={styles.benefit__subTitle__left}>
              {`Deduction Will be done on ${deductionDate}`}
            </div>
            <div className={styles.benefit__subTitle__right}>{`Valid Till ${validTill}`}</div>
          </div>
          {this.planDocuments(benefit, index)}
          <div className={styles.addDocs} onClick={() => this.handleAddPlanDocs(benefit)}>
            <img alt="add" src={AddIcon} />
            <div className={styles.addDocs__text}>Add Documents</div>
          </div>
        </div>
        {index === 0 ? <Divider /> : null}
      </>
    );
  };

  render() {
    const { listBenefit = [] } = this.props;

    if (listBenefit.length === 0) return <div style={{ padding: '30px' }} />;
    return (
      <div className={styles.healthWellbeing}>
        <div className={styles.formItem}>
          {listBenefit.map((benefit, index) => {
            const {
              annualCost = '',
              employeeContribution = '',
              employerContribution = '',
            } = benefit;
            return (
              <Form
                onFinish={this.onFinish}
                initialValues={{
                  annualCost,
                  employeeContribution,
                  employerContribution,
                }}
              >
                <div key={benefit}>{this.formItem(benefit, index)}</div>
              </Form>
            );
          })}
        </div>
      </div>
    );
  }
}

export default HealthWellbeing;
