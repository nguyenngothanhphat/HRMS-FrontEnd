/* eslint-disable no-nested-ternary */

import React, { PureComponent } from 'react';
import { Checkbox, Typography, Row } from 'antd';
import moment from 'moment';
import styles from './index.less';

class GlobalEmpoyeeComponent extends PureComponent {
  getCreateBenefitAt = (createdAt) => {
    let takeEffect = '';

    takeEffect = moment(createdAt).locale('en').format('DD/MM/YYYY');
    return createdAt ? (
      <div className={styles.headerText}>Coverage will take effect on {takeEffect}</div>
    ) : (
      ''
    );
  };

  render() {
    const { globalEmployeesCheckbox, onChange, handleCheckAll, handleChange, benefits } =
      this.props;
    const {
      medical,
      life,
      shortTerm,
      listSelectedMedical,
      listSelectedShortTerm,
      listSelectedLife,
      listSelectedVision,
      listSelectedDental,
      dental,
      vision,
    } = benefits;
    const { checkBox } = globalEmployeesCheckbox;

    const CheckboxGroup = Checkbox.Group;
    return (
      <div className={styles.GlobalEmpoyeeComponent}>
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
                    : item.title === 'Dental'
                    ? dental
                    : item.title === 'Vision'
                    ? vision
                    : null
                }
              >
                <Typography.Text className={styles.checkBoxTitle}>{item.value}</Typography.Text>
              </Checkbox>
              <div className={styles.paddingLeft}>
                {item.subCheckBox.map((sub) => {
                  const { benefitsName, documents, createdAt } = sub;

                  return (
                    <>
                      <div className={styles.benefitsName}>{benefitsName}</div>
                      {this.getCreateBenefitAt(createdAt)}
                      <CheckboxGroup
                        options={documents.map((data) => data.value)}
                        onChange={(e) => handleChange(e, item.subCheckBox, item.title)}
                        value={
                          item.title === 'Medical'
                            ? listSelectedMedical
                            : item.title === 'Life'
                            ? listSelectedLife
                            : item.title === 'shortTerm'
                            ? listSelectedShortTerm
                            : item.title === 'Dental'
                            ? listSelectedDental
                            : item.title === 'Vision'
                            ? listSelectedVision
                            : []
                        }
                      />
                    </>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className={styles.paddingLeft}>
              <Typography.Paragraph className={styles.checkBoxTitle}>
                {item.value}
              </Typography.Paragraph>

              {item.subCheckBox.map((data) => {
                const { benefitsName, documents, createdAt } = data;

                return (
                  <>
                    <div className={styles.benefitsName}>{benefitsName}</div>
                    {this.getCreateBenefitAt(createdAt)}
                    {documents.map((doc) => (
                      <Checkbox
                        onChange={(e) => onChange(e, item.value)}
                        value={doc.value}
                        checked={
                          item.title === 'Medical'
                            ? medical
                            : item.title === 'Life'
                            ? life
                            : item.title === 'shortTerm'
                            ? shortTerm
                            : item.title === 'Dental'
                            ? dental
                            : item.title === 'Vision'
                            ? vision
                            : null
                        }
                      >
                        <Typography.Text className={styles.subCheckboxTitle}>
                          {doc.value}
                        </Typography.Text>
                      </Checkbox>
                    ))}
                  </>
                );
              })}
            </div>
          ),
        )}
        <div className={styles.Line} />
      </div>
    );
  }
}

export default GlobalEmpoyeeComponent;
