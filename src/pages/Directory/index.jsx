import React, { PureComponent } from 'react';
import { PageContainer } from '@/layouts/layout/src';
import { Tabs, Menu, Dropdown, Button } from 'antd';
import { ThunderboltFilled, CloseOutlined } from '@ant-design/icons';
import { formatMessage, connect } from 'umi';
import styles from './index.less';
import OrganChart from './components/OrganisationChart';
import DirectoryComponent from './components/Directory';

@connect(({ user: { currentUser = {} } }) => ({ currentUser }))
class Directory extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      roles: {
        employee: 'EMPLOYEE',
      },
      checkRoleEmployee: false,
    };
  }

  componentDidMount() {
    const {
      currentUser: { roles = [] },
    } = this.props;
    const checkRoleEmployee = this.checkRoleEmployee(roles);
    this.setState({
      checkRoleEmployee,
    });
  }

  checkRoleEmployee = (roles) => {
    let flag = false;
    const { roles: rolesConst } = this.state;
    const checkRole = (obj) => obj._id === rolesConst.employee;
    if (roles.length === 1 && roles.some(checkRole)) {
      flag = true;
    }
    return flag;
  };

  handleLogClick = () => {
    const { open } = this.state;
    this.setState({ open: !open });
  };

  // operations = () => {
  //   const { open } = this.state;
  //   const array = [
  //     'Aditya Venkatesh has been onboarded successfully, set up his employee profile here.',
  //     'Aditya Venkatesh has been onboarded successfully, set up his employee profile here.',
  //     'Past TDS Form 19 forms are yet to be uploaded for Parul Sharma, Upload or Request',
  //     'Aditya Venkatesh has been onboarded successfully, set up his employee profile here.',
  //   ];
  //   const data = (
  //     <Menu style={{ width: '347px' }}>
  //       <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
  //         <CloseOutlined
  //           onClick={this.handleLogClick}
  //           style={{ color: '#2c6df9', fontSize: '18px', margin: '12px' }}
  //         />
  //       </div>
  //       {array.map((item, index) => (
  //         <Menu.Item
  //           key={`${index + 1}`}
  //           style={{ display: 'flex', whiteSpace: 'normal', padding: '0 24px 24px 16px' }}
  //         >
  //           <ThunderboltFilled style={{ paddingTop: '6px', fontSize: '14px', color: '#2c6df9' }} />
  //           <a target="_blank" rel="noopener noreferrer" href="/">
  //             {item}
  //           </a>
  //         </Menu.Item>
  //       ))}
  //     </Menu>
  //   );
  //   return (
  //     <div className={styles.viewActivityBox}>
  //       <Dropdown
  //         visible={open}
  //         onClick={this.handleLogClick}
  //         overlay={data}
  //         placement="bottomRight"
  //       >
  //         <Button className={styles.viewActivityButton}>
  //           {formatMessage({ id: 'pages.directory.viewActivityLog' })} ({array.length})
  //         </Button>
  //       </Dropdown>
  //     </div>
  //   );
  // };

  render() {
    const { TabPane } = Tabs;
    const { checkRoleEmployee } = this.state;
    return (
      <PageContainer>
        <div className={styles.containerDirectory}>
          <Tabs
            defaultActiveKey="1"
            tabBarExtraContent={checkRoleEmployee ? '' : null}
            // tabBarExtraContent={checkRoleEmployee ? '' : this.operations()}
          >
            <TabPane tab={formatMessage({ id: 'pages.directory.directoryTab' })} key="1">
              <DirectoryComponent />
            </TabPane>
            <TabPane tab={formatMessage({ id: 'pages.directory.organisationChartTab' })} key="2">
              <OrganChart />
            </TabPane>
          </Tabs>
        </div>
      </PageContainer>
    );
  }
}

export default Directory;
