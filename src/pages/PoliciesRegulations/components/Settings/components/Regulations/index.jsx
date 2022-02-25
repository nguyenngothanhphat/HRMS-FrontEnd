import React, { Component } from 'react';
import { Button, Row, Col, Input, Select } from 'antd';
import { connect } from 'umi';
import { debounce } from 'lodash';
import { SearchOutlined } from '@ant-design/icons';
import AddIcon from '@/assets/policiesRegulations/add.svg';
import FilterIcon from '@/assets/policiesRegulations/filter.svg';
import { getCurrentCompany, getCurrentTenant } from '@/utils/authority';
import styles from './index.less';
import AddPolicyModal from './components/AddPolicyModal';
import TablePolicy from './components/TablePolicy';

const { Option } = Select;
@connect(
  ({ policiesRegulations: { countryList = [], tempData: { selectedCountry = '' } } = {} }) => ({
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
    const { dispatch, selectedCountry = '' } = this.props;
    dispatch({
      type: 'policiesRegulations/fetchListPolicy',
      payload: {
        country: [selectedCountry],
      },
    });

    dispatch({
      type: 'policiesRegulations/getCountryListByCompany',
      payload: {
        tenantIds: [getCurrentTenant()],
        company: getCurrentCompany(),
      },
    });
  }

  componentWillUnmount = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'policiesRegulations/saveTemp',
      payload: {
        selectedCountry: '',
      },
    });
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
    const { dispatch } = this.props;
    dispatch({
      type: 'policiesRegulations/searchNamePolicy',
      payload: {
        namePolicy: value,
      },
    });
  };

  renderCountry = () => {
    const { countryList = [] } = this.props;
    let countryArr = [];
    countryArr = countryList.map((item) => {
      return item.headQuarterAddress.country;
    });
    const newArr = this.removeDuplicate(countryArr, (item) => item._id);

    let flagUrl = '';

    const flagItem = (id) => {
      newArr.forEach((item) => {
        if (item._id === id) {
          flagUrl = item.flag;
        }
        return flagUrl;
      });

      return (
        <div
          style={{
            maxWidth: '16px',
            height: '16px',
            display: 'inline-flex',
            alignItems: 'center',
            marginRight: '12px',
          }}
        >
          <img
            src={flagUrl}
            alt="flag"
            style={{
              width: '100%',
              borderRadius: '50%',
              height: '100%',
            }}
          />
        </div>
      );
    };
    return (
      <>
        {newArr.map((item) => (
          <Option
            key={item._id}
            value={item._id}
            className={styles.optionCountry}
            // style={{ height: '20px', display: 'flex', fontSize: '12px' }}
          >
            <div className={styles.labelText}>
              {flagItem(item._id)}
              <span style={{ fontSize: '12px', fontWeight: '500' }}>{item.name}</span>
            </div>
          </Option>
        ))}
      </>
    );
  };

  removeDuplicate = (array, key) => {
    return [...new Map(array.map((x) => [key(x), x])).values()];
  };

  changeCountry = async (value) => {
    const { dispatch } = this.props;

    dispatch({
      type: 'policiesRegulations/saveTemp',
      payload: {
        selectedCountry: value,
      },
    });
    await dispatch({
      type: 'policiesRegulations/fetchListPolicy',
      payload: { country: value, tenantId: getCurrentTenant() },
    });
  };

  render() {
    const { addPolicy, pageSelected, size } = this.state;
    return (
      <div className={styles.containerPolicy}>
        <div className={styles.headerPolicy}>
          <div className={styles.headerPolicy__left}>
            <div className={styles.headerPolicy__text}>Policies & Regulations</div>
            <div className={styles.headerPolicy__location}>
              <Select
                size="large"
                placeholder="Please select country"
                showArrow
                filterOption={(input, option) => {
                  return option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
                }}
                className={styles.selectCountry}
                onChange={(value) => this.changeCountry(value)}
              >
                {this.renderCountry()}
              </Select>
            </div>
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
