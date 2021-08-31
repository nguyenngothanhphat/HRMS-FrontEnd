/* eslint-disable no-nested-ternary */

import React, { PureComponent } from 'react';
import { Checkbox, Typography, Row } from 'antd';
import styles from './index.less';

class IndiaEmployeeComponent extends PureComponent {
  render() {
    const { IndiaEmployeesCheckbox, headerText, onChange, handleChange, handleCheckAll, benefits } =
      this.props;

    const { employeeProvident, paytmWallet, listSelectedEmployee, listSelectedPaytmWallet } =
      benefits;
    const { name, checkBox } = IndiaEmployeesCheckbox;
    // console.log('checkBox', checkBox);

    const CheckboxGroup = Checkbox.Group;
    return (
      <div className={styles.IndiaEmployeeComponent}>
        <Typography.Title level={5} className={styles.headerPadding}>
          {name}
        </Typography.Title>
        {checkBox.map((item) => (
          <div className={styles.checkBoxHeader}>
            <Checkbox
              className={
                item.value === 'Paytm Wallet' ? styles.checkboxMedical : styles.checkBoxHeaderTop
              }
              name={item}
              onChange={(e) => handleCheckAll(e, item.subCheckBox, item.title)}
              checked={item.title === 'employeeProvident' ? employeeProvident : paytmWallet}
            >
              <Typography.Text className={styles.checkBoxTitle}>{item.value}</Typography.Text>
            </Checkbox>
            <div className={styles.paddingLeft}>
              <Typography.Title className={styles.headerText} level={4}>
                {headerText}
              </Typography.Title>
              <CheckboxGroup
                options={item.subCheckBox.map((data) => data.value)}
                onChange={(e) => handleChange(e, item.subCheckBox, item.title)}
                value={
                  item.title === 'employeeProvident'
                    ? listSelectedEmployee
                    : listSelectedPaytmWallet
                }
              />
            </div>
          </div>
        ))}
      </div>
    );
  }
}

export default IndiaEmployeeComponent;
