// import { debounce } from 'lodash';
import { CloseOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Form, Input, Skeleton, Tag } from 'antd';
import React, { Component, Suspense } from 'react';
import { connect } from 'umi';
import { debounce } from 'lodash';
import FilterIcon from '@/assets/policiesRegulations/filter.svg';
import AddIcon from '@/assets/policiesRegulations/add.svg';
import AddQuestionAnswer from './components/AddQuestionAnswer';
import TableFAQList from './components/TableFAQList';
import styles from './index.less';
import FilterPopover from '@/components/FilterPopover';
import FilterButton from '@/components/FilterButton';
import FilterContent from './components/FilterContent';

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
      form: null,
      applied: 0,
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
      this.refForm?.current?.resetFields();
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
    });
    this.fetchData(page, pageSize);
  };

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

  handleClearFilter = () => {
    const { dispatch, selectedCountry = '' } = this.props;
    const { form } = this.state;
    dispatch({
      type: 'faqs/fetchListFAQ',
      payload: {
        country: selectedCountry,
      },
    });
    this.setState({ applied: 0 });
    form?.resetFields();
  };

  render() {
    const { listFAQ = [], loadingGetList = false, totalListFAQ } = this.props;
    const { visibleModal, size, pageSelected, applied } = this.state;
    return (
      <div className={styles.ListQuestionAnswer}>
        <div className={styles.headerPolicy}>
          <div className={styles.headerPolicy__text}>Frequently Asked Questions</div>
          <div className={styles.headerPolicy__btnAdd}>
            {applied > 0 && (
              <Tag
                className={styles.headerPolicy__tagCountFilter}
                closable
                closeIcon={<CloseOutlined onClick={this.handleClearFilter} />}
              >
                {applied} filters applied
              </Tag>
            )}
            <Button
              icon={<img src={AddIcon} alt="AddIcon" />}
              onClick={() => this.setState({ visibleModal: true })}
            >
              Add Questions
            </Button>
            <div className={styles.filterButton}>
              <FilterPopover
                placement="bottomRight"
                content={
                  <Suspense fallback={<Skeleton active />}>
                    <FilterContent
                      setForm={(val) => this.setState({ form: val })}
                      setApplied={(val) => this.setState({ applied: val })}
                    />
                  </Suspense>
                }
                realTime
              >
                <FilterButton />
              </FilterPopover>
            </div>
            <Form ref={this.refForm}>
              <Form.Item name="searchQA" className={styles.searchInp}>
                <Input
                  placeholder="Search by question or answer"
                  prefix={<SearchOutlined />}
                  onChange={(e) => this.onSearch(e)}
                />
              </Form.Item>
            </Form>
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
