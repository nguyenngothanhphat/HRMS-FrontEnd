import React, { Component } from 'react';
import { Table, Button } from 'antd';
import { connect } from 'umi';
import EditIcon from '@/assets/policiesRegulations/edit.svg';
import DeleteIcon from '@/assets/policiesRegulations/delete.svg';
import EditCategoriesModal from './components/EditCategoriesModal';
import DeleteCategoriesModal from './components/DeleteCategoriesModal';
import styles from './index.less';

@connect(({ loading, faqs: { listCategory = [] } = {} }) => ({
  loadingGetList: loading.effects['faqs/fetchListCategory'],
  listCategory,
}))
class TableCatergory extends Component {
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

    const listCategories = listCategory ? listCategory.map((obj) => {
      return {
        id: obj._id,
        name: obj.category,
        numberQuestions: obj.listFAQs.length
      }
    }) : []
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
              <Button
                type="link"
                shape="circle"
                onClick={() => this.handleUpdateCategories(record)}
              >
                <img src={EditIcon} alt="Edit" />
              </Button>
              <Button
                type="link"
                shape="circle"
                onClick={() => this.handleDeleteCategories(record)}
              >
                <img src={DeleteIcon} alt="delete" />
              </Button>
            </div>
          );
        },
      },
    ];

    return (
      <div className={styles.TableCatergory}>
        <Table columns={columns} dataSource={listCategories} loading={loadingGetList} />
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

export default TableCatergory;
