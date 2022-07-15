import { Tabs } from 'antd';
import React, { PureComponent } from 'react';
import { connect, formatMessage, history } from 'umi';
import { DownloadOutlined } from '@ant-design/icons';
import { PageContainer } from '@/layouts/layout/src';
import Settings from './components/Settings';
// import exportToCSV from '@/utils/exportAsExcel';
import TableContainer from './components/TableContainer';
import style from './index.less';
import { exportRawDataToCSV } from '@/utils/utils';

@connect(
  ({ customerManagement: { customerListPayload = {}, customerFilterListPayload = {} } = {} }) => ({
    customerListPayload,
    customerFilterListPayload,
  }),
)
class Customer extends PureComponent {
  componentDidMount() {
    const {
      match: { params: { tabName = '' } = {} },
      // dispatch,
    } = this.props;
    if (!tabName) {
      history.replace('/customer-management/customers');
    }
  }

  exportCustomers = async () => {
    const { dispatch, customerListPayload = {}, customerFilterListPayload = {} } = this.props;

    const getListExport = await dispatch({
      type: 'customerManagement/exportReport',
      payload: {
        ...customerListPayload,
        ...customerFilterListPayload,
      },
    });
    const { data = '' } = getListExport;
    exportRawDataToCSV(data, 'customers.csv');
  };

  render() {
    const { TabPane } = Tabs;
    const {
      match: {
        params: { tabName = '' },
      },
    } = this.props;

    if (!tabName) return '';
    return (
      <PageContainer>
        <div className={style.customerManagement}>
          <Tabs
            activeKey={tabName || 'customers'}
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
                  onClick={this.exportCustomers}
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
