/* eslint-disable camelcase */
/* eslint-disable react/jsx-props-no-spreading */
import { Button, Col, Input, Row, Slider, Space, Spin } from 'antd';
import { toNumber, toString, trim, trimStart, isEmpty } from 'lodash';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { connect, history } from 'umi';
import { roundNumber2, SALARY_STRUCTURE_OPTION } from '@/utils/onboardingSetting';
import { NEW_PROCESS_STATUS, ONBOARDING_FORM_LINK, ONBOARDING_STEPS } from '@/utils/onboarding';
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
        salaryStructure: { salaryTemplate = {}, settings: settingsTempData = [] } = {},
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
    option = '',
  } = salaryTemplate || {};

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
    history.push(`/onboarding/list/view/${ticketID}/${ONBOARDING_FORM_LINK.REFERENCES}`);
  };

  const onClickNext = () => {
    if (currentStep === ONBOARDING_STEPS.SALARY_STRUCTURE) {
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
            currentStep: ONBOARDING_STEPS.BENEFITS,
            candidate: candidateId,
          },
        });
        dispatch({
          type: 'newCandidateForm/save',
          payload: {
            currentStep: ONBOARDING_STEPS.BENEFITS,
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

  const onChangeSlide = (value = [], key) => {
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
      // if (
      //   (key === 'lunch_allowance' ||
      //     key === 'petrol_allowance' ||
      //     key === 'mobile_internet_allowance') &&
      //   toNumber(newValue) > getValueByKey(salaryTempDataSetting, key)
      // ) {
      //   newValue = getValueByKey(salaryTempDataSetting, key);
      // }

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
    const reg = /^\d*(\.\d*)?$/;
    const tempTableData = JSON.parse(JSON.stringify(settingsTempData));
    const newValue = value.replace(/,/g, '');

    let total_compensation = 0;

    // step 0
    let variable_pay_percentage = 0;
    let retention_bonus_amount = 0;
    let joining_bonus_amount = 0;
    let midterm_hike_amount = 0;
    if (key !== 'total_compensation') {
      total_compensation = tempTableData.find((x) => x.key === 'total_compensation')?.value;
    } else {
      total_compensation = newValue * 1;
    }

    if (key === 'eligible_variable_pay') {
      variable_pay_percentage = newValue * 1;
    } else {
      variable_pay_percentage = tempTableData.find((x) => x.key === 'eligible_variable_pay')?.value;
    }

    if (key === 'annual_retention_bonus') {
      retention_bonus_amount = newValue * 1;
    } else {
      retention_bonus_amount = tempTableData.find((x) => x.key === 'annual_retention_bonus')?.value;
    }

    if (key === 'joining_bonus') {
      joining_bonus_amount = newValue * 1;
    } else {
      joining_bonus_amount = tempTableData.find((x) => x.key === 'joining_bonus')?.value;
    }

    if (key === 'midterm_hike') {
      midterm_hike_amount = newValue * 1;
    } else {
      midterm_hike_amount = tempTableData.find((x) => x.key === 'midterm_hike')?.value;
    }

    if (reg.test(total_compensation)) {
      // step 2
      let variable_pay_amount = 0;
      let total_compensation_minus_variable_pay_amount = 0;
      if (variable_pay_percentage !== 0 && variable_pay_percentage !== '0') {
        variable_pay_amount = total_compensation * (variable_pay_percentage / 100);
        total_compensation_minus_variable_pay_amount =
          total_compensation * (1 - variable_pay_percentage / 100);
      } else {
        variable_pay_amount = 0;
        total_compensation_minus_variable_pay_amount = total_compensation;
      }

      variable_pay_amount = roundNumber2(variable_pay_amount);
      total_compensation_minus_variable_pay_amount = roundNumber2(
        total_compensation_minus_variable_pay_amount,
      );

      // step 3
      let pf = 0;
      if ((total_compensation_minus_variable_pay_amount / 12) * 0.65 < 15000) {
        pf = (total_compensation_minus_variable_pay_amount / 12) * 0.65 * 0.12 * 12;
      } else {
        pf = 15000 * 0.12 * 12;
      }
      pf = roundNumber2(pf);

      const total_compensation_minus_variable_pay_minus_pf_amount =
        total_compensation_minus_variable_pay_amount - pf;

      const final = roundNumber2(total_compensation_minus_variable_pay_minus_pf_amount);

      // step 4
      const basic = roundNumber2(final * 0.5);

      // step 5
      const hra = roundNumber2(basic / 2);

      // step 6
      const total_other_allowances = roundNumber2(final - (basic + hra));

      // step 7
      const variable_pay = variable_pay_amount;

      // step 8
      const PF = pf;

      // step 9
      const insurance = 7382;

      // step 10
      const gratuity = roundNumber2(basic / 12 / 2);

      const total_cost_company = roundNumber2(
        basic +
          hra +
          total_other_allowances +
          variable_pay +
          PF +
          insurance +
          gratuity +
          retention_bonus_amount,
      );

      const objValues = {
        eligible_variable_pay: variable_pay_percentage,
        annual_retention_bonus: retention_bonus_amount,
        joining_bonus: joining_bonus_amount,
        midterm_hike: midterm_hike_amount,
        variable_pay,
        retention_bonus: retention_bonus_amount,
        PF,
        basic,
        hra,
        total_other_allowances,
        gratuity,
        insurance,
        total_cost_company,
        total_compensation,
      };

      const objKeys = Object.keys(objValues);
      const result = tempTableData.map((x) => {
        const findIndex = objKeys.findIndex((y) => y === x.key);
        return {
          ...x,
          value: objValues[objKeys[findIndex]],
        };
      });

      dispatch({
        type: 'newCandidateForm/saveSalaryStructure',
        payload: {
          settings: [...result],
        },
      });
    }
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

  const convertVariable = (value) => {
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
            value={convertVariable(item.value)}
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
                onChange={(value) => onChangeSlide(value, item.key)}
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
              onChange={(value) => onChangeSlide(value, item.key)}
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

  const _renderCommonSalaryTable = () => {
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

  const _renderTotalSalaryTable = () => {
    const annualTotal = settingsTempData.find((x) => x.key === 'total_compensation') || {};
    const final = settingsTempData.find((x) => x.key === 'total_cost_company') || {};
    const eligible_variable_pay =
      settingsTempData.find((x) => x.key === 'eligible_variable_pay') || {};
    const annual_retention_bonus =
      settingsTempData.find((x) => x.key === 'annual_retention_bonus') || {};
    const joining_bonus = settingsTempData.find((x) => x.key === 'joining_bonus') || {};
    const midterm_hike = settingsTempData.find((x) => x.key === 'midterm_hike') || {};
    const isJoiningBonus = !isEmpty(joining_bonus) ? joining_bonus.value !== 0 : false;
    const isMidtermHike = !isEmpty(midterm_hike) ? midterm_hike.value !== 0 : false;

    const salaryFields = settingsTempData.filter(
      (x) =>
        ![
          'total_cost_company',
          'total_compensation',
          'eligible_variable_pay',
          'annual_retention_bonus',
          'joining_bonus',
          'midterm_hike',
        ].includes(x.key),
    );

    return (
      <>
        <div className={styles.indiaContainer}>
          <div className={styles.inputs}>
            <Row gutter={[16, 16]} align="middle">
              <Col span={10}>
                <span>Employee Variable Pay Target %</span>
              </Col>
              <Col span={8}>
                <div className={styles.salary__right__inputAfter}>
                  <Input
                    addonAfter="% of basics"
                    disabled={!isEditingSalary}
                    defaultValue={convertVariable(eligible_variable_pay.value)}
                    onChange={(e) => calculationForIndia(e, eligible_variable_pay.key)}
                  />
                </div>
              </Col>
              <Col span={6} />

              <Col span={10}>
                <span>Employee One Time Annual Premium Bonus</span>
              </Col>
              <Col span={8}>
                <div className={styles.inputBefore}>
                  <Input
                    addonBefore="INR"
                    disabled={!isEditingSalary}
                    defaultValue={convertVariable(annual_retention_bonus.value)}
                    onChange={(e) => calculationForIndia(e, annual_retention_bonus.key)}
                  />
                </div>
              </Col>
              <Col span={6} />

              <Col span={10}>
                <span>Employee One Time Annual Joining Bonus</span>
              </Col>
              <Col span={8}>
                <div className={styles.inputBefore}>
                  <Input
                    addonBefore="INR"
                    disabled={!isEditingSalary}
                    defaultValue={convertVariable(joining_bonus.value)}
                    onChange={(e) => calculationForIndia(e, joining_bonus.key)}
                  />
                </div>
              </Col>
              <Col span={6} />

              <Col span={10}>
                <span>Employee One Time Mid Term Hike</span>
              </Col>
              <Col span={8}>
                <div className={styles.inputBefore}>
                  <Input
                    addonBefore="INR"
                    disabled={!isEditingSalary}
                    defaultValue={convertVariable(midterm_hike.value)}
                    onChange={(e) => calculationForIndia(e, midterm_hike.key)}
                  />
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
                      defaultValue={convertVariable(annualTotal.value)}
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
                {salaryFields.map((x) => (
                  <span className={styles.itemTitle}>{x.title}</span>
                ))}
              </div>
              <div className={styles.rightSide}>
                {salaryFields.map((x) => (
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
                <span className={styles.value}>{renderSingle(final.value, final.unit)}</span>
              </div>
            </div>
          </div>
        </div>
        {(isJoiningBonus || isMidtermHike) && (
          <div className={styles.containerNote}>
            Note-
            {isJoiningBonus && (
              <div className={styles.noteField}>
                1. As a part of this offer the candidate shall be entitled to a Joining Bonus of INR{' '}
                {convertValue(joining_bonus.value)}. Post Joining 50% of this amount shall be paid
                along with the second month&apos;s salary (or the applicable first payroll). And on
                completion of three months of service the balance 50% shall be paid along with the
                immediate next payroll.
              </div>
            )}
            {isMidtermHike && (
              <div className={styles.noteField}>
                2. As a part of this offer the candidate shall be entitled to a one time Mid Term
                Hike of INR {convertValue(midterm_hike.value)}. Upon completion of 6 months duration
                of employment with full standing and meeting the Project and Management
                expectations.
              </div>
            )}
          </div>
        )}
      </>
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
        {option === SALARY_STRUCTURE_OPTION.TOTAL_COMPENSATION
          ? _renderTotalSalaryTable()
          : _renderCommonSalaryTable()}
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
