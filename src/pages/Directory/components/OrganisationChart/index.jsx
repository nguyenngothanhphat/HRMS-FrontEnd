import React, { Component } from 'react';
import { Row, Input } from 'antd';
import { formatMessage, connect } from 'umi';
import Chart from './Chart';
import s from './index.less';

@connect(({ employee: { dataOrgChart = {} } = {}, loading }) => ({
  dataOrgChart,
  loading: loading.effects['employee/fetchDataOrgChart'],
}))
class OrganisationChart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      q: '',
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'employee/fetchDataOrgChart',
    });
  }

  handleSearch = () => {
    const { q } = this.state;
    console.log(q);
  };

  render() {
    const { dataOrgChart = {}, loading } = this.props;

    return (
      <div className={s.container}>
        <Row type="flex" justify="space-between">
          <Input
            placeholder={formatMessage({ id: 'pages.directory.organisationChart.search' })}
            className={s.viewSearch}
            onChange={(e) => this.setState({ q: e.target.value })}
            onPressEnter={this.handleSearch}
          />
          <div className={s.viewAction}>
            <p className={s.viewAction__text}>
              {formatMessage({ id: 'pages.directory.organisationChart.expandAll' })}
            </p>
            <p className={s.viewAction__text}>
              {formatMessage({ id: 'pages.directory.organisationChart.collapseAll' })}
            </p>
            <a href="/images/myw3schoolsimage.jpg" download className={s.viewAction__textDownload}>
              {formatMessage({ id: 'pages.directory.organisationChart.download' })}
            </a>
          </div>
        </Row>
        <Row style={{ marginTop: '27px' }}>
          {loading ? <div>Loading...</div> : <Chart data={dataOrgChart} />}
        </Row>
      </div>
    );
  }
}

export default OrganisationChart;
