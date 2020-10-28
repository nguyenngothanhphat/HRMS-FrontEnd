import React, { PureComponent } from 'react';
import { connect, history } from 'umi';
import { Row, Col, Table, Button } from 'antd';
import styles from '../index.less';

@connect(
  ({
    loading,
    adminSetting: { idRoles = '', tempData: { listPermission = [], formatData = [] } = {} } = {},
  }) => ({
    loadingTable: loading.effects['adminSetting/fetchPermissionByIdRole'],
    loading: loading.effects['adminSetting/updatePermission'],
    idRoles,
    listPermission,
    formatData,
  }),
)
class PermissionInfo extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      selectedRowKeys: [],
    };
  }

  componentDidMount() {
    const { dispatch, idRoles } = this.props;
    dispatch({
      type: 'adminSetting/fetchPermissionByIdRole',
      payload: { idRoles },
    }).then((resp) => {
      const { permissions } = resp;
      const getData = permissions.map((item) => item._id);
      this.setState({ selectedRowKeys: getData });
    });
  }

  onSelectChange = (selectedRowKeys) => {
    this.setState({ selectedRowKeys });
  };

  handleCancel = () => {
    history.push('/settings/');
  };

  handleSubmit = (selectedRowKeys, idRoles) => {
    const { dispatch } = this.props;
    const getValues = { _id: idRoles, permissions: selectedRowKeys };
    dispatch({
      type: 'adminSetting/updatePermission',
      payload: { getValues },
    });
  };

  render() {
    const { selectedRowKeys } = this.state;
    const { listPermission, loading, idRoles, loadingTable } = this.props;
    const formatDataPermission = listPermission.map((item) => {
      const { _id: PermissionID, name: PermissionName } = item;
      return { PermissionID, PermissionName };
    });
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };

    const columns = [
      {
        key: 2,
        title: 'Permission name',
        dataIndex: 'PermissionName',
        align: 'center',
      },
    ];
    return (
      <Row className={styles.displayContent} gutter={[24, 0]}>
        <Col span={24}>
          <Table
            loading={loadingTable}
            rowSelection={rowSelection}
            columns={columns}
            dataSource={formatDataPermission}
            size="small"
            pagination={false}
            rowKey="PermissionID"
          />
        </Col>
        <Col span={24} className={styles.spaceFooter}>
          <Button className={styles.cancelFooter} onClick={this.handleCancel}>
            Cancel
          </Button>
          <Button
            loading={loading}
            className={styles.buttonFooter}
            onClick={() => this.handleSubmit(selectedRowKeys, idRoles)}
          >
            Submit
          </Button>
        </Col>
      </Row>
    );
  }
}

export default PermissionInfo;
