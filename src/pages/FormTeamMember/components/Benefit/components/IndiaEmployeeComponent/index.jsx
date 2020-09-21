/* eslint-disable no-nested-ternary */

import React, { PureComponent } from 'react';
import { Checkbox, Typography, Row } from 'antd';
import styles from './index.less';

class IndiaEmployeeComponent extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      employee: false,
      listSelectedEmployee: [],
    };
  }

  onChange = (e) => {
    console.log(e.target.value);
  };

  handleChange = (checkedList, arr, title) => {
    if (title === 'employeeProvident') {
      this.setState({
        listSelectedEmployee: checkedList,
        employee: checkedList.length === arr.length,
      });
    }
  };

  handleCheckAll = (e, arr, title) => {
    if (title === 'employeeProvident') {
      this.setState({
        listSelectedEmployee: e.target.checked ? arr.map((data) => data.value) : [],
        employee: e.target.checked,
      });
    }
  };

  render() {
    const { IndiaEmployeesCheckbox, headerText } = this.props;
    const { employee, listSelectedEmployee } = this.state;
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
                checked={item.title === 'employeeProvident' ? employee : null}
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
                  <Checkbox onChange={this.onChange} value={item.value}>
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
