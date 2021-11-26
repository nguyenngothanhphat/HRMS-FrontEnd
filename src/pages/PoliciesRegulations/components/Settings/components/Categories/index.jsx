import React, { Component } from 'react';
import { Col, Row, Button } from 'antd';
import AddIcon from '@/assets/policiesRegulations/add.svg';
import TableCatergories from './components/TableCategories';
import AddCategoriesModal from './components/AddCategoriesModal';
import styles from './index.less';

class Categories extends Component {
  constructor(props) {
    super(props);
    this.state = {
      addCategoriesModal: false,
    };
  }

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
