/* eslint-disable no-nested-ternary */

import React, { PureComponent } from 'react';
import { Checkbox, Typography, Row } from 'antd';
import styles from './index.less';

class IndiaEmployeeComponent extends PureComponent {
  render() {
    const {
      IndiaEmployeesCheckbox,
      headerText,
      onChange,
      handleChange,
      handleCheckAll,
      benefits,
    } = this.props;
    const { paytmWallet } = benefits;

    const { employeeProvident, listSelectedEmployee } = benefits;
    const { name, checkBox } = IndiaEmployeesCheckbox;

    const CheckboxGroup = Checkbox.Group;
    return (
      <div className={styles.IndiaEmployeeComponent}>
        <Typography.Title level={5} className={styles.headerPadding}>
          {name}
        </Typography.Title>
        {checkBox.map((item) =>
          item.subCheckBox.length > 1 ? (
            <div className={styles.checkBoxHeader}>
              <Checkbox
                className={
                  item.value === 'Paytm Wallet' ? styles.checkboxMedical : styles.checkBoxHeaderTop
                }
                onChange={(e) => handleCheckAll(e, item.subCheckBox, item.title)}
                checked={item.title === 'employeeProvident' ? employeeProvident : null}
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
                  value={item.title === 'employeeProvident' ? listSelectedEmployee : []}
                />
              </div>
            </div>
          ) : (
            <div className={styles.paddingLeft}>
              <Typography.Paragraph className={styles.checkBoxTitle}>
                {item.value}
              </Typography.Paragraph>
              <Typography.Title className={styles.headerText} level={4}>
                {headerText}
              </Typography.Title>
              {item.subCheckBox.map((data) => (
                <Row>
                  <Checkbox onChange={onChange} checked={paytmWallet} value={item.value}>
                    <Typography.Text className={styles.subCheckboxTitle}>
                      {data.value}
                    </Typography.Text>
                  </Checkbox>
                </Row>
              ))}
            </div>
          ),
        )}
      </div>
    );
  }
}

export default IndiaEmployeeComponent;
