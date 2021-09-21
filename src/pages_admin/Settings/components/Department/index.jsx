import { SearchOutlined } from '@ant-design/icons';
import { Button, Input } from 'antd';
import React, { PureComponent } from 'react';
import { connect } from 'umi';
import { debounce } from 'lodash';
import EditIcon from '@/assets/adminSetting/edit.svg';
import DeleteIcon from '@/assets/adminSetting/del.svg';
import CommonTable from '../CommonTable';
import EditModal from './components/EditModal';
import styles from './index.less';

@connect(({ loading, adminSetting: { tempData: { listDepartments = [] } = {} } = {} }) => ({
  listDepartments,
  loadingFetchDepartmentList: loading.effects['adminSetting/fetchDepartmentList'],
}))
class Department extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      selectedDepartmentID: '',
    };
    this.onSearchDebounce = debounce(this.onSearchDebounce, 500);
  }

  fetchDepartmentList = (name = '') => {
    const { dispatch } = this.props;
    dispatch({
      type: 'adminSetting/fetchDepartmentList',
      payload: {
        name,
      },
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
        dataIndex: 'departmentParentName',
        key: 'departmentParentName',
        width: '20%',
      },
      {
        title: 'HR POC',
        dataIndex: 'hrPOC',
        key: 'hrPOC',
        width: '17%',
        render: (hrPOC = {}) => {
          return <span>{hrPOC.generalInfo?.legalName}</span>;
        },
      },
      {
        title: 'Finance POC',
        dataIndex: 'financePOC',
        key: 'financePOC',
        width: '17%',
        render: (financePOC = {}) => {
          return <span>{financePOC.generalInfo?.legalName}</span>;
        },
      },

      {
        title: 'Action',
        dataIndex: 'action',
        key: 'action',
        align: 'center',
        render: (_, row) => {
          return (
            <div className={styles.actions}>
              <img src={DeleteIcon} onClick={() => this.onRemoveDepartment(row)} alt="" />
              <img src={EditIcon} onClick={() => this.onEditDepartment(row)} alt="" />
            </div>
          );
        },
      },
    ];

    return columns;
  };

  onEditDepartment = (row) => {
    this.setState({
      modalVisible: true,
      selectedDepartmentID: row._id,
    });
  };

  onRemoveDepartment = async (row) => {
    const { dispatch } = this.props;
    const res = await dispatch({
      type: 'adminSetting/removeDepartment',
      payload: {
        id: row._id,
      },
    });
    if (res.statusCode === 200) {
      this.fetchDepartmentList();
    }
  };

  renderHeader = () => {
    return (
      <div className={styles.header}>
        <div className={styles.searchBox}>
          <Input
            className={styles.searchInput}
            placeholder="Search Department"
            prefix={this.searchPrefix()}
            onChange={this.onSearch}
          />
        </div>
        <Button onClick={() => this.handleModalVisible(true)}>Add Department</Button>
      </div>
    );
  };

  onSearch = (e = {}) => {
    const { value = '' } = e.target;
    this.onSearchDebounce(value);
  };

  onSearchDebounce = (value) => {
    this.fetchDepartmentList(value);
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
    const { modalVisible, selectedDepartmentID } = this.state;
    const { listDepartments = [], loadingFetchDepartmentList = false } = this.props;
    return (
      <div
        className={styles.Department}
        style={listDepartments.length === 0 ? {} : { paddingBottom: '0' }}
      >
        {this.renderHeader()}
        <CommonTable
          columns={this.generateColumns()}
          list={listDepartments}
          loading={loadingFetchDepartmentList}
        />
        <EditModal
          visible={modalVisible}
          onClose={() => {
            this.handleModalVisible(false);
            this.setState({
              selectedDepartmentID: '',
            });
          }}
          onRefresh={this.fetchDepartmentList}
          selectedDepartmentID={selectedDepartmentID}
          action={selectedDepartmentID ? 'edit' : 'add'}
        />
      </div>
    );
  }
}
export default Department;
