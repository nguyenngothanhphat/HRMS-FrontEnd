import React, { Component } from 'react';
import { Col, Divider, Form, Row, Select, Spin } from 'antd';
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
  loadingAddDocument: loading.effects['onboardingSettings/addDocument'],
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
    const { documents = [] } = benefit;
    console.log(documents);
    return (
      <div className={styles.planDocuments}>
        <div className={styles.planDocuments__first}>
          <div className={styles.labelDocs}>Choice Plan Document (01)</div>
          {documents.map((item) => (
            <Row gutter={[24, 0]}>
              <Col span={15}>
                <Form.Item>
                  <Select
                    showSearch
                    showArrow
                    dropdownRender={() => null}
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
          <div className={styles.addDocs} onClick={() => this.handleOpenModal(benefit)}>
            <img alt="add" src={AddIcon} />
            <div className={styles.addDocs__text}>Add Documents</div>
          </div>
        </div>
        {index === 0 ? <Divider /> : null}
      </>
    );
  };

  render() {
    const {
      listBenefit = [],
      loadingAddBenefit = false,
      loadingDeleteBenefit = false,
      loadingAddDocument = false,
    } = this.props;

    const { openModal, idBenefit, idCountry } = this.state;

    if (listBenefit.length === 0) return <div style={{ padding: '30px' }} />;
    return (
      <div className={styles.healthWellbeing}>
        {loadingAddBenefit || loadingDeleteBenefit || loadingAddDocument ? (
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
