import React, { Component } from 'react';
import { Table, Button } from 'antd';
import { connect } from 'umi';
import EditIcon from '@/assets/policiesRegulations/edit.svg';
import DeleteIcon from '@/assets/policiesRegulations/delete.svg';
import EditCategoriesModal from './components/EditCategoriesModal';
import DeleteCategoriesModal from './components/DeleteCategoriesModal';
import styles from './index.less';

@connect(
  ({
    loading,
    policiesRegulations: {
      listCategory = [],
      countryList = [],
      originData: { selectedCountry = '' },
    } = {},
  }) => ({
    loadingGetList: loading.effects['policiesRegulations/fetchListCategory'],
    listCategory,
    countryList,
    selectedCountry,
  }),
)
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

  fetchCategoryList = () => {
    const { dispatch, selectedCountry = '' } = this.props;
    dispatch({
      type: 'policiesRegulations/fetchListCategory',
      payload: {
        country: [selectedCountry],
      },
    });
  };

  render() {
    const { listCategory = [], loadingGetList } = this.props;
    const { editCategoriesModal, deleteCategoriesModal, item } = this.state;
    const columns = [
      {
        title: 'Categories Name',
        dataIndex: 'name',
        key: 'categoriesName',
      },
      {
        title: 'Document Count',
        dataIndex: 'policyregulations',
        key: 'documentCount',
        render: (policyregulations) => {
          return <span>{policyregulations ? policyregulations.length : 0}</span>;
        },
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
        <Table columns={columns} dataSource={listCategory} loading={loadingGetList} />
        <EditCategoriesModal
          visible={editCategoriesModal}
          onRefresh={this.fetchCategoryList}
          onClose={() => this.setState({ editCategoriesModal: false })}
          mode="multiple"
          item={item}
        />
        <DeleteCategoriesModal
          visible={deleteCategoriesModal}
          onRefresh={this.fetchCategoryList}
          onClose={() => this.setState({ deleteCategoriesModal: false })}
          mode="multiple"
          item={item}
        />
      </div>
    );
  }
}

export default TableCatergory;
