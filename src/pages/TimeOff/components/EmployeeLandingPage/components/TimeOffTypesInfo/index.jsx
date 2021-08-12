import React, { PureComponent } from 'react';
import { Collapse, Tooltip, Modal } from 'antd';
import { CloseOutlined, PlusOutlined, MinusOutlined } from '@ant-design/icons';
import { connect } from 'umi';
import styles from './index.less';

const { Panel } = Collapse;
@connect(({ timeOff }) => ({
  timeOff,
}))
class TimeOffTypesInfo extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  renderData = () => {
    const { timeOff: { timeOffTypesByCountry = [] } = {} } = this.props;
    return timeOffTypesByCountry;
  };

  renderExpandIcon = (isActive) =>
    isActive ? (
      <MinusOutlined className={styles.alternativeExpandIcon} />
    ) : (
      <PlusOutlined className={styles.alternativeExpandIcon} />
    );

  renderTimeOffTypeInfo = (value) => {
    return this.renderData().map((data, index) => {
      const { name = '', description = '', shortType = '', type = '' } = data;
      if (type === value) {
        return (
          <Panel
            className={styles.eachCollapse}
            header={`${name} ${shortType !== '' ? `(${shortType})` : ''}`}
            key={`${index + 1}`}
          >
            <p>{description}</p>
          </Panel>
        );
      }
      return null;
    });
  };

  render() {
    const { onClose = () => {}, visible } = this.props;
    return (
      <div>
        <Modal
          className={styles.TimeOffTypesInfo}
          centered
          visible={visible}
          footer={null}
          width={700}
          onCancel={onClose}
        >
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
              Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor
              invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et
              accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata
              sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur
              sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut.
            </p>
            <p className={styles.collapseInfoContainer}>
              <Collapse
                bordered={false}
                expandIconPosition="right"
                expandIcon={({ isActive }) => this.renderExpandIcon(isActive)}
              >
                {this.renderTimeOffTypeInfo('A')}
                {/* {this.renderTimeOffTypeInfo('B')} */}
                {this.renderTimeOffTypeInfo('C')}
                {this.renderTimeOffTypeInfo('D')}
              </Collapse>
            </p>
          </div>
        </Modal>
      </div>
    );
  }
}

export default TimeOffTypesInfo;
