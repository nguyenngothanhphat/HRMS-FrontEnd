/* eslint-disable react/jsx-curly-newline */
import Breadcrumb from '@/components/Breadcrumb';
import DownloadTemplate from '@/components/DownloadEmployeeTemplate';
import UploadListEmployee from '@/components/UploadListEmployee';
import React from 'react';
import { Spin, Button } from 'antd';
import { connect, history } from 'umi';
import Table from './Components/TableListActive';
import s from './index.less';

const routes = [
  { name: 'Getting Started', path: '/control-panel/get-started' },
  {
    name: 'Setup Employee Directory',
    path: '/control-panel/get-started/setup-employee-directory',
  },
];

@connect(
  ({ user: { currentUser = {} } = {}, employee: { listEmployeeActive = [] } = {}, loading }) => ({
    currentUser,
    listEmployeeActive,
    loading: loading.effects['employee/fetchListEmployeeActive'],
  }),
)
class SetupEmployeeDirectory extends React.PureComponent {
  componentDidMount() {
    const { dispatch, currentUser: { company: { _id: id = '' } = {} } = {} } = this.props;
    dispatch({
      type: 'employee/fetchListEmployeeActive',
      payload: {
        company: id,
      },
    });
  }

  renderContent = () => {
    const { listEmployeeActive = [] } = this.props;
    return listEmployeeActive.length === 1 ? (
      <>
        <div style={{ marginBottom: '24px' }}>
          <DownloadTemplate />
        </div>
        <UploadListEmployee />
      </>
    ) : (
      <div style={{ width: '85%' }}>
        <Table data={listEmployeeActive} />
        <div className={s.viewBtn}>
          <Button
            className={s.btnUserManagement}
            onClick={() =>
              history.push({
                pathname: '/control-panel/get-started/company-profile',
                state: { activeTag: '2' },
              })
            }
          >
            Go to User Management
          </Button>
        </div>
      </div>
    );
  };

  render() {
    const { loading } = this.props;
    return (
      <>
        <Breadcrumb routes={routes} />
        <div className={s.root}>
          <div className={s.titlePage}>Setup Employee Directory</div>
          {loading ? (
            <div className={s.viewLoading}>
              <Spin size="large" />
            </div>
          ) : (
            <div className={s.content}>{this.renderContent()}</div>
          )}
        </div>
      </>
    );
  }
}

export default SetupEmployeeDirectory;
