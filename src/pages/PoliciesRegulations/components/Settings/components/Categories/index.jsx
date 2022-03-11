import React, { PureComponent } from 'react';
import { Col, Row, Button } from 'antd';
import { connect } from 'umi';
import AddIcon from '@/assets/policiesRegulations/add.svg';
import TableCatergories from './components/TableCategories';
import AddCategoriesModal from './components/AddCategoriesModal';
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
class Categories extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      addCategoriesModal: false,
    };
  }

  componentDidUpdate(prevProps) {
    const { selectedCountry = '' } = this.props;
    if (prevProps.selectedCountry !== selectedCountry) {
      this.fetchCategoryList();
    }
  }

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
    const { addCategoriesModal } = this.state;

    return (
      <div className={styles.containerCategory}>
        <div className={styles.headerCatergories}>
          <div className={styles.headerCatergories__text}>Categories</div>
          <div className={styles.headerCatergories__btnAdd}>
            <Button
              icon={<img src={AddIcon} alt="AddIcon" />}
              onClick={() => this.setState({ addCategoriesModal: true })}
            >
              Add Categories
            </Button>
          </div>
          <AddCategoriesModal
            onRefresh={this.fetchCategoryList}
            visible={addCategoriesModal}
            onClose={() => this.setState({ addCategoriesModal: false })}
            mode="multiple"
          />
        </div>
        <Row>
          <Col span={24}>
            <TableCatergories />
          </Col>
        </Row>
      </div>
    );
  }
}

export default Categories;
