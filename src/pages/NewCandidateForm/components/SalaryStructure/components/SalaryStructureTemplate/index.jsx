/* eslint-disable react/jsx-props-no-spreading */
import { Button, Col, Input, Row, Slider, Space, Spin } from 'antd';
import { toNumber, toString, trim, trimStart } from 'lodash';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { connect, history } from 'umi';
import { NEW_PROCESS_STATUS, ONBOARDING_FORM_LINK } from '@/utils/onboarding';
import { getCurrentTenant } from '@/utils/authority';
import RenderAddQuestion from '@/components/Question/RenderAddQuestion';
import { Page } from '../../../../utils';
import styles from './index.less';
import ModalWaitAccept from './ModalWaitAccept/index';
import SalaryReference from './SalaryReference/index';

const SalaryStructureTemplate = (props) => {
  const {
    loadingFetchTable = false,
    newCandidateForm: {
      currentStep,
      isEditingSalary = false,
      data: {
        title = {},
        grade = {},
        department = {},
        workLocation = {},
        processStatus = '',
        salaryStructure: {
          settings: settingsOriginData = [],
          status: salaryAcceptanceStatus = '',
        } = {},
        _id: candidateId = '',
      } = {},
      tempData: {
        salaryStructure: { salaryTemplate: salaryTempData, settings: settingsTempData = [] } = {},
        ticketID = '',
      } = {},
    },
    dispatch,
    loadingEditSalary = false,
  } = props;

  const {
    country: salaryCountry = '',
    base_salary: { minimum = 0, maximum = 0 } = {},
    settings: salaryTempDataSetting = [],
  } = salaryTempData || {};

  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    dispatch({
      type: 'newCandidateForm/fetchTableData',
      payload: {
        grade: grade._id,
        location: workLocation?._id,
        getSetting: !!(settingsTempData.length === 0),
      },
    });

    dispatch({
      type: 'newCandidateForm/saveCheckMandatory',
      payload: {
        filledSalaryStructure: true,
      },
    });
  }, []);

  const onClickPrev = () => {
    history.push(`/onboarding/list/view/${ticketID}/${ONBOARDING_FORM_LINK.DOCUMENT_VERIFICATION}`);
  };

  const onClickNext = () => {
    if (currentStep === 3) {
      if (
        processStatus === NEW_PROCESS_STATUS.SALARY_NEGOTIATION &&
        salaryAcceptanceStatus !== 'ACCEPTED'
      ) {
        dispatch({
          type: 'newCandidateForm/updateByHR',
          payload: {
            salaryStructure: {
              settings: settingsTempData,
              status: 'IN-PROGRESS',
            },
            candidate: candidateId,
            sentDate: moment(),
            tenantId: getCurrentTenant(),
          },
        }).then(({ statusCode }) => {
          if (statusCode === 200) {
            setOpenModal('ModalWaitAccept');
          }
        });
      } else {
        dispatch({
          type: 'newCandidateForm/updateByHR',
          payload: {
            currentStep: 4,
            candidate: candidateId,
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
      history.push(`/onboarding/list/view/${ticketID}/benefits`);
    }
  };

  const handleEditSalary = (value) => {
    dispatch({
      type: 'newCandidateForm/save',
      payload: { isEditingSalary: value },
    });
  };

  const onCancel = async () => {
    await dispatch({
      type: 'newCandidateForm/saveSalaryStructure',
      payload: { settings: settingsOriginData },
    });

    handleEditSalary(false);
  };

  const onClickSubmit = () => {
    handleEditSalary(false);
  };

  const checkKey = (key) => {
    return settingsTempData.some((x) => x.key === key);
  };

  const getValueByKey = (arr, key) => {
    return arr.find((x) => x.key === key)?.value;
  };

  const onChangeSilde = (value = [], key) => {
    if (value.length === 2) {
      const newValue = value[1];
      const tempTableData = JSON.parse(JSON.stringify(settingsTempData));

      const index = tempTableData.findIndex((x) => x.key === key);
      tempTableData[index].value = newValue;
      dispatch({
        type: 'newCandidateForm/saveSalaryStructure',
        payload: {
          settings: tempTableData,
        },
      });
    }
  };

  const handleChange = (e, key) => {
    const { value } = e.target;
    let newValue = value.replace(/,/g, '');

    const reg = /^\d*(\.\d*)?$/;

    if (reg.test(newValue) || newValue === '') {
      if (key === 'basic' && toNumber(newValue) > maximum) newValue = maximum;
      if (
        (key === 'lunch_allowance' ||
          key === 'petrol_allowance' ||
          key === 'mobile_internet_allowance') &&
        toNumber(newValue) > getValueByKey(salaryTempDataSetting, key)
      ) {
        newValue = getValueByKey(salaryTempDataSetting, key);
      }

      const tempTableData = JSON.parse(JSON.stringify(settingsTempData));

      const index = tempTableData.findIndex((x) => x.key === key);
      tempTableData[index].value = newValue;
      dispatch({
        type: 'newCandidateForm/saveSalaryStructure',
        payload: {
          settings: tempTableData,
        },
      });
    }
  };

  const calculationForIndia = (e, key) => {
    const { value } = e.target;
    const newValue = value.replace(/,/g, '');
    console.log('🚀 ~ newValue', newValue);
  };

  const onBlur = (e, key) => {
    const { value } = e.target;
    let newValue = value.replace(/,/g, '');

    const reg = /^\d*(\.\d*)?$/;

    if (reg.test(newValue) || newValue === '') {
      if (key === 'basic' && toNumber(newValue) < minimum) newValue = minimum;

      const tempTableData = JSON.parse(JSON.stringify(settingsTempData));

      const index = tempTableData.findIndex((x) => x.key === key);
      tempTableData[index].value = toNumber(newValue);
      const indexBasic = tempTableData.findIndex((x) => x.key === 'basic');
      const basic = tempTableData[indexBasic].value;
      let sum = 0;
      tempTableData.forEach((item) => {
        if (item.operator) {
          const { value: valueSalary } = item;
          if (item.unit === '%') sum += basic * (valueSalary / 100);
          else sum += valueSalary;
        }
      });
      const indexTotal = tempTableData.findIndex((x) => x.key === 'total_compensation');
      tempTableData[indexTotal].value = Math.round(sum);
      dispatch({
        type: 'newCandidateForm/saveSalaryStructure',
        payload: {
          settings: tempTableData,
        },
      });
    }
  };

  const formatNumber = (value) => {
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

  const renderSingle = (value, unit) => {
    if (!value) return '0';
    if (unit !== '%') return `${unit} ${formatNumber(value)}`;
    return (
      <div>
        {value}
        <span className={styles.ofBasic}> % of Basics</span>
      </div>
    );
  };

  const convertValue = (value) => {
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

  const convertVeriable = (value) => {
    const str = toString(value);
    const list = str.split('.');
    list[0] = list[0] !== '0' && list[0] !== '' ? trimStart(list[0], '0') : '0';
    return list.join('.');
  };

  const _renderValue = (item = {}) => {
    const marks = {};
    if (!isEditingSalary)
      return (
        <div key={item.key} className={styles.salary__right__text}>
          {renderSingle(item.value, item.unit)}
        </div>
      );
    if (item.unit === '%')
      return (
        <div key={item.key} className={styles.salary__right__inputAfter}>
          <Input
            addonAfter="% of Basics"
            value={convertVeriable(item.value)}
            onChange={(e) => handleChange(e, item.key)}
            onBlur={(e) => onBlur(e, item.key)}
          />
        </div>
      );
    if (salaryCountry === 'VN') {
      if (item.key === 'basic') {
        marks[minimum] = `VND ${convertValue(minimum)}`;
        marks[maximum] = `VND ${convertValue(maximum)}`;
        return (
          <>
            <div key={item.key} className={styles.inputBefore}>
              <Input
                addonBefore={item.unit}
                value={convertValue(item.value)}
                onChange={(e) => handleChange(e, item.key)}
                onBlur={(e) => onBlur(e, item.key)}
              />
            </div>
            <div>
              <Slider
                range
                min={minimum}
                max={maximum}
                tipFormatter={convertValue}
                step={1000}
                marks={marks}
                value={[minimum, getValueByKey(settingsTempData, item.key)]}
                onChange={(value) => onChangeSilde(value, item.key)}
              />
            </div>
          </>
        );
      }
      const maxValue = getValueByKey(salaryTempDataSetting, item.key);
      marks[0] = 'VND 0';
      marks[maxValue] = `VND ${convertValue(maxValue)}`;
      return (
        <>
          <div key={item.key} className={styles.inputBefore}>
            <Input
              addonBefore={item.unit}
              value={convertValue(item.value)}
              onChange={(e) => handleChange(e, item.key)}
              onBlur={(e) => onBlur(e, item.key)}
            />
          </div>
          <div>
            <Slider
              range
              min={0}
              max={maxValue}
              tipFormatter={convertValue}
              step={1000}
              marks={marks}
              value={[0, getValueByKey(settingsTempData, item.key)]}
              onChange={(value) => onChangeSilde(value, item.key)}
            />
          </div>
        </>
      );
    }
    return (
      <div key={item.key} className={styles.inputBefore}>
        <Input
          addonBefore={item.unit}
          value={convertValue(item.value)}
          onChange={(e) => handleChange(e, item.key)}
          onBlur={(e) => onBlur(e, item.key)}
        />
      </div>
    );
  };

  const _renderBottomBar = () => {
    return (
      <div className={styles.bottomBar}>
        {isEditingSalary ? (
          <div className={styles.bottomBar__button} span={24}>
            <Space size={24}>
              <Button
                type="secondary"
                onClick={onCancel}
                className={styles.bottomBar__button__secondary}
              >
                Cancel
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                onClick={onClickSubmit}
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
                onClick={onClickPrev}
                className={styles.bottomBar__button__secondary}
              >
                Previous
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                onClick={onClickNext}
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

  const _renderSalaryTable = () => {
    return (
      <div className={styles.salaryStructureTemplate_table}>
        <Row className={styles.salary}>
          <Col span={12} className={styles.salary__left}>
            {settingsTempData.map(
              (item) =>
                item.key !== 'total_compensation' && (
                  <div
                    key={item.key}
                    className={
                      isEditingSalary &&
                      salaryCountry === 'VN' &&
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
              isEditingSalary && salaryCountry === 'VN'
                ? styles.salary__right && styles.salary__right__VN
                : styles.salary__right
            }
          >
            {settingsTempData.map((item) => {
              if (item.key !== 'total_compensation') {
                if (item.key === 'salary_13')
                  return (
                    <div key={item.key} className={styles.salary__right__text}>
                      {item.value !== 0
                        ? renderSingle(item.value, item.unit)
                        : '(Basic/12) x The number of months work'}
                    </div>
                  );
                return _renderValue(item);
              }
              return '';
            })}
          </Col>
        </Row>
        <Row className={styles.salaryTotal}>
          <Col span={12} className={styles.salaryTotal__left}>
            {settingsTempData.map(
              (item) =>
                item.key === 'total_compensation' && (
                  <div key={item.key} className={styles.salaryTotal__left__text}>
                    {item.title}
                  </div>
                ),
            )}
          </Col>
          <Col span={12} className={styles.salaryTotal__right}>
            {settingsTempData.map(
              (item) =>
                item.key === 'total_compensation' && (
                  <div key={item.key} className={styles.salaryTotal__right__text}>
                    {renderSingle(item.value, item.unit)}
                  </div>
                ),
            )}
          </Col>
        </Row>
      </div>
    );
  };

  const _renderIndiaSalaryTable = () => {
    const annualTotal = salaryTempDataSetting.find((x) => x.key === 'total_compensation') || {};
    return (
      <div className={styles.indiaContainer}>
        <div className={styles.inputs}>
          <Row gutter={[16, 16]} align="middle">
            <Col span={10}>
              <span>Employee Eligible for Variable Pay</span>
            </Col>
            <Col span={8}>
              <div className={styles.salary__right__inputAfter}>
                <Input addonAfter="% of basics" disabled={!isEditingSalary} />
              </div>
            </Col>
            <Col span={6} />

            <Col span={10}>
              <span>Employee One Time Annual Retention Bonus</span>
            </Col>
            <Col span={8}>
              <div className={styles.inputBefore}>
                <Input addonBefore="INR" disabled={!isEditingSalary} />
              </div>
            </Col>
            <Col span={6} />
          </Row>
        </div>

        <div className={styles.tableBody}>
          <div className={styles.content}>
            <div className={styles.leftSide} style={{ border: 'none' }}>
              <span className={styles.title}>Annual Total Compensation</span>
            </div>

            <div className={styles.rightSide}>
              {isEditingSalary ? (
                <div className={styles.inputBefore}>
                  <Input
                    addonBefore="INR"
                    value={convertVeriable(annualTotal.value)}
                    onChange={(e) => calculationForIndia(e, annualTotal.key)}
                  />
                </div>
              ) : (
                <span className={styles.value}>
                  {renderSingle(annualTotal.value, annualTotal.unit)}
                </span>
              )}
            </div>
          </div>

          <div className={styles.content}>
            <div className={styles.leftSide}>
              {settingsTempData.map((x) => (
                <span className={styles.itemTitle}>{x.title}</span>
              ))}
            </div>
            <div className={styles.rightSide}>
              {settingsTempData.map((x) => (
                <span className={styles.itemValue} key={x.key}>
                  {renderSingle(x.value, x.unit)}
                </span>
              ))}
            </div>
          </div>

          <div className={styles.content} style={{ border: 'none' }}>
            <div className={styles.leftSide}>
              <span className={styles.title}>Total Cost to Company</span>
            </div>
            <div className={styles.rightSide}>
              <span className={styles.value}>INR 6,00,000</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

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
      {checkKey('lunch_allowance') && (
        <Row className={styles.noteAllowance}>Allowances value as per month</Row>
      )}

      <Spin spinning={loadingFetchTable}>
        {salaryCountry !== 'IN' ? _renderSalaryTable() : _renderIndiaSalaryTable()}
      </Spin>

      {_renderBottomBar()}

      <SalaryReference
        openModal={openModal === 'SalaryReference'}
        onCancel={() => setOpenModal('')}
      />
      <ModalWaitAccept
        openModal={openModal === 'ModalWaitAccept'}
        onCancel={() => setOpenModal('')}
      />
    </div>
  );
};

export default connect(({ loading, newCandidateForm, user }) => ({
  loadingTable: loading.effects['newCandidateForm/saveSalaryStructure'],
  loadingFetchTable: loading.effects['newCandidateForm/fetchTableData'],
  loadingEditSalary: loading.effects['newCandidateForm/updateByHR'],
  user,
  newCandidateForm,
}))(SalaryStructureTemplate);
