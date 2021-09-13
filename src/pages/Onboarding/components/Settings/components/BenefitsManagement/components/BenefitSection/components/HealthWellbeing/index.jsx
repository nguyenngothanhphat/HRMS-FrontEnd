import React, { Component } from 'react';
import { Col, Divider, Form, Input, Row, Select, Spin } from 'antd';
import { connect } from 'umi';

import AddIcon from '@/assets/add-symbols.svg';
import TrashIcon from '@/assets/trash.svg';
import iconPDF from '@/assets/pdf-2.svg';

import styles from './index.less';
import ModalAddDocument from '../ModalAddDocument';

// const { Option } = Select;

@connect(({ onboardingSettings: { listBenefit = [] } = {}, loading }) => ({
  listBenefit,
  loadingFetchCountry: loading.effects['country/fetchListCountry'],
  loadingAddBenefit: loading.effects['onboardingSettings/addBenefit'],
  loadingDeleteBenefit: loading.effects['onboardingSettings/deleteBenefit'],
  loadingFetchListBenefit: loading.effects['onboardingSettings/fetchListBenefit'],
}))
class HealthWellbeing extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openModal: false,
      idBenefit: '',
      idCountry: '',
    };

    this.inputRef = React.createRef();
  }

  onFinish = (value) => {
    console.log(value);
  };

  handleOpenModal = (benefit) => {
    const { _id: benefitId = '', country = '' } = benefit;
    this.setState({ openModal: true, idBenefit: benefitId, idCountry: country });
  };

  closeModal = () => {
    this.setState({ openModal: false });
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

  onDownload = () => {
    console.log('ok');
  };

  planDocuments = (benefit) => {
    const { documents = [], country = '', name = '' } = benefit;

    const arrCost = [
      { id: 1, name: 'annualCost', label: 'Annual Cost' },
      { id: 2, name: 'employeeContribution', label: 'Employee Contribution' },
      { id: 3, name: 'employerContribution', label: "Employer's Contribution" },
    ];

    const getCurrency = () => {
      if (country === 'VN') return 'VND';
      if (country === 'US') return '$';
      return '₹';
    };

    return (
      <div className={styles.planDocuments}>
        <div className={styles.planDocuments__first}>
          <div className={styles.labelDocs}>{name}</div>
          {documents.map((item) => (
            <>
              <Row gutter={[24, 0]}>
                <Col span={15}>
                  <Form.Item>
                    <Select
                      disabled
                      showSearch
                      showArrow
                      ref={this.inputRef}
                      placeholder="Choice Plan Document"
                      defaultValue={
                        <span onClick={this.onDownload} style={{ cursor: 'pointer' }}>
                          {item?.attachmentName}
                        </span>
                      }
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
                  onClick={() => this.handleRemovePlanDocs(benefit, item?._id || '')}
                >
                  <img style={{ cursor: 'pointer' }} alt="delete" src={TrashIcon} />
                </Col>
              </Row>
              <div className={styles.planDocuments__second}>
                <Row justify="space-between">
                  {arrCost.map((field) => (
                    <Col span={8} key={field.id}>
                      <div className={styles.label}>{field.label}</div>
                      <Form.Item name={field.name}>
                        <Input
                          disabled
                          className={styles.inputNumber}
                          suffix={<span>{getCurrency()}</span>}
                        />
                      </Form.Item>
                    </Col>
                  ))}
                </Row>
              </div>
            </>
          ))}
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
          <div className={styles.benefit__bottom}>
            <div className={styles.addDocs} onClick={() => this.handleOpenModal(benefit)}>
              <img alt="add" src={AddIcon} />
              <div className={styles.addDocs__text}>Add Documents</div>
            </div>
          </div>
        </div>
        <Divider />
      </>
    );
  };

  render() {
    const {
      listBenefit = [],
      loadingDeleteBenefit = false,
      loadingFetchListBenefit = false,
    } = this.props;

    const { openModal, idBenefit, idCountry } = this.state;

    if (listBenefit.length === 0) return <div style={{ padding: '30px' }} />;
    return (
      <div className={styles.healthWellbeing}>
        {loadingDeleteBenefit || loadingFetchListBenefit ? (
          <div className={styles.loadingSpin}>
            <Spin />
          </div>
        ) : (
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
        )}
        <ModalAddDocument
          idBenefit={idBenefit}
          idCountry={idCountry}
          visible={openModal}
          handleCandelModal={this.closeModal}
        />
      </div>
    );
  }
}

export default HealthWellbeing;
