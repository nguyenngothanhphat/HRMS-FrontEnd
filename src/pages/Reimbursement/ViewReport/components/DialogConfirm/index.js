import React, { PureComponent } from 'react';
import { Button, Modal } from 'antd';
import { formatMessage } from 'umi-plugin-react/locale';

import styles from './index.less';

class ConfirmDialog extends PureComponent {
  render() {
    const {
      open = false,
      title = '',
      onDialogClose = () => {},
      onConfirm = () => {},
      submit = '',
      className = '',
      onReject = false,
      content = <div />,
      isDisabled = false,
      loadingButton = false,
    } = this.props;
    return (
      <Modal
        visible={open}
        className={`${styles.employee_report_dialog} ${className}`}
        title={title}
        footer={[
          <Button
            key="back"
            onClick={onDialogClose}
            style={{
              border: '1px solid #fca00a',
              color: '#fca00a',
              marginRight: '24px',
              height: '35px',
              minWidth: '100px',
              textTransform: 'uppercase',
            }}
          >
            {formatMessage({ id: 'employee.new.page.dialog.button.back' })}
          </Button>,
          <Button
            key="submit"
            onClick={onConfirm}
            disabled={isDisabled}
            style={{
              backgroundColor: onReject ? '#D0021B' : '#fca00a',
              border: onReject ? '1px solid #D0021B' : '1px solid #fca00a',
              color: '#fff',
              height: '35px',
              minWidth: '100px',
              textTransform: 'uppercase',
              marginRight: '23px',
            }}
            loading={loadingButton}
          >
            {submit}
          </Button>,
        ]}
      >
        <div className={styles.employee_new_report_dialog_content}>
          <div>{content}</div>
        </div>
      </Modal>
    );
  }
}

export default ConfirmDialog;
