/* eslint-disable no-nested-ternary */

import React, { PureComponent } from 'react';
import { Checkbox, Typography, Row } from 'antd';
import styles from './index.less';

class GlobalEmpoyeeComponent extends PureComponent {
  render() {
    const {
      globalEmployeesCheckbox,
      headerText,
      onChange,
      handleCheckAll,
      handleChange,
      benefits,
    } = this.props;
    const {
      medical,
      life,
      shortTerm,
      listSelectedMedical,
      listSelectedShortTerm,
      listSelectedLife,
      dental,
      vision,
    } = benefits;
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
                onChange={(e) => handleCheckAll(e, item.subCheckBox, item.title)}
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
                  onChange={(e) => handleChange(e, item.subCheckBox, item.title)}
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
                  <Checkbox
                    onChange={onChange}
                    value={item.value}
                    checked={item.title === 'Dental' ? dental : vision}
                  >
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
