import { Button, Input, Skeleton } from 'antd';
import React, { PureComponent } from 'react';
import { connect } from 'umi';
import { SearchOutlined } from '@ant-design/icons';
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
    };
  }

  componentDidMount = () => {
    this.fetchPositionList();
  };

  componentDidUpdate(prevProps, prevState) {
    const { page, limit } = this.state;

    if (page !== prevState.page || limit !== prevState.limit) this.fetchPositionList();
  }

  fetchPositionList = () => {
    const { dispatch } = this.props;
    const { page, limit } = this.state;
    dispatch({
      type: 'adminSetting/fetchListTitle',
      payload: { page, limit },
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
        dataIndex: 'role',
        key: 'role',
        width: '15%',
      },
      {
        title: 'Grade Level',
        dataIndex: 'grade',
        key: 'grade',
        width: '15%',
      },
      {
        title: 'Timesheet Required',
        dataIndex: 'timesheetRequired',
        key: 'timesheetRequired',
        width: '15%',
      },
      {
        title: 'Action',
        dataIndex: 'action',
        key: 'action',
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
      this.fetchPositionList();
    }
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
        <Button onClick={() => this.handleModalVisible(true)}>Add Position</Button>
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
      <div className={styles.Position}>
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
