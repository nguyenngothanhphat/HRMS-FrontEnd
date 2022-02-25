import React, { PureComponent } from 'react';
import { Col, Row, Button } from 'antd';
import AddIcon from '@/assets/policiesRegulations/add.svg';
import TableCatergory from './components/TableCategory';
import AddNewCategory from './components/AddNewCategory';
import styles from './index.less';

class FaqCategory extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      visibleModal: false,
    };
  }

//   componentDidMount() {
//     const { dispatch } = this.props;
//     dispatch({
//       type: 'policiesRegulations/fetchListCategory',
//     });
//   }

  render() {
    const { visibleModal } = this.state;
    return (
      <div className={styles.FAQCategory}>
        <div className={styles.headerCatergories}>
          <div className={styles.headerCatergories__text}>Categories</div>
          <div className={styles.headerCatergories__btnAdd}>
            <Button
              icon={<img src={AddIcon} alt="AddIcon" />}
              onClick={() => this.setState({ visibleModal: true })}
            >
              Add Categories
            </Button>
          </div>
          <AddNewCategory
            visible={visibleModal}
            onClose={() => this.setState({ visibleModal: false })}
            mode="multiple"
          />
        </div>
        <Row>
          <Col span={24}>
            <TableCatergory />
          </Col>
        </Row>
      </div>
    );
  }
}

export default FaqCategory;
