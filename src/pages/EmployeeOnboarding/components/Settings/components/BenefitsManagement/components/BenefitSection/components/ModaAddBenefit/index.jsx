import React, { Component } from 'react';
import { Button, Spin, Modal, Form, Select, DatePicker } from 'antd';
import { connect } from 'umi';

import CalendarIcon from '@/assets/calendar-v2.svg';

import styles from './index.less';

const { Option } = Select;

@connect(({ onboardingSettings: { listBenefitDefault = [] } = {}, loading }) => ({
  listBenefitDefault,
  loadingFetchListBenefitDefault: loading.effects['onboardingSettings/fetchListBenefitDefault'],
}))
class ModalAddBenefit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listBenefitCategory: [],
    };
  }

  destroyOnClose = () => {
    const { handleCandelModal = () => {} } = this.props;
    handleCandelModal();
  };

  onChangeBenefitType = (value) => {
    const { listBenefitDefault = [] } = this.props;

    let getListBenefit = listBenefitDefault.map((item) => {
      if (item.benefitType === value) {
        return item.benefitCategory;
      }
      return null;
    });

    getListBenefit = getListBenefit.filter((item) => item !== null);

    if (getListBenefit) {
      this.setState({ listBenefitCategory: getListBenefit[0] });
    }
  };

  getInitValueByActiveTab = () => {
    const { activeKeyTab, listBenefitDefault = [] } = this.props;
    const key = +activeKeyTab - 1;
    let defaultValue = null;

    listBenefitDefault.forEach((item, index) => {
      if (key === index) defaultValue = item.benefitType;
    });

    return defaultValue;
  };

  render() {
    const {
      visible = false,
      loadingFetchListBenefitDefault = false,
      listBenefitDefault = [],
    } = this.props;

    const { listBenefitCategory } = this.state;

    return (
      <Modal
        visible={visible}
        className={styles.addBenefitModal}
        title={false}
        onCancel={this.destroyOnClose}
        destroyOnClose={this.destroyOnClose}
        footer={false}
      >
        <div className={styles.addBenefit}>
          <div className={styles.addBenefit__header}>
            <div className={styles.addBenefit__header__title}>Add a benefit</div>
          </div>
          {loadingFetchListBenefitDefault ? (
            <div className={styles.loadingModal}>
              <Spin />
            </div>
          ) : (
            <Form initialValues={{ type: this.getInitValueByActiveTab() }}>
              <div className={styles.addBenefit__body}>
                <div className={styles.addBenefit__body_label}>Benefit Type</div>
                <div className={styles.addBenefit__body_formItem}>
                  <Form.Item name="type">
                    <Select
                      showSearch
                      allowClear
                      suffixIcon={null}
                      placeholder="Select benefit type"
                      onChange={this.onChangeBenefitType}
                      filterOption={(input, option) => {
                        return (
                          option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        );
                      }}
                    >
                      {listBenefitDefault.map((item) => (
                        <Option key={item.benefitType} value={item.benefitType}>
                          {item.benefitType}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </div>
                <div className={styles.addBenefit__body_label}>Benefit Category</div>
                <div className={styles.addBenefit__body_formItem}>
                  <Form.Item name="category">
                    <Select
                      showSearch
                      allowClear
                      suffixIcon={null}
                      placeholder="Select benefit category"
                      // onChange={this.onChangeSelect}
                      filterOption={(input, option) => {
                        return (
                          option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        );
                      }}
                    >
                      {listBenefitCategory.map((item) => (
                        <Option key={item} value={item}>
                          {item}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </div>
                <div className={styles.addBenefit__body_label}>Name of the Benefit</div>
                <div className={styles.addBenefit__body_formItem}>
                  <Form.Item name="benefitName">
                    <Select
                      showSearch
                      allowClear
                      suffixIcon={null}
                      placeholder="Select name of the Benefit"
                      // onChange={this.onChangeSelect}
                      filterOption={(input, option) => {
                        return (
                          option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        );
                      }}
                    >
                      <Option value="vision">Vision</Option>
                      <Option value="dental">Dental</Option>
                    </Select>
                  </Form.Item>
                </div>
                <div className={styles.addBenefit__body_label}>Deduction Date</div>
                <div className={styles.addBenefit__body_formItem}>
                  <Form.Item name="deductionDate">
                    <DatePicker
                      suffixIcon={<img alt="calendar-icon" src={CalendarIcon} />}
                      dropdownClassName={styles.calendar}
                    />
                  </Form.Item>
                </div>
                <div className={styles.addBenefit__body_label}>Annual Cost</div>
                <div className={styles.addBenefit__body_formItem}>
                  <Form.Item name="annualCost">
                    <Select
                      showSearch
                      suffixIcon={<span>₹</span>}
                      allowClear
                      // onChange={this.onChangeSelect}
                      filterOption={(input, option) => {
                        return (
                          option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        );
                      }}
                    >
                      {['10,000', '15,000', '20,000'].map((item) => (
                        <Option value={item} key={item}>
                          {item}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </div>
                <div className={styles.addBenefit__body_label}>Employee Contribution</div>
                <div className={styles.addBenefit__body_formItem}>
                  <Form.Item name="employeeContribution">
                    <Select
                      showSearch
                      suffixIcon={<span>₹</span>}
                      allowClear
                      // onChange={this.onChangeSelect}
                      filterOption={(input, option) => {
                        return (
                          option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        );
                      }}
                    >
                      {['5,000', '10,000', '15,000'].map((item) => (
                        <Option value={item} key={item}>
                          {item}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </div>
                <div className={styles.addBenefit__body_label}>Employer&lsquo;s Contribution</div>
                <div className={styles.addBenefit__body_formItem}>
                  <Form.Item name="employerContribution">
                    <Select
                      showSearch
                      suffixIcon={<span>₹</span>}
                      allowClear
                      // onChange={this.onChangeSelect}
                      filterOption={(input, option) => {
                        return (
                          option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        );
                      }}
                    >
                      {['10,000', '15,000', '20,000'].map((item) => (
                        <Option value={item} key={item}>
                          {item}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </div>
                <div className={styles.addBenefit__body_label}>Valid Till</div>
                <div className={styles.addBenefit__body_formItem}>
                  <Form.Item name="validTill">
                    <DatePicker
                      suffixIcon={<img alt="calendar-icon" src={CalendarIcon} />}
                      dropdownClassName={styles.calendar}
                    />
                  </Form.Item>
                </div>
              </div>
              <div className={styles.addBenefit__bottom}>
                <Button className={`${styles.addBenefit__bottom_btn} ${styles.cancelBtn}`}>
                  Cancel
                </Button>
                <Button className={`${styles.addBenefit__bottom_btn} ${styles.addBtn}`}>Add</Button>
              </div>
            </Form>
          )}
        </div>
      </Modal>
    );
  }
}

export default ModalAddBenefit;
