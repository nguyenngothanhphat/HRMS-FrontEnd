import React, { PureComponent } from 'react';
import { Col, Row, Button } from 'antd';
import { connect } from 'umi';
import AddIcon from '@/assets/policiesRegulations/add.svg';
import TableCatergories from './components/TableCategories';
import AddCategoriesModal from './components/AddCategoriesModal';
import styles from './index.less';

@connect(({ loading, policiesRegulations: { listCategory = [], countryList = [] } = {} }) => ({
  loadingGetList: loading.effects['policiesRegulations/fetchListCategory'],
  listCategory,
  countryList,
}))
class Categories extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      addCategoriesModal: false,
    };
  }

  componentDidUpdate(prevProps) {
    const { countryList = [] } = this.props;
    if (JSON.stringify(prevProps.countryList) !== JSON.stringify(countryList)) {
      this.fetchCategoryList();
    }
  }

  fetchCategoryList = () => {
    const { dispatch, countryList = [] } = this.props;
    if (countryList.length > 0) {
      let countryArr = [];
      countryArr = countryList.map((item) => {
        return item.headQuarterAddress.country;
      });
      const newArr = this.removeDuplicate(countryArr, (item) => item._id);
      countryArr = newArr.map((val) => val._id);
      dispatch({
        type: 'policiesRegulations/fetchListCategory',
        payload: {
          country: countryArr,
        },
      });
    }
  };

  removeDuplicate = (array, key) => {
    return [...new Map(array.map((x) => [key(x), x])).values()];
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
            onRefresh={this.fetchCateogryList}
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
