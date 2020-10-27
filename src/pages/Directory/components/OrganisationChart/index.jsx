import React, { Component } from 'react';
import { Spin } from 'antd';
import { connect } from 'umi';
import Chart from './Chart';
import s from './index.less';

@connect(({ employee: { dataOrgChart = {} } = {}, loading }) => ({
  dataOrgChart,
  loading: loading.effects['employee/fetchDataOrgChart'],
}))
class OrganisationChart extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'employee/fetchDataOrgChart',
    });
  }

  render() {
    const { dataOrgChart = {}, loading } = this.props;

    return (
      <div className={s.container}>
        {loading ? (
          <div className={s.viewLoading}>
            <Spin size="large" />
          </div>
        ) : (
          <Chart data={dataOrgChart} />
        )}
      </div>
    );
  }
}

export default OrganisationChart;
