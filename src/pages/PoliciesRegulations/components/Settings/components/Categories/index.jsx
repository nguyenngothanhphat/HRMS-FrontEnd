import React, { Component } from 'react';
import { Col, Row, Button } from 'antd';
import { connect } from 'umi';
import AddIcon from '@/assets/policiesRegulations/add.svg';
import TableCatergories from './components/TableCategories';
import AddCategoriesModal from './components/AddCategoriesModal';
import styles from './index.less';

@connect(
  ({
    loading,
    policiesRegulations: { listCategory = [], countryList = [] } = {},
    user: {
      permissions = {},
      currentUser: {
        location: { headQuarterAddress: { country: { _id: countryID = '' } = {} } = {} } = {},
      } = {},
    },
  }) => ({
    loadingGetList: loading.effects['policiesRegulations/fetchListCategory'],
    listCategory,
    countryList,
    countryID,
    permissions,
  }),
)
class Categories extends Component {
  constructor(props) {
    super(props);
    this.state = {
      addCategoriesModal: false,
    };
  }

  // componentDidMount() {
  //   const { dispatch, countryID = '', permissions = {}, countryList = [] } = this.props;
  //   const viewAllCountry = permissions.viewPolicyAllCountry !== -1;
  //   if (countryList.length > 0) {
  //     let countryArr = [];
  //     if (viewAllCountry) {
  //       countryArr = countryList.map((item) => {
  //         return item.headQuarterAddress.country;
  //       });
  //       const newArr = this.removeDuplicate(countryArr, (item) => item._id);
  //       countryArr = newArr.map((val) => val._id);
  //       dispatch({
  //         type: 'policiesRegulations/fetchListCategory',
  //         payload: {
  //           country: countryArr,
  //         },
  //       });
  //     } else {
  //       dispatch({
  //         type: 'policiesRegulations/fetchListCategory',
  //         payload: {
  //           country: [countryID],
  //         },
  //       });
  //     }
  //   }
  // }

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
            onRefresh={this.fetchPolicyRegulationList}
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
