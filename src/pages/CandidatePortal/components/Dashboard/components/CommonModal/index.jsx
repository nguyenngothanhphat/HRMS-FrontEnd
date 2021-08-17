import { Button, Modal } from 'antd';
import React, { PureComponent } from 'react';
import { connect } from 'umi';
import styles from './index.less';
import UpcomingEvents from '../YourActivity/components/UpcomingEvents';
import NextSteps from '../YourActivity/components/NextSteps';
import Messages from '../YourActivity/components/Messages';
import PendingTaskTable from '../PendingTasks/components/PendingTaskTable';

@connect(() => ({}))
class CommonModal extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount = async () => {};

  renderModalHeader = () => {
    const { title = '' } = this.props;
    return (
      <div className={styles.header}>
        <p className={styles.header__text}>{title}</p>
      </div>
    );
  };

  handleCancel = () => {
    const { onClose = () => {} } = this.props;
    onClose();
  };

  renderModalContent = () => {
    const { type = '', tabKey = '', content = [] } = this.props;
    if (type === 'your-activity') {
      switch (tabKey) {
        case '1':
          return <UpcomingEvents events={content} />;
        case '2':
          return <NextSteps steps={content} />;
        case '3':
          return <Messages messages={content} />;
        default:
          return '';
      }
    }
    if (type === 'pending-tasks') {
      return <PendingTaskTable tasks={content} />;
    }
    return '';
  };

  render() {
    const { visible = false, type = '' } = this.props;

    return (
      <>
        <Modal
          className={`${styles.CommonModal} ${
            type !== 'pending-tasks' ? styles.withPadding : styles.noPadding
          }`}
          onCancel={this.handleCancel}
          destroyOnClose
          footer={
            type === 'your-activity' || type === 'pending-tasks'
              ? null
              : [
                <Button onClick={this.handleCancel} className={styles.btnCancel}>
                  Cancel
                </Button>,
                <Button
                  className={styles.btnSubmit}
                  type="primary"
                  form="myForm"
                  key="submit"
                  htmlType="submit"
                >
                  Okay
                </Button>,
                ]
          }
          title={this.renderModalHeader()}
          centered
          visible={visible}
        >
          {this.renderModalContent()}
        </Modal>
      </>
    );
  }
}

export default CommonModal;
