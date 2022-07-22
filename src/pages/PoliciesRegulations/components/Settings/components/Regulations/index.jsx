import React, { Component, Suspense } from 'react';
import { Button, Row, Col, Input, Form, Tag, Skeleton } from 'antd';
import { connect } from 'umi';
import { debounce } from 'lodash';
import { CloseOutlined, SearchOutlined } from '@ant-design/icons';
import AddIcon from '@/assets/policiesRegulations/add.svg';
import FilterIcon from '@/assets/policiesRegulations/filter.svg';
import styles from './index.less';
import AddPolicyModal from './components/AddPolicyModal';
import TablePolicy from './components/TablePolicy';
import FilterPopover from '@/components/FilterPopover';
import FilterContent from './components/FilterContent';
import FilterButton from '@/components/FilterButton';
import { getCurrentTenant } from '@/utils/authority';

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
              onClick={() => this.setState({ addPolicy: true })}
            >
              Add Policy
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
              <Form.Item name="searchPolicy" className={styles.searchInp}>
                <Input
                  placeholder="Search by Policy name"
                  prefix={<SearchOutlined />}
                  onChange={(e) => this.onSearch(e)}
                />
              </Form.Item>
            </Form>
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
