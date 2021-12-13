import { Button, Input, Skeleton } from 'antd';
import React, { PureComponent } from 'react';
import { connect } from 'umi';
import { SearchOutlined } from '@ant-design/icons';
import { debounce } from 'lodash';
import CommonTable from '../CommonTable';
import EditIcon from '@/assets/adminSetting/edit.svg';
import DeleteIcon from '@/assets/adminSetting/del.svg';
import styles from './index.less';
import EditModal from './components/EditModal';

@connect(
  ({ loading, adminSetting: { tempData: { listTitles = [], totalTitle = 0 } = {} } = {} }) => ({
    listTitles,
    totalTitle,
    loadingFetchPositionList: loading.effects['adminSetting/fetchListTitle'],
  }),
)
class Position extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      selectedPositionID: '',
      page: 1,
      limit: 10,
      searchValue: '',
    };
    this.onSearchDebounce = debounce(this.onSearchDebounce, 500);
  }

  componentDidMount = () => {
    this.fetchPositionList();
  };

  componentDidUpdate(prevProps, prevState) {
    const { page, limit, searchValue } = this.state;
    if (page !== prevState.page || limit !== prevState.limit) this.fetchPositionList(searchValue);
  }

  fetchPositionList = (name = '') => {
    const { dispatch } = this.props;
    const { page, limit } = this.state;
    dispatch({
      type: 'adminSetting/fetchListTitle',
      payload: { name, page, limit },
    });
  };

  handleModalVisible = (value) => {
    this.setState({
      modalVisible: value,
    });
  };

  generateColumns = () => {
    const columns = [
      {
        title: 'Position Name',
        dataIndex: 'name',
        key: 'name',
        width: '20%',
        // render: (id) => {
        //   return <span className={styles.roleName}>{id}</span>;
        // },
      },
      {
        title: 'Department Name',
        dataIndex: 'department',
        key: 'department',
        render: (_, record) => record.department?.name || '',
        width: '20%',
      },
      {
        title: 'Role',
        dataIndex: 'roles',
        key: 'roles',
        width: '15%',
        render: (roles = []) => {
          return (
            <div>
              {roles.map((id) => (
                <span className={styles.roleTag}>{id}</span>
              ))}
            </div>
          );
        },
      },
      {
        title: 'Grade Level',
        dataIndex: 'gradeObj',
        key: 'gradeObj',
        width: '15%',
        render: (gradeObj = {}) => {
          return <span>{gradeObj.name || ''}</span>;
        },
      },
      {
        title: 'Timesheet Required',
        dataIndex: 'timeSheetRequired',
        key: 'timeSheetRequired',
        width: '15%',
        render: (value) => (value ? <span>Yes</span> : <span>No</span>),
      },
      {
        title: 'Action',
        dataIndex: 'action',
        key: 'action',
        align: 'center',
        render: (_, row) => {
          return (
            <div className={styles.actions}>
              <img src={DeleteIcon} onClick={() => this.onRemovePosition(row)} alt="" />
              <img src={EditIcon} onClick={() => this.onEditPosition(row)} alt="" />
            </div>
          );
        },
      },
    ];

    return columns;
  };

  onEditPosition = (row) => {
    this.setState({
      modalVisible: true,
      selectedPositionID: row._id,
    });
  };

  onRemovePosition = async (row) => {
    const { dispatch } = this.props;
    const res = await dispatch({
      type: 'adminSetting/removePosition',
      payload: {
        id: row._id,
      },
    });
    if (res.statusCode === 200) {
      const { searchValue } = this.state;
      this.fetchPositionList(searchValue);
    }
  };

  renderHeader = () => {
    return (
      <div className={styles.header}>
        <div className={styles.searchBox}>
          <Input
            className={styles.searchInput}
            placeholder="Search Position"
            prefix={this.searchPrefix()}
            onChange={this.onSearch}
          />
        </div>
        <Button onClick={() => this.handleModalVisible(true)}>Add Position</Button>
      </div>
    );
  };

  onSearch = (e = {}) => {
    const { value = '' } = e.target;
    this.onSearchDebounce(value);
  };

  onSearchDebounce = (value) => {
    this.fetchPositionList(value);
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

  onChangePage = (page, limit) => {
    this.setState({
      page,
      limit,
    });
  };

  render() {
    const { modalVisible, selectedPositionID, limit, page } = this.state;
    const { listTitles = [], loadingFetchPositionList = false, totalTitle = 0 } = this.props;
    return (
      <div
        className={styles.Position}
        style={listTitles.length === 0 ? {} : { paddingBottom: '0' }}
      >
        {this.renderHeader()}
        <CommonTable
          columns={this.generateColumns()}
          list={listTitles}
          isBackendPaging
          page={page}
          limit={limit}
          total={totalTitle}
          onChangePage={this.onChangePage}
          loading={loadingFetchPositionList}
        />
        <EditModal
          visible={modalVisible}
          onClose={() => {
            this.handleModalVisible(false);
            this.setState({
              selectedPositionID: '',
            });
          }}
          onRefresh={this.fetchPositionList}
          selectedPositionID={selectedPositionID}
          action={selectedPositionID ? 'edit' : 'add'}
        />
      </div>
    );
  }
}
export default Position;
