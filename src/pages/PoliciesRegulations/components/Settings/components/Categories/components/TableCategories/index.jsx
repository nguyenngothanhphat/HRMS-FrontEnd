import React, { Component } from 'react';
import { Table, Button } from 'antd';
import { connect } from 'umi';

import EditIcon from '@/assets/policiesRegulations/edit.svg';
import DeleteIcon from '@/assets/policiesRegulations/delete.svg';

import EditCategoriesModal from './components/EditCategoriesModal';
import DeleteCategoriesModal from './components/DeleteCategoriesModal';

import styles from './index.less';

connect(({ policiesRegulation: { listCategory = [] } = {} }) => ({
  listCategory,
}));

class TableCatergory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editCategoriesModal: false,
      deleteCategoriesModal: false,
    };
  }

  handleUpdateCategories = () => {
    this.setState({ editCategoriesModal: true });
  };

  handleDeleteCategories = () => {
    this.setState({ deleteCategoriesModal: true });
  };

  render() {
    const { editCategoriesModal, deleteCategoriesModal } = this.state;
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
              <Button type="link" shape="circle" onClick={() => this.handleUpdateCategories()}>
                <img src={EditIcon} alt="Edit" />
              </Button>
              <Button type="link" shape="circle" onClick={() => this.handleDeleteCategories()}>
                <img src={DeleteIcon} alt="delete" />
              </Button>
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
        <EditCategoriesModal
          visible={editCategoriesModal}
          onClose={() => this.setState({ editCategoriesModal: false })}
          mode="multiple"
        />
        <DeleteCategoriesModal
          visible={deleteCategoriesModal}
          onClose={() => this.setState({ deleteCategoriesModal: false })}
          mode="multiple"
        />
      </div>
    );
  }
}

export default TableCatergory;
