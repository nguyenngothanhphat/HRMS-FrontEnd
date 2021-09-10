/* eslint-disable react/jsx-props-no-spreading */
import { Button, Col, Input, Row, Spin, Space } from 'antd';
import { toNumber, toString, trim, trimStart } from 'lodash';
import React, { PureComponent } from 'react';
import { connect, history } from 'umi';
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
      currentStep = {},
      isEditingSalary = false,
      data: {
        listTitle = [],
        title = {},
        grade = 0,
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
        grade,
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
      data: { _id, processStatus, currentStep },
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

  handleChange = (e, key) => {
    const { dispatch, settingsTempData: settings = [] } = this.props;
    const { value } = e.target;
    const newValue = value.replace(/,/g, '');

    const reg = /^\d*(\.\d*)?$/;

    if (reg.test(newValue) || newValue === '') {
      const tempTableData = JSON.parse(JSON.stringify(settings));

      const index = tempTableData.findIndex((data) => data.key === key);
      tempTableData[index].value = newValue;
      // const indexBasic = tempTableData.findIndex((data) => data.key === 'basic');
      // const basic = tempTableData[indexBasic].value;
      // let sum = 0;
      // tempTableData.forEach((item) => {
      //   if (item.operator) {
      //     let { value: valueSalary } = item;
      //     if (item.period === 'day') {
      //       valueSalary *= 22;
      //     }

      //     if (item.unit === '%') {
      //       if (item.operator === 'plus') sum += basic * (valueSalary / 100);
      //       if (item.operator === 'minus') sum -= (basic * valueSalary) / 100;
      //     } else {
      //       if (item.operator === 'plus') sum += valueSalary;
      //       if (item.operator === 'minus') sum -= valueSalary;
      //     }
      //   }
      // });
      // const indexTotal = tempTableData.findIndex((data) => data.key === 'total_compensation');
      // tempTableData[indexTotal].value = Math.round(sum);
      dispatch({
        type: 'newCandidateForm/saveSalaryStructure',
        payload: {
          settings: tempTableData,
        },
      });
    }
  };

  onBlur = (e, key) => {
    const { dispatch, settingsTempData: settings = [] } = this.props;
    const { value } = e.target;
    const newValue = value.replace(/,/g, '');

    const reg = /^\d*(\.\d*)?$/;

    if (reg.test(newValue) || newValue === '') {
      const tempTableData = JSON.parse(JSON.stringify(settings));

      const index = tempTableData.findIndex((data) => data.key === key);
      tempTableData[index].value = toNumber(newValue);
      const indexBasic = tempTableData.findIndex((data) => data.key === 'basic');
      const basic = tempTableData[indexBasic].value;
      let sum = 0;
      tempTableData.forEach((item) => {
        if (item.operator) {
          let { value: valueSalary } = item;
          if (item.period === 'day') {
            valueSalary *= 22;
          }

          if (item.unit === '%') {
            if (item.operator === 'plus') sum += basic * (valueSalary / 100);
            if (item.operator === 'minus') sum -= (basic * valueSalary) / 100;
          } else {
            if (item.operator === 'plus') sum += valueSalary;
            if (item.operator === 'minus') sum -= valueSalary;
          }
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

  _renderVaule = (item) => {
    const { isEditingSalary } = this.props;

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
    return (
      <div key={item.key} className={styles.salary__right__inputBefore}>
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
      salaryTempData,
      department = {},
      workLocation = {},
      loadingFetchTable,
      settingsTempData: settings = [],
      grade = '',
      title = {},
    } = this.props;
    const { openModal } = this.state;
    return (
      <div className={styles.salaryStructureTemplate}>
        <Row gutter={[8, 8]}>
          <Col xs={24} sm={24} md={6} lg={6}>
            <p className={styles.p_title_select}>Grade</p>
            <div className={styles.salaryStructureTemplate_select}>
              <Input value={grade} size="large" disabled />
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
                // style={{ width: 280 }}
                disabled
              />
            </div>
          </Col>
          <Col xs={24} sm={24} md={6} lg={6}>
            <p className={styles.p_title_select}> Job title</p>
            <div className={styles.salaryStructureTemplate_select}>
              <Input
                value={title ? title.name : title || null}
                size="large"
                // style={{ width: 280 }}
                disabled
              />
            </div>
          </Col>
        </Row>
        {salaryTempData && (
          <Row className={styles.range}>
            <Col span={16}>
              <Row>
                <Col span={8} className={styles.range__col__text}>
                  Base Salary Range
                </Col>
                <Col span={16} className={styles.range__col}>
                  {this.renderValue(salaryTempData.base_salary, salaryTempData.currency_unit)}
                </Col>
              </Row>
              <Row>
                <Col span={8} className={styles.range__col__text}>
                  Allowances Range
                </Col>
                <Col span={16} className={styles.range__col}>
                  {this.renderValue(salaryTempData.allowances_range, salaryTempData.currency_unit)}
                </Col>
              </Row>
            </Col>
            <Col span={8}>
              <Row justify="end" align="middle" className={styles.alignButton}>
                <Col>
                  <Button
                    className={styles.btnReference}
                    onClick={() => this.setState({ openModal: 'SalaryReference' })}
                  >
                    Salary Reference
                  </Button>
                </Col>
              </Row>
            </Col>
          </Row>
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
                        <div key={item.key} className={styles.salary__left__text}>
                          {item.title}
                        </div>
                      ),
                  )}
                </Col>
                <Col span={12} className={styles.salary__right}>
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
                      return this._renderVaule(item);
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
