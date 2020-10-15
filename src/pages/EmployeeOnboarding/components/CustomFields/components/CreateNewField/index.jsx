import React, { PureComponent } from 'react';
import { formatMessage, connect } from 'umi';
import { PageContainer } from '@/layouts/layout/src';
import backArrow from '@/assets/createFieldArrow.svg';
import { Button, Input, Radio, Select } from 'antd';
import iconCancel from '@/assets/iconCancelCustomField.svg';
import DraggerUpLoad from './DraggerUpload';
import styles from './index.less';

@connect(
  ({ loading, employee: { department = [] } = {}, employeeProfile: { listSkill } = {} }) => ({
    loading: loading.effects['custormField/addSection'],
    department,
    listSkill,
  }),
)
class CreateNewField extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      itemField: 'all',
      dataFilter: [{}],
      data: {
        prompt: '',
        helpText: '',
        helpMedia: '',
        settings: {},
        filters: [],
      },
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'employee/fetchDepartment',
    });
    dispatch({
      type: 'employeeProfile/fetchListSkill',
    });
  }

  handleChange = (name, e) => {
    const { data } = this.state;
    const { value } = e.target;
    if (name === 'prompt' || name === 'helpText') {
      const item = data;
      this.setState({ data: { ...item, [name]: value } });
    }
    if (
      name === 'sensitive' ||
      name === 'applicant' ||
      name === 'onboardingComplete' ||
      name === 'visibleToIndividual' ||
      name === 'visibileToManager'
    ) {
      const item = data;
      const { settings } = item;
      this.setState({ data: { ...item, settings: { ...settings, [name]: value } } });
    }
    this.setState({ name: value });
  };

  onClickChange = (item) => {
    this.setState({ itemField: item });
  };

  handleAddUpLoadtoState = (name, value) => {
    const { data } = this.state;
    const item = data;
    this.setState({ data: { ...item, [name]: value } });
  };

  handleGetUpLoad = (resp) => {
    const { data = [] } = resp;
    const [first] = data;
    const value = first.id;
    this.handleAddUpLoadtoState('helpMedia', value);
  };

  handleChangeFilter = (index, name, value) => {
    const { data } = this.state;
    const { filters } = data;
    const item = filters[index];
    const newItem = { ...item, [name]: value };
    const newList = [...filters];
    newList.splice(index, 1, newItem);
    this.setState({ data: { ...data, filters: newList } });
  };

  render() {
    const { name, itemField, dataFilter } = this.state;
    const { department, listSkill } = this.props;
    const { Option } = Select;
    const { TextArea } = Input;
    return (
      <PageContainer>
        <div className={styles.CreateNewField}>
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
                id: 'pages.EmployeeOnboardingCustomField.paragarph',
              })}
            </p>
          </div>

          <div className={styles.boxFieldSection2}>
            <div className={styles.boxFieldSection2__Title}>
              <p>
                {formatMessage({
                  id: 'pages.EmployeeOnboardingCustomField.FillingOutTheField',
                })}
              </p>
            </div>
            <div className={styles.boxFieldSection2__Content}>
              <div className={styles.boxFieldSection2__Content1}>
                <p className={styles.boxFieldSection2__textP}>
                  {formatMessage({
                    id: 'pages.EmployeeOnboardingCustomField.Prompt',
                  })}
                </p>
                <span className={styles.boxFieldSection2__note}>
                  {formatMessage({
                    id: 'pages.EmployeeOnboardingCustomField.note',
                  })}
                </span>
                <Input onChange={(e) => this.handleChange('prompt', e)} />
              </div>
              <div className={styles.boxFieldSection2__Content1}>
                <div className={styles.boxFieldSection2__flex}>
                  <div className={styles.boxFieldSection2__flexLeft}>
                    <p className={styles.boxFieldSection2__textP}>
                      {formatMessage({
                        id: 'pages.EmployeeOnboardingCustomField.HelpText',
                      })}
                    </p>
                    <span className={styles.boxFieldSection2__note}>
                      {formatMessage({
                        id: 'pages.EmployeeOnboardingCustomField.note2',
                      })}
                    </span>
                    <TextArea rows={5} onChange={(e) => this.handleChange('helpText', e)} />
                  </div>
                  <div className={styles.boxFieldSection2__flexRight}>
                    <p className={styles.boxFieldSection2__textP}>
                      {formatMessage({
                        id: 'pages.EmployeeOnboardingCustomField.Helpmedia',
                      })}
                    </p>
                    <span className={styles.boxFieldSection2__note}>
                      {formatMessage({
                        id: 'pages.EmployeeOnboardingCustomField.note3',
                      })}
                    </span>
                    <DraggerUpLoad getResponse={this.handleGetUpLoad} />
                  </div>
                </div>
              </div>
            </div>
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
                  <Radio.Group
                    defaultValue="true"
                    onChange={(e) => this.handleChange('sensitive', e)}
                  >
                    <Radio value="true">Yes</Radio>
                    <Radio value="false">No</Radio>
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
                  <Radio.Group
                    defaultValue="EMPLOYEE"
                    onChange={(e) => this.handleChange('applicant', e)}
                  >
                    <Radio value="EMPLOYEE">Employee</Radio>
                    <Radio value="EMPLOYER">Employer</Radio>
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
                  <Radio.Group
                    defaultValue="true"
                    onChange={(e) => this.handleChange('onboardingComplete', e)}
                  >
                    <Radio value="true">Yes</Radio>
                    <Radio value="false">No</Radio>
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
                  <Radio.Group
                    defaultValue="true"
                    onChange={(e) => this.handleChange('visibleToIndividual', e)}
                  >
                    <Radio value="true">Yes</Radio>
                    <Radio value="false">No</Radio>
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
                  <Radio.Group
                    defaultValue="true"
                    onChange={(e) => this.handleChange('visibileToManager', e)}
                  >
                    <Radio value="true">Yes</Radio>
                    <Radio value="false">No</Radio>
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
                  onChange={(e) => this.handleChange('filter', e)}
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
                    <>
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
                      {dataFilter.map((item, index) => {
                        return (
                          <div key={`data${index + 1}`}>
                            <div className={styles.selectFilter}>
                              <Select
                                className={styles.selectFilter1}
                                allowClear
                                onChange={(e) => this.handleChangeFilter(index, 'department', e)}
                              >
                                {department.map((itemDepartment) => {
                                  return (
                                    <Option value={itemDepartment._id} key={itemDepartment._id}>
                                      {itemDepartment.name}
                                    </Option>
                                  );
                                })}
                              </Select>
                              <Select defaultValue="is" className={styles.selectFilter2} allowClear>
                                <Option value="is">is</Option>
                              </Select>
                              <Select
                                className={styles.selectFilter3}
                                allowClear
                                onChange={(value) => this.handleChangeFilter(index, 'title', value)}
                              >
                                {listSkill.map((itemSkill) => {
                                  return (
                                    <Option value={itemSkill._id} key={itemSkill._id}>
                                      {itemSkill.name}
                                    </Option>
                                  );
                                })}
                              </Select>
                              <img src={iconCancel} alt="not found" />
                            </div>
                            <div className={styles.line} />
                          </div>
                        );
                      })}
                    </>
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

export default CreateNewField;
