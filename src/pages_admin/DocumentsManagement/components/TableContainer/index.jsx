import React, { PureComponent } from 'react';
import { NavLink, connect, formatMessage } from 'umi';
import { Tabs, Layout } from 'antd';
import addDocument from '../../../../../public/assets/images/addMemberIcon.svg';
import importDocuments from '../../../../../public/assets/images/import.svg';
import TableDocuments from '../TableDocuments';
import styles from './index.less';

@connect(({ loading, documentsManagement }) => ({
  loadingList: loading.effects['documentsManagement/fetchListDocuments'],
  documentsManagement,
}))
class TableContainer extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      tabId: 1,
      bottabs: [
        {
          id: 1,
          name: formatMessage({ id: 'pages_admin.documents.documentTable.activeDocumentsTab' }),
        },
        {
          id: 2,
          name: formatMessage({ id: 'pages_admin.documents.documentTable.inactiveDocumentsTab' }),
        },
      ],
    };
  }

  componentDidMount() {
    this.initDataTable();
  }

  componentDidUpdate(prevProps, prevState) {
    const { tabId } = this.state;

    if (prevState.tabId !== tabId) {
      this.getDataTable();
    }
  }

  initDataTable = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'documentsManagement/fetchListDocuments',
    });
  };

  getDataTable = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'documentsManagement/fetchListDocuments',
    });
  };

  renderListDocuments = (tabId) => {
    const {
      documentsManagement: { listDocuments = [] },
    } = this.props;

    const listDocumentsActive = [];
    const listDocumentsInactive = [];

    listDocuments.forEach((row) => {
      if (row.status === 'ACTIVE') {
        listDocumentsActive.push(row);
      } else {
        listDocumentsInactive.push(row);
      }
    });

    if (tabId === 1) {
      return listDocumentsActive;
    }
    return listDocumentsInactive;
  };

  rightButton = () => {
    return (
      <div className={styles.tabBarExtra}>
        <NavLink to="/#" className={styles.buttonAdd}>
          <img src={importDocuments} alt="import-documents" />
          <span className={styles.NameNewProfile}>
            {formatMessage({ id: 'pages_admin.documents.documentTable.importDocuments' })}
          </span>
        </NavLink>
        <NavLink to="/documents/upload-document" className={styles.buttonAdd}>
          <img src={addDocument} alt="add-document" />
          <span className={styles.NameNewProfile}>
            {formatMessage({ id: 'pages_admin.documents.documentTable.addDocument' })}
          </span>
        </NavLink>
      </div>
    );
  };

  render() {
    const { Content } = Layout;
    const { TabPane } = Tabs;
    const { bottabs } = this.state;
    const { loadingList } = this.props;

    return (
      <div className={styles.DocumentTableContainer}>
        <div className={styles.contentContainer}>
          <Tabs
            defaultActiveKey="1"
            className={styles.TabComponent}
            tabBarExtraContent={this.rightButton()}
          >
            {bottabs.map((tab) => (
              <TabPane tab={tab.name} key={tab.id}>
                <Layout className={styles.directoryLayout_inner}>
                  <Content className="site-layout-background">
                    <TableDocuments
                      loading={loadingList || loadingList}
                      data={this.renderListDocuments(tab.id)}
                    />
                  </Content>
                </Layout>
              </TabPane>
            ))}
          </Tabs>
        </div>
      </div>
    );
  }
}

TableContainer.propTypes = {};

export default TableContainer;
