import { Table } from 'antd';
import React, { Component } from 'react';
import { connect } from 'umi';
import EditIcon from '@/assets/policiesRegulations/edit.svg';
import DeleteIcon from '@/assets/policiesRegulations/delete.svg';
import DeleteCategoriesModal from './components/DeleteCategoriesModal';
import EditCategoriesModal from './components/EditCategoriesModal';
import styles from './index.less';

@connect(({ loading, faqs: { listCategory = [] } = {} }) => ({
  loadingGetList: loading.effects['faqs/fetchListFAQCategory'],
  listCategory,
}))
class TableCategory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editCategoriesModal: false,
      deleteCategoriesModal: false,
      item: {},
    };
  }

  handleUpdateCategories = (value) => {
    this.setState({ editCategoriesModal: true });
    this.setState({ item: value });
  };

  handleDeleteCategories = (value) => {
    this.setState({ deleteCategoriesModal: true });
    this.setState({ item: value });
  };

  render() {
    const { listCategory = [], loadingGetList } = this.props;
    // const { listCategory = [] } = this.props;

    const listCategories = listCategory
      ? listCategory.map((obj) => {
          return {
            id: obj._id,
            name: obj.category || '-',
            numberQuestions: obj.listFAQs.length,
          };
        })
      : [];
    const { editCategoriesModal, deleteCategoriesModal, item } = this.state;
    const columns = [
      {
        title: 'Categories Name',
        dataIndex: 'name',
        key: 'categoriesName',
      },
      {
        title: 'No. of Questions',
        dataIndex: 'numberQuestions',
        key: 'numberQuestion',
        // render: (numberQuestion) => {
        //   return <span>{numberQuestion ? numberQuestion.length : 0}</span>;
        // },
      },
      {
        title: 'Action',
        key: 'action',
        render: (record) => {
          return (
            <div className={styles.btnAction}>
              <img src={EditIcon} alt="Edit" onClick={() => this.handleUpdateCategories(record)} />

              <img
                src={DeleteIcon}
                alt="delete"
                onClick={() => this.handleDeleteCategories(record)}
              />
            </div>
          );
        },
      },
    ];

    return (
      <div className={styles.TableCategory}>
        <Table
          columns={columns}
          dataSource={listCategories}
          loading={loadingGetList}
          size="small"
        />
        {/* <Table columns={columns} dataSource={dataMockup} /> */}
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

export default TableCategory;
