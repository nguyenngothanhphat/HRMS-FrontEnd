import { SearchOutlined } from '@ant-design/icons';
import { Button, Col, Input, Row } from 'antd';
import { debounce } from 'lodash';
import React, { Component } from 'react';
import { connect } from 'umi';
import FilterIcon from '@/assets/policiesRegulations/filter.svg';
import AddIcon from '@/assets/policiesRegulations/add.svg';
import AddPolicyModal from './components/AddPolicyModal';
import TablePolicy from './components/TablePolicy';
import styles from './index.less';

@connect(
  ({ policiesRegulations: { countryList = [], originData: { selectedCountry = '' } } = {} }) => ({
    countryList,
    selectedCountry,
  }),
)
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
    const { selectedCountry = '' } = this.props;
    this.fetchPolicyRegulationList(selectedCountry);
  }

  fetchPolicyRegulationList = (selectedCountry = '') => {
    const { dispatch } = this.props;
    dispatch({
      type: 'policiesRegulations/fetchListPolicy',
      payload: {
        country: [selectedCountry],
      },
    });
  };

  componentDidUpdate = (prevProps) => {
    const { selectedCountry = '' } = this.props;
    if (prevProps.selectedCountry !== selectedCountry) {
      this.refForm?.current?.resetFields();
      this.fetchPolicyRegulationList(selectedCountry);
    }
  };

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
    const { dispatch, selectedCountry = '' } = this.props;
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
          <div className={styles.headerPolicy__left}>
            <div className={styles.headerPolicy__text}>Policies & Regulations</div>
            <div />
          </div>

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
            <AddPolicyModal
              onRefresh={this.fetchPolicyRegulationList}
              visible={addPolicy}
              onClose={() => this.setState({ addPolicy: false })}
              mode="multiple"
            />
          </div>
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
