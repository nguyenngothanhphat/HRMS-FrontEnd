import React, { Component } from 'react';
import { Button, Row, Col, Input } from 'antd';
// import { connect } from 'umi';
// import { debounce } from 'lodash';
import { SearchOutlined } from '@ant-design/icons';
import AddIcon from '@/assets/policiesRegulations/add.svg';
import FilterIcon from '@/assets/policiesRegulations/filter.svg';
import styles from './index.less';
import AddQuestionAnswer from './components/AddQuestionAnswer';
import TableFAQList from './components/TableFAQList';

// @connect()
class ListQuestionAnswer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      visibleModal: false,
      pageSelected: 1,
      size: 10,
    };
    // this.refForm = React.createRef();
    // this.onSearchDebounce = debounce(this.onSearchDebounce, 500);
  }

//   componentDidMount() {
//     const { dispatch } = this.props;
//     dispatch({
//       type: 'policiesRegulations/fetchListPolicy',
//     });
//   }

//   onSearch = (e = {}) => {
//     const { value = '' } = e.target;
//     this.onSearchDebounce(value);
//   };

//   getPageAndSize = (page, pageSize) => {
//     this.setState({
//       pageSelected: page,
//       size: pageSize,
//     });
//   };

//   onSearchDebounce = (value) => {
//     const { dispatch } = this.props;
//     dispatch({
//       type: 'policiesRegulations/searchNamePolicy',
//       payload: {
//         namePolicy: value,
//       },
//     });
//   };

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
              <Input
                placeholder="Search by name"
                prefix={<SearchOutlined />}
                // onChange={(e) => this.onSearch(e)}
              />
            </div>
          </div>
          <AddQuestionAnswer
            visible={visibleModal}
            onClose={() => this.setState({ visibleModal: false })}
            mode="multiple"
          />
        </div>
        <Row>
          <Col span={24}>
            <TableFAQList
              pageSelected={pageSelected}
              size={size}
              getPageAndSize={this.getPageAndSize}
            />
          </Col>
        </Row>
      </div>
    );
  }
}
export default ListQuestionAnswer;
