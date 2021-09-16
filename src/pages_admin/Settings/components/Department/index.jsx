import { Button, Input, Skeleton } from 'antd';
import React, { PureComponent } from 'react';
import { connect } from 'umi';
import { SearchOutlined } from '@ant-design/icons';
import CommonTable from '../CommonTable';
import EditIcon from '@/assets/adminSetting/edit.svg';
import DeleteIcon from '@/assets/adminSetting/del.svg';
import styles from './index.less';
import EditModal from './components/EditModal';

@connect(({ loading, adminSetting: { tempData: { listDepartments = [] } = {} } = {} }) => ({
  listDepartments,
  loadingfetchDepartmentList: loading.effects['adminSetting/fetchDepartmentList'],
}))
class Department extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
    };
  }

  fetchDepartmentList = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'adminSetting/fetchDepartmentList',
    });
  };

  componentDidMount = () => {
    this.fetchDepartmentList();
  };

  handleModalVisible = (value) => {
    this.setState({
      modalVisible: value,
    });
  };

  generateColumns = () => {
    const columns = [
      {
        title: 'Department ID',
        dataIndex: 'departmentId',
        key: 'departmentId',
        width: '15%',
        // render: (id) => {
        //   return <span className={styles.roleName}>{id}</span>;
        // },
      },
      {
        title: 'Department Name',
        dataIndex: 'name',
        key: 'name',
        // width: '15%',
      },
      {
        title: 'Parent Department',
        dataIndex: 'parentDepartment',
        key: 'parentDepartment',
        width: '20%',
      },
      {
        title: 'HR POC',
        dataIndex: 'HRPOC',
        key: 'HRPOC',
        width: '17%',
      },
      {
        title: 'Finance POC',
        dataIndex: 'financePOC',
        key: 'financePOC',
        width: '17%',
      },

      {
        title: 'Action',
        dataIndex: 'action',
        key: 'action',
        render: () => {
          return (
            <div className={styles.actions}>
              <img src={DeleteIcon} alt="" />
              <img src={EditIcon} alt="" />
            </div>
          );
        },
      },
    ];

    return columns;
  };

  renderHeader = () => {
    return (
      <div className={styles.header}>
        <div className={styles.searchBox}>
          <Input
            className={styles.searchInput}
            placeholder="Search messages..."
            prefix={this.searchPrefix()}
          />
        </div>
        <Button onClick={() => this.handleModalVisible(true)}>Add Department</Button>
      </div>
    );
  };

  // search box
  searchPrefix = () => {
    return (
      <SearchOutlined
        style={{
          fontSize: 16,
          color: 'black',
          marginRight: '10px',
        }}
      />
    );
  };

  render() {
    const { modalVisible } = this.state;
    const { listDepartments = [], loadingfetchDepartmentList = false } = this.props;
    if (loadingfetchDepartmentList) {
      return (
        <div className={styles.Department}>
          <Skeleton />
        </div>
      );
    }
    return (
      <div className={styles.Department}>
        {this.renderHeader()}
        <CommonTable columns={this.generateColumns()} list={listDepartments} />
        <EditModal visible={modalVisible} onClose={() => this.handleModalVisible(false)} />
      </div>
    );
  }
}
export default Department;
