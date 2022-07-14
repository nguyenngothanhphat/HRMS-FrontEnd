/* eslint-disable no-nested-ternary */

import React, { PureComponent } from 'react';
import { Checkbox, Typography, Row } from 'antd';
import moment from 'moment';

import styles from './index.less';

class LocalEmployeeComponent extends PureComponent {
  getCreateBenefitAt = (category) => {
    const { listBenefits = [] } = this.props;
    let createdAt = '';

    listBenefits.forEach((item) => {
      if (item.category === category) {
        createdAt = item.createdAt;
      }
    });

    if (createdAt === '') return '';

    createdAt = moment(createdAt).locale('en').format('DD/MM/YYYY');
    return createdAt ? (
      <div className={styles.headerText}>Coverage will take effect on {createdAt}</div>
    ) : (
      ''
    );
  };

  isSubCheckBox = (list) => {
    let check = false;
    list.forEach((item) => {
      if (item.subCheckBox.length > 0) check = true;
    });
    return check;
  };

  render() {
    const { IndiaEmployeesCheckbox, onChange, handleChange, handleCheckAll, benefits } = this.props;

    const { employeeProvident, paytmWallet, listSelectedEmployee, listSelectedPaytmWallet } =
      benefits;
    const { checkBox } = IndiaEmployeesCheckbox;

    const CheckboxGroup = Checkbox.Group;
    return (
      <div className={styles.LocalEmployeeComponent}>
        {this.isSubCheckBox(checkBox) &&
          checkBox.map(
            (item) =>
              item.subCheckBox.length > 0 && (
                <div className={styles.checkBoxHeader}>
                  <Checkbox
                    className={
                      item.value === 'Paytm Wallet'
                        ? styles.checkboxMedical
                        : styles.checkBoxHeaderTop
                    }
                    name={item}
                    onChange={(e) => handleCheckAll(e, item.subCheckBox, item.title)}
                    checked={item.title === 'employeeProvident' ? employeeProvident : paytmWallet}
                  >
                    <Typography.Text className={styles.checkBoxTitle}>{item.value}</Typography.Text>
                  </Checkbox>
                  {/* <Typography.Text className={styles.checkBoxTitle}>{item.value}</Typography.Text> */}
                  {this.getCreateBenefitAt(item.title)}
                  <div className={styles.paddingLeft}>
                    {this.getCreateBenefitAt(item.title)}
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
              ),
          )}
      </div>
    );
  }
}

export default LocalEmployeeComponent;
