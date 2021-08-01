import React, { Component } from 'react';
import { Button, Spin, Modal, Form, Select, DatePicker } from 'antd';

import CalendarIcon from '@/assets/calendar-v2.svg';

import styles from './index.less';

const { Option } = Select;

class ModalAddBenefit extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  destroyOnClose = () => {
    const { handleCandelModal = () => {} } = this.props;
    handleCandelModal();
  };

  render() {
    const { visible = false } = this.props;

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
          <Form>
            <div className={styles.addBenefit__body}>
              <div className={styles.addBenefit__body_label}>Heading</div>
              <div className={styles.addBenefit__body_formItem}>
                <Form.Item name="heading">
                  <Select
                    showSearch
                    allowClear
                    suffixIcon={null}
                    placeholder="Select heading"
                    // onChange={this.onChangeSelect}
                    filterOption={(input, option) => {
                      return option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
                    }}
                  >
                    <Option value="health">Health & Wellbeing</Option>
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
                      return option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
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
                      return option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
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
                      return option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
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
                      return option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
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
        </div>
      </Modal>
    );
  }
}

export default ModalAddBenefit;
