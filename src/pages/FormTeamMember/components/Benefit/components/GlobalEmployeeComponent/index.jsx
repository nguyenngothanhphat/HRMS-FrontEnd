/* eslint-disable no-nested-ternary */

import React, { PureComponent } from 'react';
import { Checkbox, Typography, Row } from 'antd';
import { connect } from 'umi';
import styles from './index.less';

@connect(({ info: { benefits } = {} }) => ({
  benefits,
}))
class GlobalEmpoyeeComponent extends PureComponent {
  static getDerivedStateFromProps(props) {
    if ('benefits' in props) {
      return { benefits: props.benefits || {} };
    }
    return null;
  }

  handleChange = (checkedList, arr, title) => {
    const { benefits } = this.state;
    const { dispatch } = this.props;
    if (title === 'Medical') {
      dispatch({
        type: 'info/saveBenefits',
        payload: {
          benefits: {
            ...benefits,
            listSelectedMedical: checkedList,
            medical: checkedList.length === arr.length,
          },
        },
      });
    } else if (title === 'Life') {
      dispatch({
        type: 'info/saveBenefits',
        payload: {
          benefits: {
            ...benefits,
            listSelectedLife: checkedList,
            life: checkedList.length === arr.length,
          },
        },
      });
    } else if (title === 'shortTerm') {
      dispatch({
        type: 'info/saveBenefits',
        payload: {
          benefits: {
            ...benefits,
            listSelectedShortTerm: checkedList,
            shortTerm: checkedList.length === arr.length,
          },
        },
      });
    }
  };

  onChange = (e) => {
    const { target } = e;
    const { value } = target;
    const { benefits } = this.state;
    const { vision, dental } = benefits;
    const { dispatch } = this.props;
    if (value === 'Dental') {
      dispatch({
        type: 'info/saveBenefits',
        payload: {
          benefits: {
            ...benefits,
            dental: !dental,
          },
        },
      });
    } else if (value === 'Vision') {
      dispatch({
        type: 'info/saveBenefits',
        payload: {
          benefits: {
            ...benefits,
            vision: !vision,
          },
        },
      });
    }
  };

  handleCheckAll = (e, arr, title) => {
    const { benefits } = this.state;
    const { dispatch } = this.props;
    if (title === 'Medical') {
      dispatch({
        type: 'info/saveBenefits',
        payload: {
          benefits: {
            ...benefits,
            listSelectedMedical: e.target.checked ? arr.map((data) => data.value) : [],
            medical: e.target.checked,
          },
        },
      });
    } else if (title === 'Life') {
      dispatch({
        type: 'info/saveBenefits',
        payload: {
          benefits: {
            ...benefits,
            listSelectedLife: e.target.checked ? arr.map((data) => data.value) : [],
            life: e.target.checked,
          },
        },
      });
    } else if (title === 'shortTerm') {
      dispatch({
        type: 'info/saveBenefits',
        payload: {
          benefits: {
            ...benefits,
            listSelectedShortTerm: e.target.checked ? arr.map((data) => data.value) : [],
            shortTerm: e.target.checked,
          },
        },
      });
    }
  };

  render() {
    const { globalEmployeesCheckbox, headerText } = this.props;
    const { benefits = {} } = this.state;
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
                  <Checkbox
                    onChange={this.onChange}
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
