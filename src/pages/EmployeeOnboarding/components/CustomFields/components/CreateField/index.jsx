import React, { PureComponent } from 'react';
import { formatMessage } from 'umi';
import { PageContainer } from '@/layouts/layout/src';
import backArrow from '@/assets/createFieldArrow.svg';
import { Button, Input, Radio } from 'antd';
import styles from './index.less';

class index extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      itemField: 'all',
    };
  }

  handleChange = (e) => {
    const { value } = e.target;
    this.setState({ name: value });
  };

  onClickChange = (item) => {
    console.log(item);
    this.setState({ itemField: item });
  };

  render() {
    const { name, itemField } = this.state;
    console.log(name, itemField);
    return (
      <PageContainer>
        <div className={styles.CreateACustomFieldSection}>
          <div className={styles.Title}>
            <img src={backArrow} alt="not Found" />
            <h2>
              {formatMessage({
                id: 'pages.EmployeeOnboardingCustomField.createACustomFieldSection',
              })}
            </h2>
          </div>
          <div className={styles.boxFieldSection1}>
            <p className={styles.boxFieldSection1__Title}>
              {formatMessage({
                id: 'pages.EmployeeOnboardingCustomField.CreateCustomFieldSection',
              })}
            </p>
            <Input />
          </div>
          <div className={styles.boxFieldSection2}>
            <div className={styles.boxFieldSection2__Title}>
              <p>
                {formatMessage({
                  id: 'pages.EmployeeOnboardingCustomField.fillingOutTheFields',
                })}
              </p>
            </div>
            <div className={styles.boxFieldSection2__Content}>
              <div className={styles.boxFieldSection2__Content1}>
                <span className={styles.boxFieldSection2__Content1__Text}>
                  {formatMessage({
                    id: 'pages.EmployeeOnboardingCustomField.text2',
                  })}
                </span>
                <div className={styles.boxFieldSection2__Content1__Radio}>
                  <Radio.Group defaultValue="Yes">
                    <Radio value="Yes">Yes</Radio>
                    <Radio value="No">No</Radio>
                  </Radio.Group>
                </div>
              </div>
              <div className={styles.boxFieldSection2__Content1}>
                <span className={styles.boxFieldSection2__Content1__Text1}>
                  {formatMessage({
                    id: 'pages.EmployeeOnboardingCustomField.whoWillFillOutThisField',
                  })}
                </span>
                <div className={styles.boxFieldSection2__Content1__Radio}>
                  <Radio.Group defaultValue="employee">
                    <Radio value="employee">Employee</Radio>
                    <Radio value="employer">Employer</Radio>
                  </Radio.Group>
                </div>
              </div>
              <div className={styles.boxFieldSection2__Content1}>
                <span className={styles.boxFieldSection2__Content1__Text1}>
                  {formatMessage({
                    id: 'pages.EmployeeOnboardingCustomField.completedDuringOnboarding',
                  })}
                </span>
                <div className={styles.boxFieldSection2__Content1__Radio}>
                  <Radio.Group defaultValue="Yes">
                    <Radio value="Yes">Yes</Radio>
                    <Radio value="No">No</Radio>
                  </Radio.Group>
                </div>
              </div>
              <div className={styles.boxFieldSection2__Content1}>
                <span className={styles.boxFieldSection2__Content1__Text1}>
                  {formatMessage({
                    id: 'pages.EmployeeOnboardingCustomField.shouldTheIndividual',
                  })}
                </span>
                <div className={styles.boxFieldSection2__Content1__Radio}>
                  <Radio.Group defaultValue="Yes">
                    <Radio value="Yes">Yes</Radio>
                    <Radio value="No">No</Radio>
                  </Radio.Group>
                </div>
              </div>
              <div className={styles.boxFieldSection2__Content1}>
                <span className={styles.boxFieldSection2__Content1__Text1}>
                  {formatMessage({
                    id: 'pages.EmployeeOnboardingCustomField.shouldTheIndividualManager',
                  })}
                </span>
                <div className={styles.boxFieldSection2__Content1__Radio}>
                  <Radio.Group defaultValue="Yes">
                    <Radio value="Yes">Yes</Radio>
                    <Radio value="No">No</Radio>
                  </Radio.Group>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.boxFieldSection2}>
            <div className={styles.boxFieldSection2__Title}>
              <p>
                {formatMessage({
                  id: 'pages.EmployeeOnboardingCustomField.Filters',
                })}
              </p>
            </div>
            <div className={styles.boxFieldSection2__Content}>
              <div className={styles.boxFieldSection2__Content1}>
                <span className={styles.boxFieldSection2__Content1__Text}>
                  {formatMessage({
                    id: 'pages.EmployeeOnboardingCustomField.text3',
                  })}
                </span>
                <div
                  className={styles.boxFieldSection2__Content1__Radio}
                  onChange={this.handleChange}
                >
                  <Radio.Group name={name} defaultValue="everyone">
                    <Radio name="everyone" value="everyone">
                      Everyone
                    </Radio>
                    <Radio name="certain people only" value="certain people only">
                      Certain people only
                    </Radio>
                  </Radio.Group>
                  {name === 'certain people only' ? (
                    <div className={styles.switchField}>
                      <div
                        className={
                          itemField === 'all'
                            ? `${styles.itemField1Active}`
                            : `${styles.itemField1}`
                        }
                        onClick={() => this.onClickChange('all')}
                      >
                        All of this
                      </div>
                      <div
                        className={
                          itemField === 'any'
                            ? `${styles.itemField1Active}`
                            : `${styles.itemField1}`
                        }
                        onClick={() => this.onClickChange('any')}
                      >
                        Any of this
                      </div>
                    </div>
                  ) : (
                    ''
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className={styles.buttonFooter}>
            <Button className={styles.buttonFooterSave}>
              {formatMessage({ id: 'pages.EmployeeOnboardingCustomField.Save&Return' })}
            </Button>
            <Button className={styles.buttonFooterCancel}>
              {formatMessage({ id: 'pages.EmployeeOnboardingCustomField.Cancel' })}
            </Button>
          </div>
        </div>
      </PageContainer>
    );
  }
}

export default index;
