import React, { PureComponent } from 'react';
import { Collapse, Tooltip } from 'antd';
import { CloseOutlined, PlusOutlined, MinusOutlined } from '@ant-design/icons';
import styles from './index.less';

const { Panel } = Collapse;
export default class LeaveBalanceInfo extends PureComponent {
  renderMockData = () => {
    const sampleContent = (
      <p>
        Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor
        invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam
        et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est
        Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed
        diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam
        voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd
        gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.
        <br />
        Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor
        invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam
        et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea.
        <br />
        Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor
        invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam
        et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea.Lorem ipsum dolor sit
        amet, consetetur sadipscing elitr.
      </p>
    );
    return [
      {
        title: 'Casual Leave (CL)',
        content: sampleContent,
      },
      {
        title: 'Sick Leave (SL)',
        content: sampleContent,
      },
      {
        title: 'Compensation Leave (CL)',
        content: sampleContent,
      },
      {
        title: 'Malternity Leave (ML)',
        content: sampleContent,
      },
    ];
  };

  renderExpandIcon = (isActive) =>
    isActive ? (
      <MinusOutlined className={styles.alternativeExpandIcon} />
    ) : (
      <PlusOutlined className={styles.alternativeExpandIcon} />
    );

  render() {
    const { onClose = () => {} } = this.props;
    return (
      <div className={styles.LeaveBalanceInfo}>
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
              // defaultActiveKey={['1']}
            >
              {this.renderMockData().map((data, index) => {
                const { title = '', content = '' } = data;
                return (
                  <Panel className={styles.eachCollapse} header={title} key={`${index + 1}`}>
                    <p>{content}</p>
                  </Panel>
                );
              })}
            </Collapse>
          </p>
        </div>
      </div>
    );
  }
}
