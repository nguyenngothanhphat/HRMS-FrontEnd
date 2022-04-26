import React, { PureComponent } from 'react';
import { Collapse, Tooltip, Modal } from 'antd';
import { CloseOutlined, PlusOutlined, MinusOutlined } from '@ant-design/icons';
import { connect } from 'umi';
import styles from './index.less';

const { Panel } = Collapse;
@connect(({ timeOff, user: { currentUser = {} } = {} }) => ({
  timeOff,
  currentUser,
}))
class TimeOffTypesInfo extends PureComponent {
  renderExpandIcon = (isActive) =>
    isActive ? (
      <MinusOutlined className={styles.alternativeExpandIcon} />
    ) : (
      <PlusOutlined className={styles.alternativeExpandIcon} />
    );

  renderTimeOffTypeInfo = () => {
    const { timeOff: { yourTimeOffTypes: { commonLeaves = [], specialLeaves = [] } = {} } = {} } =
      this.props;

    return [...commonLeaves, ...specialLeaves].map((x, index) => (
      <Panel className={styles.eachCollapse} header={x.name} key={`${index + 1}`}>
        <p>{x.description || 'No data'}</p>
      </Panel>
    ));
  };

  render() {
    const { onClose = () => {}, visible } = this.props;
    return (
      <div>
        <Modal
          className={styles.TimeOffTypesInfo}
          visible={visible}
          footer={null}
          onCancel={onClose}
        >
          <div className={styles.arrow} />
          <div className={styles.container}>
            <div className={styles.title}>
              <span>All you need to know about Leave balances</span>
              <Tooltip title="Close">
                <div onClick={onClose} className={styles.closeIcon}>
                  <CloseOutlined />
                </div>
              </Tooltip>
            </div>
            <p className={styles.description}>
              The leave balance shown is across all the type of leaves. Please look at the Leave
              Breakdown option to look at the types of leaves and balances.
            </p>
            <p className={styles.collapseInfoContainer}>
              <Collapse
                bordered={false}
                expandIconPosition="right"
                expandIcon={({ isActive }) => this.renderExpandIcon(isActive)}
              >
                {this.renderTimeOffTypeInfo()}
              </Collapse>
            </p>
          </div>
        </Modal>
      </div>
    );
  }
}

export default TimeOffTypesInfo;
