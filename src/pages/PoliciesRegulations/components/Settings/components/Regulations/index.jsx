import React, { Component } from 'react';
import { Button, Row, Col, Input } from 'antd';
import { debounce } from 'lodash';
import { SearchOutlined } from '@ant-design/icons';
import AddIcon from '@/assets/policiesRegulations/add.svg';
import FilterIcon from '@/assets/policiesRegulations/filter.svg';
import styles from './index.less';
import AddPolicyModal from './components/AddPolicyModal';
import TablePolicy from './components/TablePolicy';

class Regulations extends Component {
  constructor(props) {
    super(props);

    this.state = {
      // addPolicy: false,
      openModal: '',
    };
    this.refForm = React.createRef();
    this.onSearchDebounce = debounce(this.onSearchDebounce, 500);
  }

  onSearch = (e = {}) => {
    const { value = '' } = e.target;
    this.onSearchDebounce(value);
  };

  onSearchDebounce = (value) => {
    const { dispatch } = this.props;
    // dispatch({
    //   type: 'customerManagement/fetchCustomerList',
    //   payload: {
    //     searchKey: value,
    //   },
    // });
  };

  render() {
    const { openModal } = this.state;
    return (
      <div className={styles.containerPolicy}>
        <div className={styles.headerPolicy}>
          <div className={styles.headerPolicy__text}>Policies & Regulations</div>
          <div className={styles.headerPolicy__btnAdd}>
            <Button
              icon={<img src={AddIcon} alt="AddIcon" />}
              onClick={() => this.setState({ openModal: 'add' })}
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
            openModal={openModal === 'add'}
            onClose={() => this.setState({ openModal: '' })}
            mode={openModal}
          />
        </div>
        <Row>
          <Col span={24}>
            <TablePolicy />
          </Col>
        </Row>
      </div>
    );
  }
}
export default Regulations;
