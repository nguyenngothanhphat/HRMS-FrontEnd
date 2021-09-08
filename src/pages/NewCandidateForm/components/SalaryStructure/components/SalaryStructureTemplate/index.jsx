/* eslint-disable react/jsx-props-no-spreading */
import React, { PureComponent } from 'react';
import { Button, Input, Row, Col, Spin } from 'antd';
import { formatMessage, connect, history } from 'umi';
import { getCurrentTenant } from '@/utils/authority';
import RenderAddQuestion from '@/components/Question/RenderAddQuestion';
import { NEW_PROCESS_STATUS } from '@/utils/onboarding';
import { trim, trimStart, toString, toNumber } from 'lodash';
import editIcon from './assets/editIcon.png';
import styles from './index.less';
import { Page } from '../../../../utils';
import SalaryReference from './SalaryReference/index';
import ModalWaitAccept from './ModalWaitAccept/index';

@connect(
  ({
    loading,
    newCandidateForm: {
      cancelCandidate,
      checkMandatory = {},
      currentStep = {},
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
  }),
)
class SalaryStructureTemplate extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      openModal: '',
      isEdited: false,
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
    history.push(`/onboarding/list/view/${ticketID}/job-details`);
  };

  onClickNext = () => {
    const {
      dispatch,
      settingsTempData: settings = [],
      data: { _id, processStatus },
    } = this.props;
    if (processStatus === NEW_PROCESS_STATUS.SALARY_NEGOTIATION) {
      dispatch({
        type: 'newCandidateForm/updateByHR',
        payload: {
          salaryStructure: {
            settings,
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
      history.push(`/onboarding/list/view/${ticketID}/benefits`);
    }
  };

  onClickEdit = () => {
    const { isEdited } = this.state;
    this.setState({
      isEdited: !isEdited,
    });
  };

  onCancel = async () => {
    const { dispatch, settingsOriginData: settings = [] } = this.props;
    await dispatch({
      type: 'newCandidateForm/saveSalaryStructure',
      payload: { settings },
    });

    this.setState({
      isEdited: false,
    });
  };

  onClickSubmit = () => {
    const { isEdited } = this.state;
    this.setState({
      isEdited: !isEdited,
    });
  };

  handleChange = (e, key) => {
    const { dispatch, settingsTempData: settings = [] } = this.props;

    const { value } = e.target;
    const newValue = value.replace(/,/g, '');

    const reg = /^\d*(\.\d*)?$/;

    if (reg.test(newValue) || newValue === '') {
      const tempTableData = [...settings];

      const index = tempTableData.findIndex((data) => data.key === key);
      tempTableData[index].value = toNumber(newValue);
      let sum = 0;
      tempTableData.forEach((item) => {
        if (item.key !== 'total_compensation') {
          if (item.unit === '%') sum += (sum * item.value) / 100;
          else sum += item.value;
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

  _renderButtons = () => {
    const { isEdited } = this.state;
    const { processStatus } = this.props;
    if (
      processStatus === NEW_PROCESS_STATUS.DRAFT ||
      processStatus === NEW_PROCESS_STATUS.PROFILE_VERIFICATION ||
      processStatus === NEW_PROCESS_STATUS.DOCUMENT_VERIFICATION ||
      processStatus === NEW_PROCESS_STATUS.SALARY_NEGOTIATION
    ) {
      return (
        <div className={styles.buttons}>
          {!isEdited && (
            <Button type="primary" onClick={() => this.onClickEdit('edit')}>
              <img src={editIcon} alt="icon" />{' '}
              {formatMessage({ id: 'component.salaryStructureTemplate.edit' })}
            </Button>
          )}
        </div>
      );
    }
    return <div />;
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
    const { isEdited } = this.state;

    if (!isEdited)
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
          />
        </div>
      );
    return (
      <div key={item.key} className={styles.salary__right__inputBefore}>
        <Input
          addonBefore={item.unit}
          value={this.convertValue(item.value)}
          onChange={(e) => this.handleChange(e, item.key)}
        />
      </div>
    );
  };

  _renderStatus = () => {
    const { checkMandatory } = this.props;
    const { filledSalaryStructure } = checkMandatory;
    return !filledSalaryStructure ? (
      <div className={styles.normalText}>
        <div className={styles.redText}>*</div>
        {formatMessage({ id: 'component.bottomBar.mandatoryUnfilled' })}
      </div>
    ) : (
      <div className={styles.greenText}>
        * {formatMessage({ id: 'component.bottomBar.mandatoryFilled' })}
      </div>
    );
  };

  _renderBottomBar = () => {
    const { processStatus } = this.props;
    const { isEdited } = this.state;
    return (
      <div className={styles.bottomBar}>
        <Row align="middle">
          <Col span={16}>
            <div className={styles.bottomBar__status}>
              {processStatus === 'DRAFT' ? this._renderStatus() : null}
            </div>
          </Col>
          {isEdited ? (
            <Col className={styles.bottomBar__button} span={8}>
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
            </Col>
          ) : (
            <Col className={styles.bottomBar__button} span={8}>
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
              >
                Next
              </Button>
            </Col>
          )}
        </Row>
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
            {this._renderButtons()}
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
                            (Basic/12) x The number of months work
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
              <RenderAddQuestion page={Page.Salary_Structure} />
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
