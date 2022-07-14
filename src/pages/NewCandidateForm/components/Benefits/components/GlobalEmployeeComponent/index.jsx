/* eslint-disable no-nested-ternary */

import React, { PureComponent } from 'react';
import { Checkbox, Skeleton, Typography } from 'antd';
import moment from 'moment';
import { connect } from 'umi';
import styles from './index.less';
import EmptyComponent from '@/components/Empty';

@connect(({ loading }) => ({
  loading: loading.effects['newCandidateForm/fetchListBenefit'],
}))
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

  handleChecked = (list, value) => {
    let check = false;
    list.forEach((item) => {
      if (item === value) check = true;
    });

    return check;
  };

  isSubCheckBox = (list) => {
    let check = false;
    list.forEach((item) => {
      if (item.subCheckBox.length > 0) check = true;
    });
    return check;
  };

  render() {
    const {
      globalEmployeesCheckbox,
      onChange,
      handleCheckAll,
      newHandleChange,
      benefits,
      loading,
    } = this.props;
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

    return (
      <div className={styles.GlobalEmpoyeeComponent}>
        <Skeleton loading={loading} active>
          {this.isSubCheckBox(checkBox) ? (
            checkBox.map(
              (item) =>
                item.subCheckBox.length > 0 && (
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
                      <Typography.Text className={styles.checkBoxTitle}>
                        {item.value}
                      </Typography.Text>
                    </Checkbox>
                    {/* <Typography.Text className={styles.checkBoxTitle}>{item.value}</Typography.Text> */}
                    <div className={styles.paddingLeft}>
                      {item.subCheckBox.map((sub) => {
                        const { benefitsName, documents, createdAt } = sub;
                        return (
                          <>
                            <div className={styles.benefitsName}>{benefitsName}</div>
                            {this.getCreateBenefitAt(createdAt)}
                            {documents.map((doc) => (
                              <div>
                                <Checkbox
                                  onChange={(e) => newHandleChange(e, item.value, item.subCheckBox)}
                                  value={doc.value}
                                  checked={
                                    item.title === 'Medical'
                                      ? this.handleChecked(listSelectedMedical, doc.value)
                                      : item.title === 'Life'
                                      ? this.handleChecked(listSelectedLife, doc.value)
                                      : item.title === 'shortTerm'
                                      ? this.handleChecked(listSelectedShortTerm, doc.value)
                                      : item.title === 'Dental'
                                      ? this.handleChecked(listSelectedDental, doc.value)
                                      : item.title === 'Vision'
                                      ? this.handleChecked(listSelectedVision, doc.value)
                                      : null
                                  }
                                >
                                  <Typography.Text className={styles.subCheckboxTitle}>
                                    {doc.value}
                                  </Typography.Text>
                                </Checkbox>
                              </div>
                            ))}
                          </>
                        );
                      })}
                    </div>
                  </div>
                ),
            )
          ) : (
            <EmptyComponent />
          )}
          {/* <div className={styles.Line} /> */}
        </Skeleton>
      </div>
    );
  }
}

export default GlobalEmpoyeeComponent;
