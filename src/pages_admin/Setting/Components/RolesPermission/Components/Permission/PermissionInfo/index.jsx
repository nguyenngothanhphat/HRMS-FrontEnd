import React, { PureComponent } from 'react';
import { connect, history } from 'umi';
import { Row, Col, Table, Button } from 'antd';
import styles from '../index.less';

@connect(({ loading, adminSetting: { tempData: { listPermission = [] } = {} } = {} }) => ({
  loadingTable: loading.effects['adminSetting/fetchPermissionByIdRole'],
  loading: loading.effects['adminSetting/updatePermission'],
  listPermission,
}))
class PermissionInfo extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      listRowKeys: [],
      currentId: '',
    };
  }

  componentDidMount() {
    const { dispatch, id } = this.props;
    this.setState({
      currentId: id,
    });
    dispatch({
      type: 'adminSetting/fetchPermissionByIdRole',
      payload: { id },
    }).then((resp) => {
      const { permissions = [] } = resp;
      this.setState({ listRowKeys: permissions, currentId: id });
    });
  }

  componentDidUpdate() {
    const { currentId } = this.state;
    const { id, dispatch } = this.props;
    if (id !== currentId) {
      dispatch({
        type: 'adminSetting/fetchPermissionByIdRole',
        payload: { id },
      }).then((resp) => {
        const { permissions = [] } = resp;
        this.setState({ listRowKeys: permissions, currentId: id });
      });
    }
  }

  onSelectChange = (selectedRowKeys) => {
    this.setState({ listRowKeys: selectedRowKeys });
  };

  handleCancel = () => {
    history.push('/settings/');
  };

  handleSubmit = (selectedRowKeys) => {
    const { dispatch, id } = this.props;
    const getValues = { _id: id, permissions: selectedRowKeys };
    dispatch({
      type: 'adminSetting/updatePermission',
      payload: { getValues },
    });
  };

  render() {
    const { listRowKeys } = this.state;
    const { listPermission, loading, loadingTable } = this.props;
    const formatDataPermission = listPermission.map((item) => {
      const { _id: PermissionID, name: PermissionName } = item;
      return { PermissionID, PermissionName };
    });
    const getListDIRECTORY = formatDataPermission
      .filter((item) => Object.keys(item).some((k) => item[k].includes('P_DIRECTORY')))
      .map((item, index) => {
        const key = index + 11;
        return { key, ...item };
      });

    const getListUser = formatDataPermission
      .filter((item) => Object.keys(item).some((k) => item[k].includes('P_USERS')))
      .map((item, index) => {
        const key = index + 21;
        return { key, ...item };
      });

    const getListEmployees = formatDataPermission
      .filter((item) => Object.keys(item).some((k) => item[k].includes('P_EMPLOYEES')))
      .map((item, index) => {
        const key = index + 31;
        return { key, ...item };
      });

    const getProfileEmployees = formatDataPermission
      .filter((item) => Object.keys(item).some((k) => item[k].includes('P_PROFILE')))
      .map((item, index) => {
        const key = index + 41;
        return { key, ...item };
      });

    const getListOnBoarding = formatDataPermission
      .filter((item) => Object.keys(item).some((k) => item[k].includes('P_ONBOARDING')))
      .map((item, index) => {
        const key = index + 51;
        return { key, ...item };
      });

    const getListSETTING = formatDataPermission
      .filter((item) => Object.keys(item).some((k) => item[k].includes('P_SETTINGS')))
      .map((item, index) => {
        const key = index + 61;
        return { key, ...item };
      });

    const newData = [
      {
        key: 1,
        PermissionID: 'All DIRECTORY',
        PermissionName: 'DIRECTORY',
        children: getListDIRECTORY,
      },
      {
        key: 2,
        PermissionID: 'USER_All',
        PermissionName: 'USER',
        children: getListUser,
      },
      {
        key: 3,
        PermissionID: 'All EMPLOYEES',
        PermissionName: 'EMPLOYEES',
        children: getListEmployees,
      },
      {
        key: 4,
        PermissionID: 'All PROFILE',
        PermissionName: 'PROFILE',
        children: getProfileEmployees,
      },
      {
        key: 5,
        PermissionID: 'All ONBOARDING',
        PermissionName: 'ONBOARDING',
        children: getListOnBoarding,
      },
      {
        key: 6,
        PermissionID: 'All SETTING',
        PermissionName: 'SETTING',
        children: getListSETTING,
      },
    ];

    const rowSelection = {
      selectedRowKeys: listRowKeys,
      checkStrictly: false,
      onChange: (selectedRowKeys, selectedRows) =>
        this.onSelectChange(selectedRowKeys, selectedRows),
      columnWidth: '20%',
    };

    const columns = [
      {
        key: 2,
        title: 'Permission name',
        dataIndex: 'PermissionName',
        align: 'left',
      },
    ];
    return (
      <Row className={styles.displayContent} gutter={[24, 0]}>
        <Col span={24}>
          <Table
            loading={loadingTable}
            rowSelection={{ ...rowSelection }}
            columns={columns}
            dataSource={newData}
            indentSize={0}
            size="small"
            pagination={false}
            rowKey={(record) => record.PermissionID}
          />
        </Col>
        <Col span={24} className={styles.spaceFooter}>
          <Button className={styles.cancelFooter} onClick={this.handleCancel}>
            Cancel
          </Button>
          <Button
            loading={loading}
            className={styles.buttonFooter}
            onClick={() => this.handleSubmit(listRowKeys)}
          >
            Submit
          </Button>
        </Col>
      </Row>
    );
  }
}

export default PermissionInfo;
