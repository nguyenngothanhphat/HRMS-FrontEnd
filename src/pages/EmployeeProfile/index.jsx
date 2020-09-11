import React, { Component } from 'react';
import { PageContainer } from '@/layouts/layout/src';
import ModalUpload from '@/components/ModalUpload';
import { Row, Dropdown, Button, Menu, Layout, Tabs } from 'antd';
import { DownOutlined, PlusOutlined } from '@ant-design/icons';
import { formatMessage } from 'umi';

import Documents from './components/Documents';
import AccountsPaychecks from './components/Accounts&Paychecks';

import styles from './index.less';

const { Item } = Menu;

class EmployeeProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      nameTabs: [
        { id: 1, name: formatMessage({ id: 'pages.employeeProfile.generalInfoTab' }) },
        {
          id: 2,
          name: formatMessage({ id: 'pages.employeeProfile.employmentAndCompensationTab' }),
        },
        { id: 3, name: formatMessage({ id: 'pages.employeeProfile.performanceHistoryTab' }) },
        { id: 4, name: formatMessage({ id: 'pages.employeeProfile.accountsAndPaychecksTab' }) },
        { id: 5, name: formatMessage({ id: 'pages.employeeProfile.documentsTab' }) },
        { id: 6, name: formatMessage({ id: 'pages.employeeProfile.workEligibilityAndI-9Tab' }) },
        { id: 7, name: formatMessage({ id: 'pages.employeeProfile.timeAndSchedulingTab' }) },
        { id: 8, name: formatMessage({ id: 'pages.employeeProfile.benefitPlansTab' }) },
      ],
    };
  }

  componentDidMount() {
    // fetch employee by id
    // const {
    //   match: { params: { reId = '' } = {} },
    // } = this.props;
  }

  openModalUpload = () => {
    this.setState({
      open: true,
    });
  };

  _handleCancel = () => {
    this.setState({
      open: false,
    });
  };

  render() {
    const { open, nameTabs } = this.state;
    const { TabPane } = Tabs;
    const menu = (
      <Menu>
        <Item key="1" onClick={() => alert(1)}>
          {formatMessage({ id: 'pages.employeeProfile.putOnLeave' })}
        </Item>
        <Item key="2" onClick={() => alert(2)}>
          {formatMessage({ id: 'pages.employeeProfile.raiseTermination' })}
        </Item>
        <Item key="3" onClick={() => alert(3)}>
          {formatMessage({ id: 'pages.employeeProfile.requestDetails' })}
        </Item>
      </Menu>
    );
    return (
      <PageContainer>
        <div className={styles.containerEmployeeProfile}>
          <Row type="flex" justify="space-between" className={styles.viewInfo_Action}>
            <div className={styles.viewInfo}>
              <div className={styles.viewInfo__upload} onClick={this.openModalUpload}>
                <PlusOutlined style={{ fontSize: '40px' }} />
              </div>
              <div className={styles.viewInfo__text}>
                <p className={styles.textName}>Aditya Venkatesh</p>
                <p className={styles.textInfo}>UX Lead (Full Time), Design</p>
                <p className={styles.textInfo}>
                  {formatMessage({ id: 'pages.employeeProfile.location' })}: Bengaluru, India (+5:30
                  GMT)
                </p>
                <p className={styles.textInfo}>
                  {formatMessage({ id: 'pages.employeeProfile.joinedOn' })} December 10th, 2018
                </p>
              </div>
            </div>
            <Dropdown overlay={menu} placement="bottomRight">
              <Button type="primary" className={styles.btnActions}>
                {formatMessage({ id: 'pages.employeeProfile.actionMenu' })} <DownOutlined />
              </Button>
            </Dropdown>
          </Row>
          <ModalUpload visible={open} handleCancel={this._handleCancel} />
          <Tabs
            defaultActiveKey="1"
            className={styles.TabEmployee}
            onTabClick={this.handleClickTabPane}
          >
            {nameTabs.map((tab) => (
              <TabPane tab={tab.name} key={tab.id}>
                <Layout>
                  {tab.id === 5 ? <Documents /> : ''}
                  {tab.id === 4 ? <AccountsPaychecks /> : ''}
                </Layout>
              </TabPane>
            ))}
          </Tabs>
        </div>
      </PageContainer>
    );
  }
}

export default EmployeeProfile;
