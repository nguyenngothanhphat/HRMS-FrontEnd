import React, { PureComponent } from 'react';
import { Button, Modal, notification } from 'antd';
import { connect } from 'umi';
import { ExclamationCircleOutlined, SmileOutlined } from '@ant-design/icons';
import styles from './index.less';

const { confirm } = Modal;

@connect(({ offboarding: { myRequest: { _id: id = '', status = '' } = {} } = {} }) => ({
  id,
  status,
}))
class WithDraw extends PureComponent {
  showConfirm = () => {
    const _this = this;
    confirm({
      title: 'Are you sure to withdraw this offboarding ticket?',
      icon: <ExclamationCircleOutlined />,
      // content: 'Some descriptions',
      onOk() {
        _this.handleWithdraw();
      },
      onCancel() {},
    });
  };

  handleWithdraw = () => {
    const { dispatch, id = '', status = '' } = this.props;
    if (status === 'ACCEPTED') {
      notification.open({
        message: 'Notification Title',
        description:
          'This is the content of the notification. This is the content of the notification. This is the content of the notification.',
        icon: <SmileOutlined style={{ color: '#108ee9' }} />,
      });
    } else {
      dispatch({
        type: 'offboarding/handleWithdraw',
        payload: {
          id,
        },
        isNotStatusAccepted: true,
      });
    }
  };

  render() {
    return (
      <div className={styles.root}>
        <Button className={styles.btnWithDraw} onClick={this.showConfirm}>
          Withdraw
        </Button>
      </div>
    );
  }
}

export default WithDraw;
