/* eslint-disable no-nested-ternary */

import React, { PureComponent } from 'react';
import { Checkbox, Typography, Row } from 'antd';
import styles from './index.less';

class GlobalEmpoyeeComponent extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      medical: false,
      life: false,
      shortTerm: false,
      listSelectedMedical: [],
      listSelectedLife: [],
      listSelectedShortTerm: [],
    };
  }

  onChange = (e) => {
    console.log(e.target.value);
  };

  handleChange = (checkedList, arr, title) => {
    if (title === 'Medical') {
      this.setState({
        listSelectedMedical: checkedList,
        medical: checkedList.length === arr.length,
      });
    } else if (title === 'Life') {
      this.setState({
        listSelectedLife: checkedList,
        life: checkedList.length === arr.length,
      });
    } else if (title === 'shortTerm') {
      this.setState({
        listSelectedShortTerm: checkedList,
        shortTerm: checkedList.length === arr.length,
      });
    }
  };

  handleCheckAll = (e, arr, title) => {
    if (title === 'Medical') {
      this.setState({
        listSelectedMedical: e.target.checked ? arr.map((data) => data.value) : [],
        medical: e.target.checked,
      });
    } else if (title === 'Life') {
      this.setState({
        listSelectedLife: e.target.checked ? arr.map((data) => data.value) : [],
        life: e.target.checked,
      });
    } else if (title === 'shortTerm') {
      this.setState({
        listSelectedShortTerm: e.target.checked ? arr.map((data) => data.value) : [],
        shortTerm: e.target.checked,
      });
    }
  };

  render() {
    const { globalEmployeesCheckbox, headerText } = this.props;
    const {
      listSelectedMedical,
      listSelectedLife,
      listSelectedShortTerm,
      medical,
      life,
      shortTerm,
    } = this.state;
    const { name, checkBox } = globalEmployeesCheckbox;

    const CheckboxGroup = Checkbox.Group;
    return (
      <div className={styles.GlobalEmpoyeeComponent}>
        <Typography.Title level={5} className={styles.headerPadding}>
          {name}
        </Typography.Title>
        {checkBox.map((item) =>
          item.subCheckBox.length > 1 ? (
            <div className={styles.checkBoxHeader}>
              <Checkbox
                className={
                  item.value === 'Medical' ? styles.checkboxMedical : styles.checkBoxHeaderTop
                }
                onChange={(e) => this.handleCheckAll(e, item.subCheckBox, item.title)}
                checked={
                  item.title === 'Medical'
                    ? medical
                    : item.title === 'Life'
                    ? life
                    : item.title === 'shortTerm'
                    ? shortTerm
                    : null
                }
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
                  value={
                    item.title === 'Medical'
                      ? listSelectedMedical
                      : item.title === 'Life'
                      ? listSelectedLife
                      : item.title === 'shortTerm'
                      ? listSelectedShortTerm
                      : []
                  }
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
        <div className={styles.Line} />
      </div>
    );
  }
}

export default GlobalEmpoyeeComponent;
