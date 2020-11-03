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
      selectedRowKeys: [],
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
      this.setState({ selectedRowKeys: getData, currentId: id });
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
        this.setState({ selectedRowKeys: getData, currentId: id });
      });
    }
  }

  onSelectChange = (selectedRowKeys) => {
    // const { selectedRowKeys } = this.state;
    // console.log(selectedRows);
    // const getChildren = selectedRows.map((item) => (item.children ? item.children : ''));
    // const condition = getChildren.findIndex((item) => item !== '');
    // console.log(condition);
    // if (condition > -1) {
    //   const formatData = [];
    //   getChildren[condition].map((item) => {
    //     const { PermissionID } = item;
    //     return formatData.push(PermissionID);
    //   });
    //   const newData = [...selectedRowKeys, ...formatData];
    //   console.log(selectedRowKeys);
    //   this.setState({ selectedRowKeys: newData });
    // } else {
    //   this.setState({ selectedRowKeys });
    // }

    // const findAll = selectedRowKeys.findIndex((item) => item.includes('All'));
    // console.log(selectedRowKeys, findAll);
    this.setState({ selectedRowKeys });
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
    const { selectedRowKeys } = this.state;
    // console.log(selectedRowKeys);
    const { listPermission, loading, loadingTable } = this.props;
    const formatDataPermission = listPermission.map((item) => {
      const { _id: PermissionID, name: PermissionName } = item;
      return { PermissionID, PermissionName };
    });
    // const getListDIRECTORY = formatDataPermission
    //   .filter((item) => Object.keys(item).some((k) => item[k].includes('P_DIRECTORY')))
    //   .map((item, index) => {
    //     const key = index + 11;
    //     return { key, ...item };
    //   });

    // const getListUser = formatDataPermission
    //   .filter((item) => Object.keys(item).some((k) => item[k].includes('P_USERS')))
    //   .map((item, index) => {
    //     const key = index + 21;
    //     return { key, ...item };
    //   });

    // const getListSETTING = formatDataPermission
    //   .filter((item) => Object.keys(item).some((k) => item[k].includes('P_SETTINGS')))
    //   .map((item, index) => {
    //     const key = index + 51;
    //     return { key, ...item };
    //   });

    // const newData = [
    //   {
    //     key: 1,
    //     PermissionID: 'All DIRECTORY',
    //     PermissionName: 'DIRECTORY',
    //     children: getListDIRECTORY,
    //   },
    //   {
    //     key: 2,
    //     PermissionID: 'USER_All',
    //     PermissionName: 'USER',
    //     children: getListUser,
    //   },
    //   {
    //     key: 5,
    //     PermissionName: 'SETTING',
    //     children: getListSETTING,
    //   },
    // ];
    // const filterArrays = selectedRowKeys.filter((elem, index, self) => {
    //   return index === self.indexOf(elem);
    // });
    // console.log(filterArrays);
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
      columnWidth: '20%',
      // onSelect: (record, selected, selectedRows) => {
      //   this.handleSelect(record);
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
            rowSelection={{ ...rowSelection }}
            columns={columns}
            // dataSource={newData}
            dataSource={formatDataPermission}
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
            onClick={() => this.handleSubmit(selectedRowKeys)}
          >
            Submit
          </Button>
        </Col>
      </Row>
    );
  }
}

export default PermissionInfo;
