/* eslint-disable no-nested-ternary */

import React, { PureComponent } from 'react';
import { Checkbox, Typography, Row } from 'antd';
import { connect } from 'umi';
import styles from './index.less';

@connect(({ info: { benefits } = {} }) => ({
  benefits,
}))
class IndiaEmployeeComponent extends PureComponent {
  static getDerivedStateFromProps(props) {
    if ('benefits' in props) {
      return { benefits: props.benefits || {} };
    }
    return null;
  }

  onChange = (e) => {
    const { target } = e;
    const { value } = target;
    const { benefits } = this.state;
    const { paytmWallet } = benefits;
    const { dispatch } = this.props;
    if (value === 'Paytm Wallet') {
      dispatch({
        type: 'info/saveBenefits',
        payload: {
          benefits: {
            ...benefits,
            paytmWallet: !paytmWallet,
          },
        },
      });
    }
  };

  handleChange = (checkedList, arr, title) => {
    const { benefits } = this.state;
    const { dispatch } = this.props;
    if (title === 'employeeProvident') {
      dispatch({
        type: 'info/saveBenefits',
        payload: {
          benefits: {
            ...benefits,
            listSelectedEmployee: checkedList,
            employeeProvident: checkedList.length === arr.length,
          },
        },
      });
    }
  };

  handleCheckAll = (e, arr, title) => {
    const { benefits } = this.state;
    const { dispatch } = this.props;
    if (title === 'employeeProvident') {
      dispatch({
        type: 'info/saveBenefits',
        payload: {
          benefits: {
            ...benefits,
            listSelectedEmployee: e.target.checked ? arr.map((data) => data.value) : [],
            employeeProvident: e.target.checked,
          },
        },
      });
    }
  };

  render() {
    const { IndiaEmployeesCheckbox, headerText } = this.props;
    const { benefits } = this.state;
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
                onChange={(e) => this.handleCheckAll(e, item.subCheckBox, item.title)}
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
                  onChange={(e) => this.handleChange(e, item.subCheckBox, item.title)}
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
                  <Checkbox onChange={this.onChange} checked={paytmWallet} value={item.value}>
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
