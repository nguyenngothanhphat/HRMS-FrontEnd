import React, { PureComponent } from 'react';
import { Radio, Modal } from 'antd';
import styles from '@/pages/EmployeeProfile/components/GeneralInfo/index.less';
import { TeamOutlined, LockFilled } from '@ant-design/icons';

class ModalComponent extends PureComponent {
  onChangeRadio = (value) => {
    // console.log(value);
    const { handleChangeRadio = () => {} } = this.props;
    handleChangeRadio(value);
  };

  render() {
    const {
      item = {},
      visible = false,
      handleCancel = () => {},
      defaultValue: { valueEmail, valueNumber } = {},
    } = this.props;
    return (
      <Modal
        title={item.title}
        visible={visible}
        footer={null}
        closable={false}
        onCancel={handleCancel}
        className={styles.GenModal}
      >
        <div className={styles.GenModalbBackgroundText}>
          <p className={styles.GenModalText}>
            The number will be still visible to your Reporting Manager, HR and Finance teams however
            you can Choose to keep it hidden from other co-workers.
          </p>
        </div>
        <div className={styles.GenRadio}>
          <Radio.Group
            onChange={this.onChangeRadio}
            value={item.title === 'Personal Email' ? valueEmail : valueNumber}
            name={item.title}
          >
            <Radio value="Co-Workers">
              <TeamOutlined className={styles.GenIconRadio} />
              <div className={styles.GenFormText}>
                <p className={styles.GenRadiotitle}>Co-Workers</p>
                <p className={styles.GenRadiotext}>Your colleagues at lollypop</p>
              </div>
            </Radio>
            <Radio value="Only Me">
              <LockFilled className={styles.GenIconRadio} />
              <div className={styles.GenFormText}>
                <p className={styles.GenRadiotitle}>Only Me</p>
                <p className={styles.GenRadiotext}>Your top level management only</p>
              </div>
            </Radio>
          </Radio.Group>
        </div>
      </Modal>
    );
  }
}

export default ModalComponent;
