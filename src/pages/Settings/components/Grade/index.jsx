import { Button, Popconfirm } from 'antd';
import React, { PureComponent } from 'react';
import { connect } from 'umi';
import { SearchOutlined } from '@ant-design/icons';
import CommonTable from '../CommonTable';
import EditIcon from '@/assets/adminSetting/edit.svg';
import DeleteIcon from '@/assets/adminSetting/del.svg';
import styles from './index.less';
import EditModal from './components/EditModal';

@connect(({ loading, adminSetting: { tempData: { listGrades = [] } = {} } = {} }) => ({
  listGrades,
  loadingfetchGradeList: loading.effects['adminSetting/fetchGradeList'],
}))
class Grade extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      selectedGradeID: '',
    };
  }

  fetchGradeList = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'adminSetting/fetchGradeList',
    });
  };

  componentDidMount = () => {
    this.fetchGradeList();
  };

  handleModalVisible = (value) => {
    this.setState({
      modalVisible: value,
    });
  };

  generateColumns = () => {
    const columns = [
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        width: '80%',
        // render: (id) => {
        //   return <span className={styles.roleName}>{id}</span>;
        // },
      },
      {
        title: 'Action',
        dataIndex: 'action',
        key: 'action',
        align: 'center',
        render: (_, row) => {
          return (
            <div className={styles.actions}>
              <Popconfirm title="Sure to remove?" onConfirm={() => this.onRemoveGrade(row)}>
                <img src={DeleteIcon} alt="" />
              </Popconfirm>
              <img src={EditIcon} onClick={() => this.onEditGrade(row)} alt="" />
            </div>
          );
        },
      },
    ];

    return columns;
  };

  onEditGrade = (row) => {
    this.setState({
      modalVisible: true,
      selectedGradeID: row._id,
    });
  };

  onRemoveGrade = async (row) => {
    const { dispatch } = this.props;
    const res = await dispatch({
      type: 'adminSetting/removeGrade',
      payload: {
        id: row._id,
      },
    });
    if (res.statusCode === 200) {
      this.fetchGradeList();
    }
  };

  renderHeader = () => {
    return (
      <div className={styles.header}>
        {/* <div className={styles.searchBox}>
          <Input
            className={styles.searchInput}
            placeholder="Search messages..."
            prefix={this.searchPrefix()}
          />
        </div> */}
        <Button onClick={() => this.handleModalVisible(true)}>Add Grade</Button>
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
    const { modalVisible, selectedGradeID } = this.state;
    const { listGrades = [], loadingfetchGradeList = false } = this.props;
    return (
      <div className={styles.Grade} style={listGrades.length === 0 ? {} : { paddingBottom: '0' }}>
        {this.renderHeader()}
        <CommonTable
          loading={loadingfetchGradeList}
          columns={this.generateColumns()}
          list={listGrades}
        />
        <EditModal
          visible={modalVisible}
          onClose={() => {
            this.handleModalVisible(false);
            this.setState({
              selectedGradeID: '',
            });
          }}
          onRefresh={this.fetchGradeList}
          action={selectedGradeID ? 'edit' : 'add'}
          selectedGradeID={selectedGradeID}
        />
      </div>
    );
  }
}
export default Grade;
