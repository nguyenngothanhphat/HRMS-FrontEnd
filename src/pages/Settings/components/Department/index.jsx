import { SearchOutlined } from '@ant-design/icons';
import { Button, Input, notification, Popconfirm } from 'antd';
import React, { PureComponent } from 'react';
import { connect } from 'umi';
import { debounce } from 'lodash';
import EditIcon from '@/assets/adminSetting/edit.svg';
import DeleteIcon from '@/assets/adminSetting/del.svg';
import CommonTable from '../CommonTable';
import EditModal from './components/EditModal';
import styles from './index.less';

@connect(
  ({
    loading,
    adminSetting: { tempData: { listDepartments = [], totalDepartmentList = 0 } = {} } = {},
  }) => ({
    listDepartments,
    totalDepartmentList,
    loadingFetchDepartmentList: loading.effects['adminSetting/fetchDepartmentList'],
  }),
)
class Department extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      selectedDepartmentID: '',
      searchValue: '',
      limit: 10,
      page: 1,
    };
    this.onSearchDebounce = debounce(this.onSearchDebounce, 500);
  }

  fetchDepartmentList = (name = '') => {
    const { dispatch } = this.props;
    const { limit, page } = this.state;
    dispatch({
      type: 'adminSetting/fetchDepartmentList',
      payload: {
        name,
        limit,
        page,
      },
    });
  };

  componentDidMount = () => {
    this.fetchDepartmentList();
  };

  componentDidUpdate = (prevProps, prevState) => {
    const { page, size } = this.state;
    if (prevState.page !== page || prevState.size !== size) {
      this.fetchDepartmentList();
    }
  };

  onChangePage = (page, limit) => {
    this.setState({ page, limit });
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
        dataIndex: 'departmentParentInfo',
        key: 'departmentParentInfo',
        width: '20%',
        render: (departmentParentInfo = {}) => {
          return <span>{departmentParentInfo.name || ''}</span>;
        },
      },
      {
        title: 'HR POC',
        dataIndex: 'hrPOC',
        key: 'hrPOC',
        width: '17%',
        render: (hrPOC = {}) => {
          return <span>{hrPOC.generalInfoInfo?.legalName}</span>;
        },
      },
      {
        title: 'Finance POC',
        dataIndex: 'financePOC',
        key: 'financePOC',
        width: '17%',
        render: (financePOC = {}) => {
          return <span>{financePOC.generalInfoInfo?.legalName}</span>;
        },
      },

      {
        title: 'Action',
        dataIndex: 'action',
        key: 'action',
        align: 'center',
        render: (_, row) => {
          const disabled =
            row.name === 'Engineering' ||
            row.name === 'Finance' ||
            row.name === 'Legal' ||
            row.name === 'HR' ||
            row.name === 'Sales' ||
            row.name === 'Marketing' ||
            row.name === 'Operations & Facility management';

          return (
            <div className={styles.actions}>
              {disabled ? (
                <img style={{ opacity: 0.5, cursor: 'not-allowed' }} src={DeleteIcon} alt="" />
              ) : (
                <Popconfirm title="Sure to remove?" onConfirm={() => this.onRemoveDepartment(row)}>
                  <img src={DeleteIcon} alt="" />
                </Popconfirm>
              )}

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
    const { listDepartments = [] } = this.props;

    let hasChildDept = false;
    listDepartments.forEach((item) => {
      if (item?.departmentParentName === row.name) {
        hasChildDept = true;
      }
    });

    if (hasChildDept) {
      notification.error('This department cannot be deleted');
    } else {
      const res = await dispatch({
        type: 'adminSetting/removeDepartment',
        payload: {
          id: row._id,
        },
      });
      if (res.statusCode === 200) {
        const { searchValue } = this.state;
        this.fetchDepartmentList(searchValue);
      }
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
    this.setState({
      searchValue: value,
    });
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
    const { modalVisible, selectedDepartmentID, page, size } = this.state;
    const {
      listDepartments = [],
      loadingFetchDepartmentList = false,
      totalDepartmentList = 0,
    } = this.props;
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
          total={totalDepartmentList}
          isBackendPaging
          page={page}
          size={size}
          onChangePage={this.onChangePage}
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
          listDepartments={listDepartments}
        />
      </div>
    );
  }
}
export default Department;
