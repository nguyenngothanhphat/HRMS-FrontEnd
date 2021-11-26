import React, { Component } from 'react';
import { Table, Tag, Space } from 'antd';
import EditIcon from '@/assets/policiesRegulations/edit.svg';
import DeleteIcon from '@/assets/policiesRegulations/delete.svg';
import styles from './index.less';

class TableCatergory extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const columns = [
      {
        title: 'Categories Name',
        dataIndex: 'categoriesName',
        key: 'categoriesName',
      },
      {
        title: 'Document Count',
        dataIndex: 'documentCount',
        key: 'documentCount',
      },
      {
        title: 'Action',
        dataIndex: 'action',
        key: 'action',
        render: () => {
          return (
            <div className={styles.btnAction}>
              <img src={EditIcon} alt="EditIcon" />
              <img src={DeleteIcon} alt="" DeleteIcon />
            </div>
          );
        },
      },
    ];
    const data = [
      {
        key: 1,
        categoriesName: 'Employee Product',
        documentCount: 70,
      },
    ];
    return (
      <div className={styles.TableCatergory}>
        <Table columns={columns} dataSource={data} />
      </div>
    );
  }
}

export default TableCatergory;
