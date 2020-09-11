import React, { PureComponent } from 'react';
import { Row, Modal, Tabs, Layout } from 'antd';
import { EditOutlined } from '@ant-design/icons';

import styles from './index.less';

class EmploymentTab extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      nameTabs: [
        { id: 1, name: 'Effective Date' },
        { id: 2, name: 'Compensation Details' },
        { id: 3, name: 'Work Group' },
        { id: 4, name: 'Who to Notify' },
        { id: 5, name: 'Review Changes' },
      ],
    };
  }

  handleOk = () => {
    this.setState({
      visible: false,
    });
  };

  handleCancel = () => {
    this.setState({
      visible: false,
    });
  };

  handleChangeHistory = () => {
    this.setState({
      visible: true,
    });
  };

  render() {
    const { nameTabs, visible } = this.state;
    const { TabPane } = Tabs;
    return (
      <div className={styles.employmentTab}>
        <Row className={styles.employmentTab_title} justify="space-between" align="middle">
          <span>Employment & Compensation</span>
          <span span={4}>
            <u>Make changes</u>
          </span>
        </Row>
        <Row className={styles.employmentTab_title} align="middle">
          <span>Change History</span>
          <div className={styles.employmentTab_changeIcon}>
            <EditOutlined
              className={styles.employmentTab_iconEdit}
              onClick={this.handleChangeHistory}
            />
          </div>
        </Row>
        <Modal
          className={styles.employmentTab_modal}
          title="Edit Employment & Compensation"
          visible={visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <Tabs
            defaultActiveKey="2"
            className={styles.TabEmployee}
            onTabClick={this.handleClickTabPane}
          >
            {nameTabs.map((tab) => (
              <TabPane tab={tab.name} key={tab.id}>
                <Layout />
              </TabPane>
            ))}
          </Tabs>
        </Modal>
      </div>
    );
  }
}

export default EmploymentTab;
