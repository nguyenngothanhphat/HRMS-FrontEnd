import { Modal, Button, Input, Checkbox } from 'antd';
import React, { useState, useEffect } from 'react';
import { formatMessage, connect } from 'umi';
import { toNumber, toString, trimStart, filter } from 'lodash';
import styles from './index.less';

const EditSalaryVN = (props) => {
  const { visible, onCancel, onOk, salaryId, dispatch, salaryData, loadingData } = props;
  const [baseSalary, setBaseSalary] = useState({ minimum: 0, maximum: 0 });
  // const [allowancesRange, setAllowancesRange] = useState({ minimum: 0, maximum: 0 });
  const [variablePay, setVariablePay] = useState('0');
  const [totalCompensation, setTotalCompensation] = useState({ minimum: 0, maximum: 0 });
  const [salary13, setSalary13] = useState(false);
  const [allowances, setAllowances] = useState({ lunch: 0, petrol: 0, mobile_internet: 0 });

  useEffect(() => {
    if (salaryId) {
      dispatch({
        type: 'employeeSetting/getSalaryById',
        payload: {
          id: salaryId,
        },
      });
    }
  }, [salaryId]);

  const getValueByKey = (settings, key) => {
    const result = filter(settings, (item) => item.key === key);
    return (result && result[0] && result[0].value) || 0;
  };
  useEffect(() => {
    if (salaryData !== {} && !loadingData) {
      const {
        base_salary: BaseSalary,
        variable_pay_target: VariablePayTarget,
        total_compensation: TotalCompensation,
        settings,
        salary_13th: salary13th,
      } = salaryData;
      setBaseSalary(BaseSalary || 0);
      setTotalCompensation(TotalCompensation || 0);
      setVariablePay(VariablePayTarget || '0');
      setAllowances({
        lunch: getValueByKey(settings, 'lunch_allowance'),
        petrol: getValueByKey(settings, 'petrol_allowance'),
        mobile_internet: getValueByKey(settings, 'mobile_internet_allowance'),
      });
      setSalary13(salary13th);
    }
  }, [loadingData]);

  const onChange = (e, key) => {
    const { value } = e.target;
    const newValue = value.replace(/,/g, '');

    const reg = /^\d*(\.\d*)?$/;

    if (reg.test(newValue) || newValue === '') {
      switch (key) {
        case 'base_salary_min':
          setBaseSalary({ ...baseSalary, minimum: newValue });
          break;
        case 'base_salary_max':
          setBaseSalary({ ...baseSalary, maximum: newValue });
          break;

        case 'lunch':
          setAllowances({ ...allowances, lunch: newValue });
          break;
        case 'petrol':
          setAllowances({ ...allowances, petrol: newValue });
          break;
        case 'mobile_internet':
          setAllowances({ ...allowances, mobile_internet: newValue });
          break;
        case 'variable_pay':
          setVariablePay(newValue);
          break;
        case 'total_compensation_min':
          setTotalCompensation({ ...totalCompensation, minimum: newValue });
          break;
        case 'total_compensation_max':
          setTotalCompensation({ ...totalCompensation, maximum: newValue });
          break;
        default:
          break;
      }
    }
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
  const onSave = () => {
    const data = {
      id: salaryId,
      base_salary: {
        minimum: toNumber(baseSalary.minimum),
        maximum: toNumber(baseSalary.maximum),
      },
      allowances: {
        lunch: toNumber(allowances.lunch),
        petrol: toNumber(allowances.petrol),
        mobile_internet: toNumber(allowances.mobile_internet),
      },
      variable_pay_target: toNumber(variablePay),
      total_compensation: {
        minimum: toNumber(totalCompensation.minimum),
        maximum: toNumber(totalCompensation.maximum),
      },
      salary_13th: salary13,
      option: salaryData.option,
    };
    onOk(data);
  };

  return (
    <Modal
      className={styles.modalCustom}
      visible={visible}
      onCancel={onCancel}
      style={{ top: 50 }}
      destroyOnClose
      title="Add/Edit Salary Range"
      maskClosable={false}
      width={600}
      footer={[
        <div key="cancel" className={styles.btnCancel} onClick={onCancel}>
          {formatMessage({ id: 'employee.button.cancel' })}
        </div>,
        <Button
          key="submit"
          htmlType="submit"
          type="primary"
          onClick={onSave}
          className={styles.btnSubmit}
        >
          Save
        </Button>,
      ]}
    >
      <div className={styles.mainModal}>
        <div className={styles.row}>
          <div className={styles.row__label}>Base Salary Range</div>
          <div className={styles.row__inputGroup}>
            <Input
              addonBefore={salaryData.currency_unit}
              value={convertValue(baseSalary.minimum)}
              onChange={(e) => onChange(e, 'base_salary_min')}
            />
            <div className={styles.row__input__space}>-</div>
            <Input
              addonBefore={salaryData.currency_unit}
              value={convertValue(baseSalary.maximum)}
              onChange={(e) => onChange(e, 'base_salary_max')}
            />
          </div>
        </div>
        <div className={styles.row}>
          <div className={styles.row__label}>Lunch Allowance</div>
          <div className={styles.row__inputSingle}>
            <Input
              addonBefore={salaryData.currency_unit}
              value={convertValue(allowances.lunch)}
              onChange={(e) => onChange(e, 'lunch')}
            />
          </div>
        </div>
        <div className={styles.row}>
          <div className={styles.row__label}>Petrol Allowance</div>
          <div className={styles.row__inputSingle}>
            <Input
              addonBefore={salaryData.currency_unit}
              value={convertValue(allowances.petrol)}
              onChange={(e) => onChange(e, 'petrol')}
            />
          </div>
        </div>
        <div className={styles.row}>
          <div className={styles.row__label}>Mob & Internet Allowance</div>
          <div className={styles.row__inputSingle}>
            <Input
              addonBefore={salaryData.currency_unit}
              value={convertValue(allowances.mobile_internet)}
              onChange={(e) => onChange(e, 'mobile_internet')}
            />
          </div>
        </div>
        <div className={styles.row}>
          <div className={styles.row__label}>Variable Pay Target %</div>
          <div className={styles.row__inputCustom}>
            <Input
              className={styles.inputVariable}
              addonAfter="% of basic"
              value={convertVeriable(variablePay)}
              onChange={(e) => onChange(e, 'variable_pay')}
            />
          </div>
        </div>
        <div className={styles.row}>
          <div className={styles.row__label}>Total Compensation Range</div>
          <div className={styles.row__inputGroup}>
            <Input
              addonBefore={salaryData.currency_unit}
              value={convertValue(totalCompensation.minimum)}
              onChange={(e) => onChange(e, 'total_compensation_min')}
            />
            <div className={styles.row__input__space}>-</div>
            <Input
              addonBefore={salaryData.currency_unit}
              value={convertValue(totalCompensation.maximum)}
              onChange={(e) => onChange(e, 'total_compensation_max')}
            />
          </div>
        </div>
        <div className={styles.row}>
          <Checkbox defaultChecked={salary13} onChange={(e) => setSalary13(e.target.checked)}>
            <span className={styles.row__label}>Eligible for 13th Month Salary</span>
          </Checkbox>
        </div>
      </div>
    </Modal>
  );
};
export default connect(({ loading, employeeSetting: { salaryData = {} } = {} }) => ({
  loadingData: loading.effects['employeeSetting/getSalaryById'],
  salaryData,
}))(EditSalaryVN);
