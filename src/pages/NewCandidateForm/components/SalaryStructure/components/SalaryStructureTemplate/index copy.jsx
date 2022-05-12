/* eslint-disable react/jsx-props-no-spreading */
import { Button, Col, Input, Row, Spin, Space, Slider } from 'antd';
import { toNumber, toString, trim, trimStart } from 'lodash';
import React, { PureComponent } from 'react';
import { connect, history } from 'umi';
import moment from 'moment';
import { NEW_PROCESS_STATUS, ONBOARDING_FORM_LINK } from '@/utils/onboarding';
import { getCurrentTenant } from '@/utils/authority';
import RenderAddQuestion from '@/components/Question/RenderAddQuestion';
import { Page } from '../../../../utils';
import styles from './index.less';
import ModalWaitAccept from './ModalWaitAccept/index';
import SalaryReference from './SalaryReference/index';

@connect(
  ({
    loading,
    newCandidateForm: {
      cancelCandidate,
      checkMandatory = {},
      currentStep,
      isEditingSalary = false,
      data: {
        listTitle = [],
        title = {},
        grade = {},
        department = {},
        workLocation = {},
        processStatus = '',
        salaryStructure: {
          salaryTemplate: salaryOriginData,
          settings: settingsOriginData = [],
          title: salaryTitleOriginData = {},
          status: salaryAcceptanceStatus = '',
        } = {},
        candidate,
      } = {},
      data,
      tempData = {},
      tempData: {
        titleList = [],
        locationList = [],
        departmentList = [],
        salaryStructure: {
          salaryTemplate: salaryTempData,
          settings: settingsTempData = [],
          salaryTitle: salaryTitleTempData,
          salaryDepartment: salaryDepartmentTempData,
          salaryLocation: salaryWorkLocationTempData,
        } = {},
      } = {},
    },
    user: { currentUser: { company: { _id = '' } = {} } = {}, currentUser: { location = {} } = {} },
  }) => ({
    loadingTable: loading.effects['newCandidateForm/saveSalaryStructure'],
    loadingFetchTable: loading.effects['newCandidateForm/fetchTableData'],
    loadingEditSalary: loading.effects['newCandidateForm/updateByHR'],
    listTitle,
    titleList,
    grade,
    salaryOriginData,
    salaryTempData,
    cancelCandidate,
    location,
    checkMandatory,
    locationList,
    department,
    workLocation,
    departmentList,
    salaryDepartmentTempData,
    salaryWorkLocationTempData,
    currentStep,
    processStatus,
    _id,
    data,
    settingsOriginData,
    settingsTempData,
    title,
    salaryTitleOriginData,
    salaryTitleTempData,
    tempData,
    candidate,
    salaryAcceptanceStatus,
    isEditingSalary,
  }),
)
class SalaryStructureTemplate extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      openModal: '',
    };
  }

  componentDidMount = () => {
    const {
      dispatch,
      settingsTempData: settings = [],
      grade,
      workLocation: { _id } = {},
    } = this.props;
    const getSetting = !!(settings.length === 0);

    dispatch({
      type: 'newCandidateForm/fetchTableData',
      payload: {
        grade: grade._id,
        location: _id,
        getSetting,
      },
    });

    dispatch({
      type: 'newCandidateForm/saveCheckMandatory',
      payload: {
        filledSalaryStructure: true,
      },
    });
  };

  onClickPrev = () => {
    const { tempData } = this.props;
    const { ticketID = '' } = tempData;
    history.push(`/onboarding/list/view/${ticketID}/${ONBOARDING_FORM_LINK.DOCUMENT_VERIFICATION}`);
  };

  onClickNext = () => {
    const {
      dispatch,
      settingsTempData: settings = [],
      salaryAcceptanceStatus = '',
      data: { _id, processStatus },
      currentStep,
    } = this.props;
    if (currentStep === 3) {
      if (
        processStatus === NEW_PROCESS_STATUS.SALARY_NEGOTIATION &&
        salaryAcceptanceStatus !== 'ACCEPTED'
      ) {
        dispatch({
          type: 'newCandidateForm/updateByHR',
          payload: {
            salaryStructure: {
              settings,
              status: 'IN-PROGRESS',
            },
            candidate: _id,
            sentDate: moment(),
            tenantId: getCurrentTenant(),
          },
        }).then(({ statusCode }) => {
          if (statusCode === 200) {
            this.setState({ openModal: 'ModalWaitAccept' });
          }
        });
      } else {
        const { tempData } = this.props;
        const { ticketID = '' } = tempData;
        dispatch({
          type: 'newCandidateForm/updateByHR',
          payload: {
            currentStep: 4,
            candidate: _id,
            tenantId: getCurrentTenant(),
          },
        });
        dispatch({
          type: 'newCandidateForm/save',
          payload: {
            currentStep: 4,
          },
        });
        history.push(`/onboarding/list/view/${ticketID}/benefits`);
      }
    } else {
      const { tempData } = this.props;
      const { ticketID = '' } = tempData;
      history.push(`/onboarding/list/view/${ticketID}/benefits`);
    }
  };

  handleEditSalary = (value) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'newCandidateForm/save',
      payload: { isEditingSalary: value },
    });
  };

  onCancel = async () => {
    const { dispatch, settingsOriginData: settings = [] } = this.props;
    await dispatch({
      type: 'newCandidateForm/saveSalaryStructure',
      payload: { settings },
    });

    this.handleEditSalary(false);
  };

  onClickSubmit = () => {
    this.handleEditSalary(false);
  };

  checkKey = (key) => {
    const { settingsTempData: settings = [] } = this.props;
    let check = false;
    settings.forEach((item) => {
      if (item.key === key) check = true;
    });
    return check;
  };

  getValueByKey = (arr, key) => {
    let value;
    arr.forEach((item) => {
      if (item.key === key) {
        value = item.value;
      }
    });
    return value;
  };

  onChangeSilde = (value = [], key) => {
    const { dispatch, settingsTempData: settings = [] } = this.props;
    if (value.length === 2) {
      const newValue = value[1];
      const tempTableData = JSON.parse(JSON.stringify(settings));

      const index = tempTableData.findIndex((data) => data.key === key);
      tempTableData[index].value = newValue;
      dispatch({
        type: 'newCandidateForm/saveSalaryStructure',
        payload: {
          settings: tempTableData,
        },
      });
    }
  };

  handleChange = (e, key) => {
    const {
      dispatch,
      settingsTempData = [],
      salaryTempData: { base_salary: { maximum = 0 } = {}, settings = [] },
    } = this.props;
    const { value } = e.target;
    let newValue = value.replace(/,/g, '');

    const reg = /^\d*(\.\d*)?$/;

    if (reg.test(newValue) || newValue === '') {
      if (key === 'basic' && toNumber(newValue) > maximum) newValue = maximum;
      if (
        (key === 'lunch_allowance' ||
          key === 'petrol_allowance' ||
          key === 'mobile_internet_allowance') &&
        toNumber(newValue) > this.getValueByKey(settings, key)
      )
        newValue = this.getValueByKey(settings, key);
      const tempTableData = JSON.parse(JSON.stringify(settingsTempData));

      const index = tempTableData.findIndex((data) => data.key === key);
      tempTableData[index].value = newValue;
      dispatch({
        type: 'newCandidateForm/saveSalaryStructure',
        payload: {
          settings: tempTableData,
        },
      });
    }
  };

  onBlur = (e, key) => {
    const {
      dispatch,
      settingsTempData: settings = [],
      salaryTempData: { base_salary: { minimum = 0 } = {} },
    } = this.props;
    const { value } = e.target;
    let newValue = value.replace(/,/g, '');

    const reg = /^\d*(\.\d*)?$/;

    if (reg.test(newValue) || newValue === '') {
      if (key === 'basic' && toNumber(newValue) < minimum) newValue = minimum;

      const tempTableData = JSON.parse(JSON.stringify(settings));

      const index = tempTableData.findIndex((data) => data.key === key);
      tempTableData[index].value = toNumber(newValue);
      const indexBasic = tempTableData.findIndex((data) => data.key === 'basic');
      const basic = tempTableData[indexBasic].value;
      let sum = 0;
      tempTableData.forEach((item) => {
        if (item.operator) {
          const { value: valueSalary } = item;
          if (item.unit === '%') sum += basic * (valueSalary / 100);
          else sum += valueSalary;
        }
      });
      const indexTotal = tempTableData.findIndex((data) => data.key === 'total_compensation');
      tempTableData[indexTotal].value = Math.round(sum);
      dispatch({
        type: 'newCandidateForm/saveSalaryStructure',
        payload: {
          settings: tempTableData,
        },
      });
    }
  };

  formatNumber = (value) => {
    // const temp = toString(value);
    const list = trim(value).split('.');
    let num = list[0] === '0' ? list[0] : trimStart(list[0], '0');
    let result = '';
    while (num.length > 3) {
      result = `,${num.slice(-3)}${result}`;
      num = num.slice(0, num.length - 3);
    }
    if (num) {
      result = num + result;
    }
    list[0] = result;
    return list.join('.');
  };

  renderValue = (obj, prefix) => {
    if (obj) {
      if (obj.minimum && obj.maximum && obj.minimum !== obj.maximum)
        return `${prefix} ${this.formatNumber(obj.minimum)} - ${prefix} ${this.formatNumber(
          obj.maximum,
        )}`;
      return (obj.minimum && `${prefix} ${this.formatNumber(obj.minimum)}`) || '0';
    }
    return '0';
  };

  renderSingle = (value, unit) => {
    if (!value) return '0';
    if (unit !== '%') return `${unit} ${this.formatNumber(value)}`;
    return (
      <div>
        {value}
        <span className={styles.ofBasic}> % of Basics</span>
      </div>
    );
  };

  _renderFooter = () => {
    const { footerData } = this.state;
    return (
      <div className={styles.salaryStructureTemplate_footer}>
        {footerData.map((data, index) => {
          return (
            <div key={`${index + 1}`} className={styles.salaryStructureTemplate_footer_info}>
              <p className={styles.title}>{data.name}</p>
              <p className={styles.value}>{data.value}</p>
            </div>
          );
        })}
      </div>
    );
  };

  convertValue = (value) => {
    const str = toString(value);
    const list = str.split('.');

    let num = list[0] !== '' && list[0] !== '0' ? trimStart(list[0], '0') : '0';
    let result = '';
    while (num.length > 3) {
      result = `,${num.slice(-3)}${result}`;
      num = num.slice(0, num.length - 3);
    }
    if (num) {
      result = num + result;
    }
    list[0] = result;
    return list.join('.');
  };

  convertVeriable = (value) => {
    const str = toString(value);
    const list = str.split('.');
    list[0] = list[0] !== '0' && list[0] !== '' ? trimStart(list[0], '0') : '0';
    return list.join('.');
  };

  _renderValue = (item) => {
    const {
      isEditingSalary,
      settingsTempData = [],
      salaryTempData: {
        country = '',
        base_salary: { minimum = 0, maximum = 0 } = {},
        settings = [],
      } = {},
    } = this.props;
    const marks = {};
    if (!isEditingSalary)
      return (
        <div key={item.key} className={styles.salary__right__text}>
          {this.renderSingle(item.value, item.unit)}
        </div>
      );
    if (item.unit === '%')
      return (
        <div key={item.key} className={styles.salary__right__inputAfter}>
          <Input
            addonAfter="% of Basics"
            value={this.convertVeriable(item.value)}
            onChange={(e) => this.handleChange(e, item.key)}
            onBlur={(e) => this.onBlur(e, item.key)}
          />
        </div>
      );
    if (country === 'VN') {
      if (item.key === 'basic') {
        marks[minimum] = `VND ${this.convertValue(minimum)}`;
        marks[maximum] = `VND ${this.convertValue(maximum)}`;
        return (
          <>
            <div key={item.key} className={styles.inputBefore}>
              <Input
                addonBefore={item.unit}
                value={this.convertValue(item.value)}
                onChange={(e) => this.handleChange(e, item.key)}
                onBlur={(e) => this.onBlur(e, item.key)}
              />
            </div>
            <div>
              <Slider
                range
                min={minimum}
                max={maximum}
                tipFormatter={this.convertValue}
                step={1000}
                marks={marks}
                value={[minimum, this.getValueByKey(settingsTempData, item.key)]}
                onChange={(value) => this.onChangeSilde(value, item.key)}
              />
            </div>
          </>
        );
      }
      const maxValue = this.getValueByKey(settings, item.key);
      marks[0] = 'VND 0';
      marks[maxValue] = `VND ${this.convertValue(maxValue)}`;
      return (
        <>
          <div key={item.key} className={styles.inputBefore}>
            <Input
              addonBefore={item.unit}
              value={this.convertValue(item.value)}
              onChange={(e) => this.handleChange(e, item.key)}
              onBlur={(e) => this.onBlur(e, item.key)}
            />
          </div>
          <div>
            <Slider
              range
              min={0}
              max={maxValue}
              tipFormatter={this.convertValue}
              step={1000}
              marks={marks}
              value={[0, this.getValueByKey(settingsTempData, item.key)]}
              onChange={(value) => this.onChangeSilde(value, item.key)}
            />
          </div>
        </>
      );
    }
    return (
      <div key={item.key} className={styles.inputBefore}>
        <Input
          addonBefore={item.unit}
          value={this.convertValue(item.value)}
          onChange={(e) => this.handleChange(e, item.key)}
          onBlur={(e) => this.onBlur(e, item.key)}
        />
      </div>
    );
  };

  _renderBottomBar = () => {
    const { isEditingSalary, salaryAcceptanceStatus, loadingEditSalary = false } = this.props;
    return (
      <div className={styles.bottomBar}>
        {isEditingSalary ? (
          <div className={styles.bottomBar__button} span={24}>
            <Space size={24}>
              <Button
                type="secondary"
                onClick={this.onCancel}
                className={styles.bottomBar__button__secondary}
              >
                Cancel
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                onClick={this.onClickSubmit}
                className={styles.bottomBar__button__prmary}
              >
                Update
              </Button>
            </Space>
          </div>
        ) : (
          <div className={styles.bottomBar__button} span={24}>
            <Space>
              <Button
                type="secondary"
                onClick={this.onClickPrev}
                className={styles.bottomBar__button__secondary}
              >
                Previous
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                onClick={this.onClickNext}
                className={styles.bottomBar__button__prmary}
                loading={loadingEditSalary}
              >
                {salaryAcceptanceStatus === 'ACCEPTED' ? 'Next' : 'Send to candidate'}
              </Button>
            </Space>
            <RenderAddQuestion page={Page.Salary_Structure} />
          </div>
        )}
      </div>
    );
  };

  render() {
    const {
      // salaryTempData,
      department = {},
      workLocation = {},
      loadingFetchTable,
      salaryTempData: { country = '' } = {},
      settingsTempData: settings = [],
      grade = {},
      title = {},
      isEditingSalary,
    } = this.props;
    const { openModal } = this.state;
    return (
      <div className={styles.salaryStructureTemplate}>
        <Row gutter={[8, 8]}>
          <Col xs={24} sm={24} md={6} lg={6}>
            <p className={styles.p_title_select}>Grade</p>
            <div className={styles.salaryStructureTemplate_select}>
              <Input value={grade.name} size="large" disabled />
            </div>
          </Col>
          <Col xs={24} sm={24} md={6} lg={6}>
            <p className={styles.p_title_select}>Department</p>
            <div className={styles.salaryStructureTemplate_select}>
              <Input
                value={department ? department.name : department || null}
                size="large"
                disabled
              />
            </div>
          </Col>
          <Col xs={24} sm={24} md={6} lg={6}>
            <p className={styles.p_title_select}>Location</p>
            <div className={styles.salaryStructureTemplate_select}>
              <Input
                value={workLocation ? workLocation.name : workLocation || null}
                size="large"
                disabled
              />
            </div>
          </Col>
          <Col xs={24} sm={24} md={6} lg={6}>
            <p className={styles.p_title_select}> Job title</p>
            <div className={styles.salaryStructureTemplate_select}>
              <Input value={title ? title.name : title || null} size="large" disabled />
            </div>
          </Col>
        </Row>
        {this.checkKey('lunch_allowance') && (
          <Row className={styles.noteAllowance}>Allowances value as per month</Row>
        )}
        {loadingFetchTable ? (
          <Spin className={styles.spin} />
        ) : (
          <>
            <div className={styles.salaryStructureTemplate_table}>
              <Row className={styles.salary}>
                <Col span={12} className={styles.salary__left}>
                  {settings.map(
                    (item) =>
                      item.key !== 'total_compensation' && (
                        <div
                          key={item.key}
                          className={
                            isEditingSalary &&
                            country === 'VN' &&
                            (item.key === 'basic' ||
                              item.key === 'lunch_allowance' ||
                              item.key === 'petrol_allowance' ||
                              item.key === 'mobile_internet_allowance')
                              ? styles.salary__left__textEdit
                              : styles.salary__left__text
                          }
                        >
                          {item.title}
                        </div>
                      ),
                  )}
                </Col>
                <Col
                  span={12}
                  className={
                    isEditingSalary && country === 'VN'
                      ? styles.salary__right && styles.salary__right__VN
                      : styles.salary__right
                  }
                >
                  {settings.map((item) => {
                    if (item.key !== 'total_compensation') {
                      if (item.key === 'salary_13')
                        return (
                          <div key={item.key} className={styles.salary__right__text}>
                            {item.value !== 0
                              ? this.renderSingle(item.value, item.unit)
                              : '(Basic/12) x The number of months work'}
                          </div>
                        );
                      return this._renderValue(item);
                    }
                    return '';
                  })}
                </Col>
              </Row>
              <Row className={styles.salaryTotal}>
                <Col span={12} className={styles.salaryTotal__left}>
                  {settings.map(
                    (item) =>
                      item.key === 'total_compensation' && (
                        <div key={item.key} className={styles.salaryTotal__left__text}>
                          {item.title}
                        </div>
                      ),
                  )}
                </Col>
                <Col span={12} className={styles.salaryTotal__right}>
                  {settings.map(
                    (item) =>
                      item.key === 'total_compensation' && (
                        <div key={item.key} className={styles.salaryTotal__right__text}>
                          {this.renderSingle(item.value, item.unit)}
                        </div>
                      ),
                  )}
                </Col>
              </Row>
            </div>
            {this._renderBottomBar()}
          </>
        )}
        <SalaryReference
          openModal={openModal === 'SalaryReference'}
          onCancel={() => this.setState({ openModal: '' })}
        />
        <ModalWaitAccept
          openModal={openModal === 'ModalWaitAccept'}
          onCancel={() => this.setState({ openModal: '' })}
        />
      </div>
    );
  }
}

export default SalaryStructureTemplate;
