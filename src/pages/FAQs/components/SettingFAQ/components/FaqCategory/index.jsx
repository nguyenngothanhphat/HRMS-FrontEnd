import { Button } from 'antd';
import React, { PureComponent } from 'react';
import { connect } from 'umi';
import AddIcon from '@/assets/policiesRegulations/add.svg';
import AddNewCategory from './components/AddNewCategory';
import TableCategory from './components/TableCategory';
import styles from './index.less';

@connect(({ faqs: { selectedCountry } = {} }) => ({
  selectedCountry,
}))
class FaqCategory extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      visibleModal: false,
    };
  }

  componentDidMount() {
    this.fetchData();
  }

  componentDidUpdate = (prevProps) => {
    const { selectedCountry = '' } = this.props;
    if (prevProps.selectedCountry !== selectedCountry) {
      this.fetchData();
    }
  };

  fetchData = () => {
    const { dispatch, selectedCountry = '' } = this.props;
    dispatch({
      type: 'faqs/fetchListFAQCategory',
      payload: {
        country: [selectedCountry],
      },
    });
  };

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
        <div className={styles.container}>
          <TableCategory />
        </div>
      </div>
    );
  }
}

export default FaqCategory;
