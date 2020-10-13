import { Button, Table } from 'antd';
import React, { PureComponent } from 'react';
import { history, formatMessage } from 'umi';
import iGirl from '@/assets/Group1404.svg';
import trash from '@/assets/trash-customField.svg';
import edit from '@/assets/edit-customField.svg';
import group from '@/assets/Group-customField.svg';
import styles from './index.less';

class CustomFields extends PureComponent {
  handleAddNewSection = () => {
    history.push('/employee-onboarding/CreateFieldSection');
  };

  handleAddNewField = () => {
    history.push('/employee-onboarding/CreateNewField');
  };

  render() {
    const columns = [
      {
        title: formatMessage({ id: 'pages.EmployeeOnboardingCustomField.sectionName' }),
        dataIndex: 'sectionName',
        key: 'sectionName',
        width: '230px',
        render: (value, row, index) => {
          const obj = {
            children: value,
            props: {},
          };
          if (index % 2 === 0) {
            obj.props.rowSpan = 2;
          }
          if (index % 2 === 1) {
            obj.props.rowSpan = 0;
          }
          return obj;
        },
      },
      {
        title: formatMessage({ id: 'pages.EmployeeOnboardingCustomField.fieldName' }),
        dataIndex: 'fieldName',
        key: 'fieldName',
        width: '50%',
      },
      {
        title: formatMessage({ id: 'pages.EmployeeOnboardingCustomField.actions' }),
        dataIndex: 'actions',
        key: 'actions',
        render: () => {
          return (
            <div className={styles.actionIcon}>
              <div>
                <img src={trash} alt="" className={styles.iconTrash} />
                <img src={edit} alt="" className={styles.iconEdit} />
              </div>
              <div>
                <img src={group} alt="" className={styles.iconGroup} />
              </div>
            </div>
          );
        },
      },
    ];
    const data = [
      {
        key: '1',
        sectionName: 'N/A',
        fieldName: 'Inside sales_ commission plan',
      },
      {
        key: '2',
        sectionName: 'N/A',
        fieldName: 'Additional Information',
      },
    ];
    return (
      <div className={styles.CustomFields}>
        <div className={styles.CustomFieldsTop}>
          <div className={styles.contentLeft}>
            <h2 className={styles.contentLeftTitle}>
              {formatMessage({ id: 'pages.EmployeeOnboardingCustomField.customFields' })}
            </h2>
            <p className={styles.contentLeftText}>
              {formatMessage({ id: 'pages.EmployeeOnboardingCustomField.text' })}
            </p>
            <div>
              <Button className={styles.buttonAddNewSection} onClick={this.handleAddNewSection}>
                {formatMessage({ id: 'pages.EmployeeOnboardingCustomField.addNewSection' })}
              </Button>
              <Button className={styles.buttonAddNewField} onClick={this.handleAddNewField}>
                {formatMessage({ id: 'pages.EmployeeOnboardingCustomField.addNewField' })}
              </Button>
            </div>
          </div>
          <div className={styles.imgContentRight}>
            <img src={iGirl} alt="not found" />
          </div>
        </div>
        <div className={styles.CustomFieldsBotBackGround}>
          <p className={styles.CustomFieldsBotTitle}>
            {formatMessage({ id: 'pages.EmployeeOnboardingCustomField.customSections&Fields' })}
          </p>
          <div className={styles.CustomFieldsBot}>
            <Table columns={columns} dataSource={data} pagination={false} size="small" />
          </div>
        </div>
      </div>
    );
  }
}

export default CustomFields;
