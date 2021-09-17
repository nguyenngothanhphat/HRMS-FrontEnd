import { Button, Input, Skeleton } from 'antd';
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
    };
  }

  fetchGradeList = () => {
    // const { dispatch } = this.props;
    // dispatch({
    //   type: 'adminSetting/fetchGradeList',
    // });
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
        width: '90%',
        // render: (id) => {
        //   return <span className={styles.roleName}>{id}</span>;
        // },
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
    const { modalVisible } = this.state;
    const { listGrades = [], loadingfetchGradeList = false } = this.props;
    if (loadingfetchGradeList) {
      return (
        <div className={styles.Grade}>
          <Skeleton />
        </div>
      );
    }
    return (
      <div className={styles.Grade}>
        {this.renderHeader()}
        <CommonTable columns={this.generateColumns()} list={listGrades} />
        <EditModal visible={modalVisible} onClose={() => this.handleModalVisible(false)} />
      </div>
    );
  }
}
export default Grade;
