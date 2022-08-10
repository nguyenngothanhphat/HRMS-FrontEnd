import { Tabs } from 'antd';
import React, { PureComponent } from 'react';
import { connect, formatMessage, history } from 'umi';
import CustomOrangeButton from '@/components/CustomOrangeButton';
import { PageContainer } from '@/layouts/layout/src';
import { exportRawDataToCSV } from '@/utils/exportToCsv';
import Settings from './components/Settings';
import TableContainer from './components/TableContainer';
import DownloadIcon from '@/assets/timeSheet/download.svg';
import styles from './index.less';
import { goToTop } from '@/utils/utils';

@connect(
  ({ customerManagement: { customerListPayload = {}, customerFilterListPayload = {} } = {} }) => ({
    customerListPayload,
    customerFilterListPayload,
  }),
)
class CustomerManagement extends PureComponent {
  componentDidMount = () => {
    goToTop();
  };

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
    exportRawDataToCSV(data, 'customers');
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
        <div className={styles.CustomerManagement}>
          <Tabs
            activeKey={tabName || 'list'}
            onChange={(key) => {
              history.push(`/customer-management/${key}`);
            }}
            tabBarExtraContent={
              <div className={styles.options}>
                <CustomOrangeButton onClick={this.exportCustomers} icon={DownloadIcon}>
                  Export
                </CustomOrangeButton>
              </div>
            }
          >
            <TabPane tab={formatMessage({ id: 'page.customermanagement.customerTab' })} key="list">
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

export default CustomerManagement;
