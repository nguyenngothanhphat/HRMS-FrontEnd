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
      const { permissions } = resp;
      const getData = permissions.map((item) => item._id);
      this.setState({ listRowKeys: getData, currentId: id });
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
        const { permissions } = resp;
        const getData = permissions.map((item) => item._id);
        this.setState({ listRowKeys: getData, currentId: id });
      });
    }
  }

  onSelectChange = (selectedRowKeys, selectedRows) => {
    // const { listRowKeys } = this.state;
    selectedRows.forEach((item) => {
      if (item.children) {
        // console.log('abc');
      }
      // console.log('not abc');
    });
    // const condition = getChildren.findIndex((item) => item !== '');
    // console.log(getChildren[condition]);
    // console.log(condition);
    // if (getChildren[condition]) {
    //   const formatData = [];
    //   getChildren[condition].map((item) => {
    //     const { PermissionID } = item;
    //     return formatData.push(PermissionID);
    //   });
    //   const newData = [...selectedRowKeys, ...formatData];
    //   const filterData = newData.filter((elem, index, self) => {
    //     return index === self.indexOf(elem);
    //   });
    //   console.log(filterData);
    //   this.setState({ listRowKeys: filterData });
    // } else {
    //   this.setState({ listRowKeys: selectedRowKeys });
    // }
    // const findAll = selectedRowKeys.findIndex((item) => item.includes('All'));
    // console.log(selectedRowKeys, findAll);
    // this.setState({ listRowKeys: selectedRowKeys });
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
    // console.log(listRowKeys);
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
    const getListOnBoarding = formatDataPermission
      .filter((item) => Object.keys(item).some((k) => item[k].includes('P_ONBOARDING')))
      .map((item, index) => {
        const key = index + 41;
        return { key, ...item };
      });

    const getListSETTING = formatDataPermission
      .filter((item) => Object.keys(item).some((k) => item[k].includes('P_SETTINGS')))
      .map((item, index) => {
        const key = index + 51;
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
        PermissionID: 'All ONBOARDING',
        PermissionName: 'ONBOARDING',
        children: getListOnBoarding,
      },
      {
        key: 5,
        PermissionName: 'SETTING',
        children: getListSETTING,
      },
    ];
    const rowSelection = {
      selectedRowKeys: listRowKeys,
      onChange: (selectedRowKeys, selectedRows) =>
        this.onSelectChange(selectedRowKeys, selectedRows),
      columnWidth: '20%',
      // onSelect: (record, selected, selectedRows) => {
      //   this.getValues(record);
      // },
      // onSelectAll: (selected, selectedRows, changeRows) => {
      //   console.log(changeRows);
      //   changeRows.map((item) => this.getValues(item));
      // },
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
            rowSelection={rowSelection}
            columns={columns}
            dataSource={newData}
            indentSize={0}
            // dataSource={formatDataPermission}
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
