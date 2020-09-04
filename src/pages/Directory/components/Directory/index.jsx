import React, { PureComponent } from 'react';
import { NavLink } from 'umi';
import { PlusOutlined } from '@ant-design/icons';
import { Tabs, Layout } from 'antd';
import DirectotyTable from '@/components/DirectotyTable';
import styles from './index.less';
import TableFilter from '../TableFilter';

class DirectoryComponent extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      collapsed: false,
      bottabs: [
        { id: 1, name: 'Active Employees' },
        { id: 2, name: 'My Team' },
        { id: 3, name: 'Inactive Employees' },
      ],
    };
  }

  handleToggle = () => {
    const { collapsed } = this.state;
    this.setState({
      collapsed: !collapsed,
    });
  };

  render() {
    const { Content } = Layout;
    const { TabPane } = Tabs;
    const { bottabs, collapsed } = this.state;
    const employeesState = [
      {
        generalInfo: {
          fullName: 'Adija Venka ',
        },
        compensation: {
          title: 'UX designer',
        },
        department: {
          name: 'Design',
        },
        location: {
          name: 'Begalura',
        },
        manager: {
          name: 'Anil Reddy',
        },
      },
      {
        generalInfo: {
          fullName: 'Adija Venka 1',
        },
        compensation: {
          title: 'UX designer',
        },
        department: {
          name: 'Design',
        },
        location: {
          name: 'Begalura',
        },
        manager: {
          name: 'Anil Reddy',
        },
      },
      {
        generalInfo: {
          fullName: 'Adija Venka 2',
        },
        compensation: {
          title: 'UX designer',
        },
        department: {
          name: 'Design',
        },
        location: {
          name: 'Begalura',
        },
        manager: {
          name: 'Anil Reddy',
        },
      },
      {
        generalInfo: {
          fullName: 'Adija Venka 3',
        },
        compensation: {
          title: 'UX designer',
        },
        department: {
          name: 'Design',
        },
        location: {
          name: 'Begalura',
        },
        manager: {
          name: 'Anil Reddy',
        },
      },
      {
        generalInfo: {
          fullName: 'Adija Venka 4',
        },
        compensation: {
          title: 'UX designer',
        },
        department: {
          name: 'Design',
        },
        location: {
          name: 'Begalura',
        },
        manager: {
          name: 'Anil Reddy',
        },
      },
      {
        generalInfo: {
          fullName: 'Adija Venka 5',
        },
        compensation: {
          title: 'UX designer',
        },
        department: {
          name: 'Design',
        },
        location: {
          name: 'Begalura',
        },
        manager: {
          name: 'Anil Reddy',
        },
      },
      {
        generalInfo: {
          fullName: 'Adija Venka 6',
        },
        compensation: {
          title: 'UX designer',
        },
        department: {
          name: 'Design',
        },
        location: {
          name: 'Begalura',
        },
        manager: {
          name: 'Anil Reddy',
        },
      },
      {
        generalInfo: {
          fullName: 'Adija Venka 7',
        },
        compensation: {
          title: 'UX designer',
        },
        department: {
          name: 'Design',
        },
        location: {
          name: 'Begalura',
        },
        manager: {
          name: 'Anil Reddy',
        },
      },
      {
        generalInfo: {
          fullName: 'Adija Venka 8',
        },
        compensation: {
          title: 'UX designer',
        },
        department: {
          name: 'Design',
        },
        location: {
          name: 'Begalura',
        },
        manager: {
          name: 'Anil Reddy',
        },
      },
      {
        generalInfo: {
          fullName: 'Adija Venka 9',
        },
        compensation: {
          title: 'UX designer',
        },
        department: {
          name: 'Design',
        },
        location: {
          name: 'Begalura',
        },
        manager: {
          name: 'Anil Reddy',
        },
      },
      {
        generalInfo: {
          fullName: 'Adija Venka 10',
        },
        compensation: {
          title: 'UX designer',
        },
        department: {
          name: 'Design',
        },
        location: {
          name: 'Begalura',
        },
        manager: {
          name: 'Anil Reddy',
        },
      },
      {
        generalInfo: {
          fullName: 'Adija Venka 11',
        },
        compensation: {
          title: 'UX designer',
        },
        department: {
          name: 'Design',
        },
        location: {
          name: 'Begalura',
        },
        manager: {
          name: 'Anil Reddy',
        },
      },
      {
        generalInfo: {
          fullName: 'Adija Venka 12',
        },
        compensation: {
          title: 'UX designer',
        },
        department: {
          name: 'Design',
        },
        location: {
          name: 'Begalura',
        },
        manager: {
          name: 'Anil Reddy',
        },
      },
      {
        generalInfo: {
          fullName: 'Adija Venka 13',
        },
        compensation: {
          title: 'UX designer',
        },
        department: {
          name: 'Design',
        },
        location: {
          name: 'Begalura',
        },
        manager: {
          name: 'Anil Reddy',
        },
      },
      {
        generalInfo: {
          fullName: 'Adija Venka 14',
        },
        compensation: {
          title: 'UX designer',
        },
        department: {
          name: 'Design',
        },
        location: {
          name: 'Begalura',
        },
        manager: {
          name: 'Anil Reddy',
        },
      },
      {
        generalInfo: {
          fullName: 'Adija Venka 15',
        },
        compensation: {
          title: 'UX designer',
        },
        department: {
          name: 'Design',
        },
        location: {
          name: 'Begalura',
        },
        manager: {
          name: 'Anil Reddy',
        },
      },
      {
        generalInfo: {
          fullName: 'Adija Venka 16',
        },
        compensation: {
          title: 'UX designer',
        },
        department: {
          name: 'Design',
        },
        location: {
          name: 'Begalura',
        },
        manager: {
          name: 'Anil Reddy',
        },
      },
      {
        generalInfo: {
          fullName: 'Adija Venka 17',
        },
        compensation: {
          title: 'UX designer',
        },
        department: {
          name: 'Design',
        },
        location: {
          name: 'Begalura',
        },
        manager: {
          name: 'Anil Reddy',
        },
      },
      {
        generalInfo: {
          fullName: 'Adija Venka 18',
        },
        compensation: {
          title: 'UX designer',
        },
        department: {
          name: 'Design',
        },
        location: {
          name: 'Begalura',
        },
        manager: {
          name: 'Anil Reddy',
        },
      },
      {
        generalInfo: {
          fullName: 'Adija Venka 19',
        },
        compensation: {
          title: 'UX designer',
        },
        department: {
          name: 'Design',
        },
        location: {
          name: 'Begalura',
        },
        manager: {
          name: 'Anil Reddy',
        },
      },
      {
        generalInfo: {
          fullName: 'Adija Venka 20',
        },
        compensation: {
          title: 'UX designer',
        },
        department: {
          name: 'Design',
        },
        location: {
          name: 'Begalura',
        },
        manager: {
          name: 'Anil Reddy',
        },
      },
      {
        generalInfo: {
          fullName: 'Adija Venka 21',
        },
        compensation: {
          title: 'UX designer',
        },
        department: {
          name: 'Design',
        },
        location: {
          name: 'Begalura',
        },
        manager: {
          name: 'Anil Reddy',
        },
      },
      {
        generalInfo: {
          fullName: 'Adija Venka 22',
        },
        compensation: {
          title: 'UX designer',
        },
        department: {
          name: 'Design',
        },
        location: {
          name: 'Begalura',
        },
        manager: {
          name: 'Anil Reddy',
        },
      },
      {
        generalInfo: {
          fullName: 'Adija Venka 23',
        },
        compensation: {
          title: 'UX designer',
        },
        department: {
          name: 'Design',
        },
        location: {
          name: 'Begalura',
        },
        manager: {
          name: 'Anil Reddy',
        },
      },
      {
        generalInfo: {
          fullName: 'Adija Venka 24',
        },
        compensation: {
          title: 'UX designer',
        },
        department: {
          name: 'Design',
        },
        location: {
          name: 'Begalura',
        },
        manager: {
          name: 'Anil Reddy',
        },
      },
      {
        generalInfo: {
          fullName: 'Adija Venka 25',
        },
        compensation: {
          title: 'UX designer',
        },
        department: {
          name: 'Design',
        },
        location: {
          name: 'Begalura',
        },
        manager: {
          name: 'Anil Reddy',
        },
      },
      {
        generalInfo: {
          fullName: 'Adija Venka 25',
        },
        compensation: {
          title: 'UX designer',
        },
        department: {
          name: 'Design',
        },
        location: {
          name: 'Begalura',
        },
        manager: {
          name: 'Anil Reddy',
        },
      },
      {
        generalInfo: {
          fullName: 'Adija Venka ',
        },
        compensation: {
          title: 'UX designer',
        },
        department: {
          name: 'Design',
        },
        location: {
          name: 'Begalura',
        },
        manager: {
          name: 'Anil Reddy',
        },
      },
    ];
    return (
      <div className={styles.DirectoryComponent}>
        <div className={styles.boxCreate}>
          <NavLink to="/directory" className={styles.buttonCreate}>
            <PlusOutlined />
            <p className={styles.NameNewProfile}>Create New Profile</p>
          </NavLink>
          <div className={styles.Text}>
            <p className={styles.ViewText}>View Activity log </p>
            <span className={styles.ViewNumber}>(15)</span>
          </div>
        </div>
        <Tabs defaultActiveKey="1" className={styles.Tab}>
          {bottabs.map((tab) => (
            <TabPane tab={tab.name} key={tab.id}>
              <Layout>
                <TableFilter onToggle={this.handleToggle} collapsed={collapsed} />
                {collapsed ? <div className={styles.openSider} onClick={this.handleToggle} /> : ''}
                <Content
                  className="site-layout-background"
                  style={{
                    minHeight: 280,
                  }}
                >
                  <DirectotyTable list={employeesState} />
                </Content>
              </Layout>
            </TabPane>
          ))}
        </Tabs>
      </div>
    );
  }
}

DirectoryComponent.propTypes = {};

export default DirectoryComponent;
