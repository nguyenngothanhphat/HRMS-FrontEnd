// import { debounce } from 'lodash';
import { SearchOutlined } from '@ant-design/icons';
import { Button, Input } from 'antd';
import React, { Component } from 'react';
import { connect } from 'umi';
import { debounce } from 'lodash';
import FilterIcon from '@/assets/policiesRegulations/filter.svg';
import AddIcon from '@/assets/policiesRegulations/add.svg';
import AddQuestionAnswer from './components/AddQuestionAnswer';
import TableFAQList from './components/TableFAQList';
import styles from './index.less';

@connect(({ loading, faqs: { selectedCountry, listFAQ = [], totalListFAQ = 0 } = {} }) => ({
  selectedCountry,
  loadingGetList: loading.effects['faqs/fetchListFAQ'],
  listFAQ,
  totalListFAQ,
}))
class ListQuestionAnswer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      visibleModal: false,
      pageSelected: 1,
      size: 10,
    };
    this.refForm = React.createRef();
    this.onSearchDebounce = debounce(this.onSearchDebounce, 500);
  }

  componentDidMount() {
    this.fetchData();
  }

  onSearch = (e = {}) => {
    const { value = '' } = e.target;
    this.onSearchDebounce(value);
  };

  componentDidUpdate = (prevProps) => {
    const { selectedCountry = '' } = this.props;
    if (prevProps.selectedCountry !== selectedCountry) {
      this.fetchData();
    }
  };

  fetchData = (page = 1, limit = 10) => {
    const { dispatch, selectedCountry = '' } = this.props;
    // const { pageSelected, size } = this.state
    dispatch({
      type: 'faqs/fetchListFAQ',
      payload: {
        country: [selectedCountry],
        page,
        limit,
      },
    });
  };

  getPageAndSize = (page, pageSize) => {
    this.setState({
      pageSelected: page,
      size: pageSize,
    })
    this.fetchData(page, pageSize)
  }

  onSearchDebounce = (value) => {
    const { dispatch, selectedCountry = '' } = this.props;
    dispatch({
      type: 'faqs/fetchListFAQ',
      payload: {
        nameSearch: value,
        country: [selectedCountry],
      },
    });
  };

  render() {
    const { listFAQ = [], loadingGetList = false, totalListFAQ } = this.props;
    const { visibleModal, size, pageSelected } = this.state;
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
              <Input
                placeholder="Search by question or answer"
                prefix={<SearchOutlined />}
                onChange={(e) => this.onSearch(e)}
              />
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
            totalListFAQ={totalListFAQ}
            getPageAndSize={this.getPageAndSize}
            listFAQ={listFAQ}
            loadingGetList={loadingGetList}
          />
        </div>
      </div>
    );
  }
}
export default ListQuestionAnswer;
