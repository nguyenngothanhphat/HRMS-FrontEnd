import { Modal, Button, Select } from 'antd';
import React, { useState, useEffect } from 'react';
import { formatMessage, connect } from 'umi';
import styles from './index.less';

const ImportSalary = (props) => {
  const { visible, onCancel, onOk, salaryData, loadingImport, listLocation, listCountry } = props;
  const [fromLocation, setFromLocation] = useState('');

  useEffect(() => {
    if (listLocation.length) {
      setFromLocation(listLocation[0]._id);
    }
  }, [listLocation]);

  const onSave = () => {
    const data = {
      id: salaryData._id,
      fromLocation,
    };

    onOk(data);
  };

  return (
    <Modal
      className={styles.modalCustom}
      visible={visible}
      onCancel={onCancel}
      style={{ top: 50 }}
      destroyOnClose
      title="Import Salary Range from "
      maskClosable={false}
      width={600}
      footer={[
        <div key="cancel" className={styles.btnCancel} onClick={onCancel}>
          {formatMessage({ id: 'employee.button.cancel' })}
        </div>,
        <Button
          key="submit"
          htmlType="submit"
          type="primary"
          onClick={onSave}
          className={styles.btnSubmit}
          loading={loadingImport}
        >
          Update
        </Button>,
      ]}
    >
      <div className={styles.mainModal}>
        <div className={styles.row}>
          <div className={styles.row__label}>Country</div>
          <div className={styles.row__input}>
            <Select defaultValue={salaryData.country} disabled>
              {listCountry.map((item) => (
                <Select.Option key={item._id} value={item._id}>
                  {item.name}
                </Select.Option>
              ))}
            </Select>
          </div>
        </div>
        <div className={styles.row}>
          <div className={styles.row__label}>Grade</div>
          <div className={styles.row__input}>
            <Select defaultValue={salaryData.grade} disabled>
              <Select.Option key={salaryData.grade} value={salaryData.grade}>
                {salaryData.grade}
              </Select.Option>
            </Select>
          </div>
        </div>
        <div className={styles.row}>
          <div className={styles.row__label}>Location</div>
          <div className={styles.row__input}>
            <Select value={fromLocation} onChange={(e) => setFromLocation(e)}>
              {listLocation.map((item) => (
                <Select.Option key={item._id} value={item._id}>
                  {item.name}
                </Select.Option>
              ))}
            </Select>
          </div>
        </div>
      </div>
    </Modal>
  );
};
export default connect(({ loading }) => ({
  loadingImport: loading.effects['employeeSetting/importSalary'],
}))(ImportSalary);
