import React, { Component } from 'react';
import { Button, Row, Col, Input } from 'antd';
import { connect } from 'umi';

import { debounce } from 'lodash';
import { SearchOutlined } from '@ant-design/icons';
import AddIcon from '@/assets/policiesRegulations/add.svg';
import FilterIcon from '@/assets/policiesRegulations/filter.svg';
import styles from './index.less';
import AddPolicyModal from './components/AddPolicyModal';
import TablePolicy from './components/TablePolicy';

@connect()
class Regulations extends Component {
  constructor(props) {
    super(props);

    this.state = {
      addPolicy: false,
      pageSelected: 1,
      size: 10,
    };
    this.refForm = React.createRef();
    this.onSearchDebounce = debounce(this.onSearchDebounce, 500);
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'policiesRegulations/fetchListPolicy',
    });
  }

  onSearch = (e = {}) => {
    const { value = '' } = e.target;
    this.onSearchDebounce(value);
  };

  getPageAndSize = (page, pageSize) => {
    this.setState({
      pageSelected: page,
      size: pageSize,
    });
  };

  onSearchDebounce = (value) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'policiesRegulations/searchNamePolicy',
      payload: {
        namePolicy: value,
      },
    });
  };

  render() {
    const { addPolicy, pageSelected, size } = this.state;
    return (
      <div className={styles.containerPolicy}>
        <div className={styles.headerPolicy}>
          <div className={styles.headerPolicy__text}>Policies & Regulations</div>
          <div className={styles.headerPolicy__btnAdd}>
            <Button
              icon={<img src={AddIcon} alt="AddIcon" />}
              onClick={() => this.setState({ addPolicy: true })}
            >
              Add Policy
            </Button>
            <div className={styles.filterButton}>
              <img src={FilterIcon} alt="FilterIcon" />
            </div>
            <div className={styles.searchInp}>
              <Input
                placeholder="Search by Policy name"
                prefix={<SearchOutlined />}
                onChange={(e) => this.onSearch(e)}
              />
            </div>
          </div>
          <AddPolicyModal
            visible={addPolicy}
            onClose={() => this.setState({ addPolicy: false })}
            mode="multiple"
          />
        </div>
        <Row>
          <Col span={24}>
            <TablePolicy
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
export default Regulations;
