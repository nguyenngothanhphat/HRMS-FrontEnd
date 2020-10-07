import { Button, Table } from 'antd';
import React, { PureComponent } from 'react';
import iGirl from '@/assets/Group1404.svg';
import trash from '@/assets/trash-customField.svg';
import edit from '@/assets/edit-customField.svg';
import group from '@/assets/Group-customField.svg';
import styles from './index.less';

class CustomFields extends PureComponent {
  render() {
    const columns = [
      {
        title: 'Section name',
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
        title: 'Field name',
        dataIndex: 'fieldName',
        key: 'fieldName',
        width: '50%',
      },
      {
        title: 'Actions',
        dataIndex: 'actions',
        key: 'actions',
        render: () => {
          return (
            <div className={styles.actionIcon}>
              <div>
                <img src={trash} alt="" />
                <img src={edit} alt="" />
              </div>
              <div>
                <img src={group} alt="" />
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
            <h2 className={styles.contentLeftTitle}>Custom fields</h2>
            <p className={styles.contentLeftText}>
              You can manage create fields of your choice for entering into forms or surveys from
              here.
            </p>
            <div>
              <Button className={styles.buttonAddNewSection}>Add new section</Button>
              <Button className={styles.buttonAddNewField}>Add new field</Button>
            </div>
          </div>
          <div className={styles.imgContentRight}>
            <img src={iGirl} alt="not found" />
          </div>
        </div>
        <div className={styles.CustomFieldsBotBackGround}>
          <p>Custom Sections & fields</p>
          <div className={styles.CustomFieldsBot}>
            <Table columns={columns} dataSource={data} pagination={false} size="small" />
          </div>
        </div>
      </div>
    );
  }
}

export default CustomFields;
