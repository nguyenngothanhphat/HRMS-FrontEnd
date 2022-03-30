// import { debounce } from 'lodash';
import { SearchOutlined } from '@ant-design/icons';
import { Button, Input } from 'antd';
import React, { Component } from 'react';
import { connect } from 'umi';
import FilterIcon from '@/assets/policiesRegulations/filter.svg';
import AddIcon from '@/assets/policiesRegulations/add.svg';
import AddQuestionAnswer from './components/AddQuestionAnswer';
import TableFAQList from './components/TableFAQList';
import styles from './index.less';

@connect(({ faqs: { selectedCountry } = {} }) => ({
  selectedCountry,
}))
class ListQuestionAnswer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      visibleModal: false,
      pageSelected: 1,
      size: 10,
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
      type: 'faqs/fetchListFAQ',
      payload: {
        country: [selectedCountry],
      },
    });
  };

  render() {
    const { visibleModal, pageSelected, size } = this.state;
    return (
      <div className={styles.ListQuestionAnswer}>
        <div className={styles.headerPolicy}>
          <div className={styles.headerPolicy__text}>Frequently Asked Questions</div>
          <div className={styles.headerPolicy__btnAdd}>
            <Button
              icon={<img src={AddIcon} alt="AddIcon" />}
              onClick={() => this.setState({ visibleModal: true })}
            >
              Add Questions
            </Button>
            <div className={styles.filterButton}>
              <img src={FilterIcon} alt="FilterIcon" />
            </div>
            <div className={styles.searchInp}>
              <Input placeholder="Search by name" prefix={<SearchOutlined />} />
            </div>
          </div>
          <AddQuestionAnswer
            visible={visibleModal}
            onClose={() => this.setState({ visibleModal: false })}
            mode="multiple"
          />
        </div>
        <div className={styles.container}>
          <TableFAQList
            pageSelected={pageSelected}
            size={size}
            getPageAndSize={this.getPageAndSize}
          />
        </div>
      </div>
    );
  }
}
export default ListQuestionAnswer;
