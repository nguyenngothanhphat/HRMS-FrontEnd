import { getCurrentCompany, getCurrentTenant } from '@/utils/authority';
import { Input, Tabs } from 'antd';
import React, { PureComponent } from 'react';
import { connect } from 'umi';
import TemplateTable from './components/TemplateTable';
import DocumentTable from './components/DocumentTable';
import SearchIcon from './images/search.svg';
import SortIcon from './images/sort.svg';
import ViewModeIcon from './images/view.svg';
import AddDocumentModal from './components/AddDocumentModal';
import styles from './index.less';

const { TabPane } = Tabs;

@connect(
  ({
    loading,
    user: { currentUser = {} } = {},
    employeeSetting: {
      documentListOnboarding = [],
      defaultTemplateListOnboarding = [],
      customTemplateListOnboarding = [],
      uploadDocumentModalVisible = false,
      activeTabDocument,
    },
  }) => ({
    currentUser,
    documentListOnboarding,
    defaultTemplateListOnboarding,
    customTemplateListOnboarding,
    loadingDocumentList: loading.effects['employeeSetting/fetchDocumentListOnboarding'],
    loadingDefaultTemplateList:
      loading.effects['employeeSetting/fetchDefaultTemplateListOnboarding'],
    loadingCustomTemplateList: loading.effects['employeeSetting/fetchCustomTemplateListOnboarding'],
    uploadDocumentModalVisible,
    activeTabDocument,
  }),
)
class TableContainer extends PureComponent {
  fetchData = (key = '1') => {
    const { dispatch } = this.props;
    if (key === '1')
      dispatch({
        type: 'employeeSetting/fetchDocumentListOnboarding',
        payload: {
          tenantId: getCurrentTenant(),
          module: 'ON_BOARDING',
          company: getCurrentCompany(),
        },
      });
    if (key === '2')
      dispatch({
        type: 'employeeSetting/fetchDefaultTemplateListOnboarding',
        payload: {
          tenantId: getCurrentTenant(),
          type: 'ON_BOARDING',
        },
      });
    if (key === '3')
      dispatch({
        type: 'employeeSetting/fetchCustomTemplateListOnboarding',
        payload: {
          tenantId: getCurrentTenant(),
          type: 'ON_BOARDING',
        },
      });

    dispatch({
      type: 'employeeSetting/save',
      payload: {
        activeTabDocument: key,
      },
    });
  };

  componentDidMount = () => {
    const { activeTabDocument = '1' } = this.props;
    this.fetchData(activeTabDocument);
  };

  operations = () => {
    return (
      <div className={styles.operations}>
        <div className={styles.searchBox}>
          <Input placeholder="Search" prefix={<img src={SearchIcon} alt="search" />} />
        </div>
        <div className={styles.sortIcon}>
          <img src={SortIcon} alt="sort" />
        </div>
        <div className={styles.viewModeIcon}>
          <img src={ViewModeIcon} alt="viewMode" />
        </div>
      </div>
    );
  };

  // handle upload document setting modal

  onCloseUploadDocument = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'employeeSetting/save',
      payload: {
        uploadDocumentModalVisible: false,
      },
    });
  };

  onAddDocument = async (values) => {
    const { key = '', uploadedFile: { id: attachment = '' } = {} } = values || {};
    const {
      dispatch,
      currentUser: { _id: userMap = '' },
    } = this.props;

    const payload = {
      tenantId: getCurrentTenant(),
      company: getCurrentCompany(),
      key, // file name
      attachment,
      documentType: '',
      module: 'ON_BOARDING',
      userMap,
    };

    const res = await dispatch({
      type: 'employeeSetting/addDocumentSetting',
      payload,
    });
    if (res?.statusCode === 200) {
      this.onCloseUploadDocument();
      this.fetchData('1');
    }
  };

  render() {
    const {
      defaultTemplateListOnboarding = [],
      loadingDefaultTemplateList = false,
      customTemplateListOnboarding = [],
      loadingCustomTemplateList = false,
      documentListOnboarding = [],
      loadingDocumentList = false,
      uploadDocumentModalVisible = false,
      activeTabDocument = '',
    } = this.props;

    return (
      <div className={styles.TableContainer}>
        <div className={styles.tabs}>
          <Tabs defaultActiveKey={activeTabDocument} onTabClick={(key) => this.fetchData(key)}>
            <TabPane tab="Documents" key="1">
              <DocumentTable
                list={documentListOnboarding}
                loading={loadingDocumentList}
                refreshData={() => this.fetchData('1')}
              />
            </TabPane>
            <TabPane tab="System Default Templates" key="2">
              <TemplateTable
                list={defaultTemplateListOnboarding}
                loading={loadingDefaultTemplateList}
                inTab
              />
            </TabPane>
            <TabPane tab="Custom templates" key="3">
              <TemplateTable
                list={customTemplateListOnboarding}
                loading={loadingCustomTemplateList}
                inTab
              />
            </TabPane>
          </Tabs>
        </div>

        <AddDocumentModal
          visible={uploadDocumentModalVisible}
          onClose={this.onCloseUploadDocument}
          onAdd={this.onAddDocument}
        />
      </div>
    );
  }
}

export default TableContainer;
