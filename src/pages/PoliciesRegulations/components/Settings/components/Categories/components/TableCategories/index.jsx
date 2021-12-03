import React, { Component } from 'react';
import { Table, Button } from 'antd';
import { connect } from 'umi';

import EditIcon from '@/assets/policiesRegulations/edit.svg';
import DeleteIcon from '@/assets/policiesRegulations/delete.svg';

import EditCategoriesModal from './components/EditCategoriesModal';
import DeleteCategoriesModal from './components/DeleteCategoriesModal';

import styles from './index.less';

@connect(({ policiesRegulations: { listCategory = [] } = {} }) => ({
  listCategory,
}))

class TableCatergory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editCategoriesModal: false,
      deleteCategoriesModal: false,
      item:{}
    };
  }

  handleUpdateCategories = (value) => {
    this.setState({ editCategoriesModal: true });
   this.setState({item:value})
  };

  handleDeleteCategories = (value) => {
    this.setState({ deleteCategoriesModal: true });
    this.setState({item:value})
  };

  render() {
    const{listCategory=[]}=this.props
    const { editCategoriesModal, deleteCategoriesModal,item } = this.state;
    const columns = [
      {
        title: 'Categories Name',
        dataIndex: 'name',
        key: 'categoriesName',
      },
      {
        title: 'Document Count',
        dataIndex: '0',
        key: 'documentCount',
      },
      {
        title: 'Action',
        key: 'action',
        render: (record) => {
          return (
            <div className={styles.btnAction}>
              <Button type="link" shape="circle" onClick={() => this.handleUpdateCategories(record)}>
                <img src={EditIcon} alt="Edit" />
              </Button>
              <Button type="link" shape="circle" onClick={() => this.handleDeleteCategories(record)}>
                <img src={DeleteIcon} alt="delete" />
              </Button>
            </div>
          );
        },
      },
    ];
 
    return (
      <div className={styles.TableCatergory}>
        <Table columns={columns} dataSource={listCategory} />
        <EditCategoriesModal
          visible={editCategoriesModal}
          onClose={() => this.setState({ editCategoriesModal: false })}
          mode="multiple"
          item={item}
        />
        <DeleteCategoriesModal
          visible={deleteCategoriesModal}
          onClose={() => this.setState({ deleteCategoriesModal: false })}
          mode="multiple"
          item={item}
        />
      </div>
    );
  }
}

export default TableCatergory;
