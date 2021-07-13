import React, { Component } from 'react';
import { Avatar, Spin, Row, Col } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { getCurrentCompany, getCurrentTenant } from '@/utils/authority';
import { connect } from 'umi';
import OrganizationChart from '@dabeng/react-orgchart';
import DetailEmployeeChart from './components/detailEmployee';
import styles from './index.less';

@connect(
  ({
    employee: { dataOrgChart = {}, listEmployeeAll = [] } = {},
    loading,
    locationSelection: { listLocationsByCompany = [] } = {},
    user: {
      currentUser: { employee: { _id: myEmployeeId = '' } = {} } = {},
      companiesOfUser = [],
    } = {},
  }) => ({
    dataOrgChart,
    loading: loading.effects['employee/fetchDataOrgChart'],
    myEmployeeId,
    companiesOfUser,
    listLocationsByCompany,
    listEmployeeAll,
  }),
)
class OrganisationChart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      idChart: '',
      chartDetails: {},
    };
  }

  componentDidMount() {
    const { dispatch, companiesOfUser = [], listLocationsByCompany = [] } = this.props;
    const convertLocation = listLocationsByCompany.map((item) => {
      const { headQuarterAddress: { country: { _id = '' } = {}, state = '' } = {} } = item;
      return {
        country: _id,
        state: [state],
      };
    });
    const tenantId = getCurrentTenant();
    const company = getCurrentCompany();
    dispatch({
      type: 'employee/fetchDataOrgChart',
      payload: { tenantId, company },
    });
    dispatch({
      type: 'employee/fetchAllListUser',
      payload: { company: companiesOfUser, location: convertLocation },
    });
  }

  handleOnClick = (e) => {
    const getId = e.target.id;
    this.setState({ idChart: getId });
    const arrowDown = e.target.parentElement.parentElement.parentElement.lastElementChild;
    arrowDown.click();
  };

  getDetailUser = async (nodeData) => {
    this.setState({ chartDetails: nodeData });
  };

  renderNode = ({ nodeData }) => {
    const { idChart } = this.state;
    const { myEmployeeId = '' } = this.props;
    const { user = {}, children = [] } = nodeData;
    const {
      _id = '',
      generalInfo: { avatar = '', firstName = '' } = {},
      department: { name = '' } = {},
      location: { name: nameLocation = '' } = {},
      // title: { name: title = '' } = {},
    } = user;
    const check = _id === myEmployeeId;
    return (
      <div
        className={styles.chartNode}
        style={check ? { border: '1px solid #00C598' } : {}}
        onClick={() => this.getDetailUser(nodeData)}
      >
        <div className={styles.chartAvt}>
          <Avatar src={avatar} size={64} icon={<UserOutlined />} />
        </div>
        <div className={styles.chartDetails}>
          <p className={styles.chartNode__textName}>{firstName}</p>
          {/* <div className={styles.chartNode__textInfo}>{title}</div> */}
          <div className={styles.chartNode__textInfo}>{name}</div>
          <div className={styles.chartNode__textInfo}>{nameLocation}</div>
        </div>
        <div className={styles.chartNode__subInfo} onClick={this.handleOnClick}>
          {children.length > 0 ? (
            <div
              id={_id}
              className={
                idChart === _id
                  ? styles.chartNode__subInfo__amountCollap
                  : styles.chartNode__subInfo__amount
              }
            >
              {`+${children.length} reportees`}
            </div>
          ) : (
            ''
          )}

          {check && <div className={styles.chartNode__subInfo__you}>You</div>}
        </div>
      </div>
    );
  };

  handleSearch = (value) => {
    console.log(value);
  };

  render() {
    const { loading, dataOrgChart, listEmployeeAll } = this.props;
    const { chartDetails } = this.state;
    return (
      <div className={styles.container}>
        {loading ? (
          <div className={styles.viewLoading}>
            <Spin size="large" />
          </div>
        ) : (
          <Row gutter={[24, 24]} style={{ padding: '24px 20px 0 0' }}>
            <Col span={7}>
              <DetailEmployeeChart
                chartDetails={chartDetails}
                handleSearch={this.handleSearch}
                listEmployeeAll={listEmployeeAll}
              />
            </Col>
            <Col span={17}>
              <OrganizationChart
                datasource={dataOrgChart}
                NodeTemplate={this.renderNode}
                chartClass={styles.myChart}
                containerClass={styles.chartContainer}
                collapsible
                // pan
                // zoom
                // zoominLimit={1}
                // zoomoutLimit={0.2}
              />
            </Col>
          </Row>
        )}
      </div>
    );
  }
}

export default OrganisationChart;
