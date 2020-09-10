import React, { Component } from 'react';
import { PageContainer } from '@/layouts/layout/src';
import ModalUpload from '@/components/ModalUpload';
import { Row, Dropdown, Button, Menu, Layout, Tabs } from 'antd';
import { DownOutlined, PlusOutlined } from '@ant-design/icons';
import AccountsPaychecks from './components/Accounts&Paychecks';
import GeneralInfo from './components/GeneralInfo';
import styles from './index.less';

const { Item } = Menu;

class EmployeeProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      nameTabs: [
        { id: 1, name: 'General Info' },
        { id: 2, name: 'Employment & Compensation' },
        { id: 3, name: 'Performance History' },
        { id: 4, name: 'Accounts and Paychecks' },
        { id: 5, name: 'Documents' },
        { id: 6, name: 'Work Eligibility & I-9' },
        { id: 7, name: 'Time & Scheduling' },
        { id: 8, name: 'Benefit Plans' },
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
          Put on Leave (PWP)
        </Item>
        <Item key="2" onClick={() => alert(2)}>
          Raise Termination
        </Item>
        <Item key="3" onClick={() => alert(3)}>
          Request Details
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
                <p className={styles.textInfo}>Location: Bengaluru, India (+5:30 GMT)</p>
                <p className={styles.textInfo}>Joined on December 10th, 2018</p>
              </div>
            </div>
            <Dropdown overlay={menu} placement="bottomRight">
              <Button type="primary" className={styles.btnActions}>
                Actions <DownOutlined />
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
                  {tab.name === 'General Info' ? <GeneralInfo /> : ''}
                  {tab.name === 'Accounts and Paychecks' ? <AccountsPaychecks /> : ''}
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
