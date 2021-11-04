import { Tabs } from 'antd';
import React, { PureComponent } from 'react';
import { connect, formatMessage, history } from 'umi';
import { DownloadOutlined } from '@ant-design/icons';
import { PageContainer } from '@/layouts/layout/src';
import Settings from './components/Settings';
import TableContainer from './components/TableContainer';
import style from './index.less';
import exportToCSV from '@/utils/exportAsExcel';

@connect()
class Customer extends PureComponent {
  componentDidMount() {
    const {
      match: { params: { tabName = '' } = {} },
      // dispatch,
    } = this.props;
    if (tabName === 'customers') {
      history.replace('/customer-management/customers');
    } else if (tabName === 'settings') {
      history.replace('/customer-management/settings');
    }
    // dispatch({
    //   type: 'customerManagement/fetchCustomerList',
    // });
  }

  exportFile = () => {
    const { dispatch } = this.props;

    dispatch({
      type: 'customerManagement/exportReport',
    });
  };

  processData = (data) => {};

  render() {
    const { TabPane } = Tabs;
    const {
      match: {
        params: { tabName = '' },
      },
    } = this.props;
    return (
      <PageContainer>
        <div className={style.customerManagement}>
          <Tabs
            activeKey={tabName === '' || tabName === 'customers' ? 'customers' || '' : 'settings'}
            onChange={(key) => {
              history.push(`/customer-management/${key}`);
            }}
            tabBarExtraContent={
              <>
                <p
                  style={{
                    marginBottom: '0',
                    marginRight: '32px',
                    color: '#ffa100',
                    fontWeight: '700',
                    cursor: 'pointer',
                  }}
                  onClick={this.exportFile}
                >
                  <DownloadOutlined /> Export
                </p>
              </>
            }
          >
            <TabPane
              tab={formatMessage({ id: 'page.customermanagement.customerTab' })}
              key="customers"
            >
              <TableContainer />
            </TabPane>
            <TabPane
              tab={formatMessage({ id: 'page.customermanagement.settingTab' })}
              key="settings"
            >
              <Settings />
            </TabPane>
          </Tabs>
        </div>
      </PageContainer>
    );
  }
}

export default Customer;
