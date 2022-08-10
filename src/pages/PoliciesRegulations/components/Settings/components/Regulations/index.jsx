import { Button, Col, Row, Skeleton } from 'antd';
import { debounce } from 'lodash';
import React, { Component, Suspense } from 'react';
import { connect } from 'umi';
import AddIcon from '@/assets/policiesRegulations/add.svg';
import CustomOrangeButton from '@/components/CustomOrangeButton';
import CustomSearchBox from '@/components/CustomSearchBox';
import FilterCountTag from '@/components/FilterCountTag';
import FilterPopover from '@/components/FilterPopover';
import { getCurrentTenant } from '@/utils/authority';
import AddPolicyModal from './components/AddPolicyModal';
import FilterContent from './components/FilterContent';
import TablePolicy from './components/TablePolicy';
import styles from './index.less';
import CustomAddButton from '@/components/CustomAddButton';

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
      form: null,
      applied: 0,
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
        country: [selectedCountry],
        namePolicy: value,
      },
    });
  };

  handleClearFilter = () => {
    const { dispatch, selectedCountry = '' } = this.props;
    const { form } = this.state;
    dispatch({
      type: 'policiesRegulations/fetchListPolicy',
      payload: { country: [selectedCountry], tenantId: getCurrentTenant() },
    });

    this.setState({ applied: 0 });
    form?.resetFields();
  };

  render() {
    const { addPolicy, pageSelected, size, applied } = this.state;
    return (
      <div className={styles.containerPolicy}>
        <div className={styles.headerPolicy}>
          <div className={styles.headerPolicy__left}>
            <div className={styles.headerPolicy__text}>Policies & Regulations</div>
            <div />
          </div>

          <div className={styles.headerPolicy__btnAdd}>
            <FilterCountTag count={applied} onClearFilter={this.handleClearFilter} />
            <CustomAddButton onClick={() => this.setState({ addPolicy: true })} >
              Add Policy
            </CustomAddButton>
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
                <CustomOrangeButton showDot={applied > 0} />
              </FilterPopover>
            </div>
            <CustomSearchBox
              onSearch={(e) => this.onSearch(e)}
              placeholder="Search by Policy name"
            />
          </div>
          <AddPolicyModal
            onRefresh={this.fetchPolicyRegulationList}
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
