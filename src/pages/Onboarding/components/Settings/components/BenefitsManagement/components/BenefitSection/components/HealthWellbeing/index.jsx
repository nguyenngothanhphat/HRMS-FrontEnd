import React, { Component } from 'react';
import { Col, Divider, Form, Input, Row, Select, Spin } from 'antd';
import { connect } from 'umi';

import AddIcon from '@/assets/add-symbols.svg';
import TrashIcon from '@/assets/trash.svg';
import iconPDF from '@/assets/pdf-2.svg';

import ViewDocumentModal from '@/components/ViewDocumentModal';
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
      openViewDoc: false,
      openModal: false,
      idBenefit: '',
      idCountry: '',
      urlDocument: '',
      displayDocumentName: '',
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

  closeModal = (key) => {
    if (key === 1) {
      this.setState({ openViewDoc: false });
    } else {
      this.setState({ openModal: false });
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

  openViewDoc = (document) => {
    const { attachmentName = '', attachmentUrl = '' } = document;
    this.setState({
      openViewDoc: true,
      urlDocument: attachmentUrl,
      displayDocumentName: attachmentName,
    });
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
        <div className={styles.documents}>
          <div className={styles.labelDocs}>{name}</div>
          {documents.map((item) => (
            <>
              <div className={styles.documents__first}>
                <Row gutter={[24, 0]}>
                  <Col span={15}>
                    <div className={styles.documentName} onClick={() => this.openViewDoc(item)}>
                      <div className={styles.documentName__text}>{item?.attachmentName}</div>
                      <img alt="pdf-img" src={iconPDF} />
                    </div>
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
              </div>
              <div className={styles.documents__second}>
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

    const { openModal, idBenefit, idCountry, displayDocumentName, urlDocument, openViewDoc } =
      this.state;

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
        <ViewDocumentModal
          visible={openViewDoc}
          fileName={displayDocumentName}
          url={urlDocument}
          onClose={() => this.closeModal(1)}
        />
      </div>
    );
  }
}

export default HealthWellbeing;
