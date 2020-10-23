import React, { Component } from 'react';
import { Row, Input } from 'antd';
import { formatMessage, connect } from 'umi';
import Chart from './Chart';
import s from './index.less';

@connect(({ employee: { dataOrgChart = {} } = {} }) => ({
  dataOrgChart,
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
    const { dataOrgChart = {} } = this.props;
    // const dummyData = {
    //   name: 'Bill Lumbergh',
    //   position: 'CEO',
    //   children: [
    //     {
    //       name: 'Peter Gibbons',
    //       position: 'Lead',
    //     },
    //     {
    //       name: 'Anil Reddy',
    //       position: 'Sales',
    //       children: [
    //         {
    //           name: 'Peter Gibbons',
    //           position: 'Sales 1',
    //         },
    //         {
    //           name: 'Peter Gibbons',
    //           position: 'Sales 2',
    //         },
    //       ],
    //     },
    //     {
    //       name: 'Peter Gibbons',
    //       position: 'Marketing',
    //     },
    //     {
    //       name: 'Milton Waddams',
    //       position: 'UI',
    //     },
    //     {
    //       name: 'Bob Slydell',
    //       position: 'UX',
    //     },
    //   ],
    // };

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
          <Chart data={dataOrgChart} />
        </Row>
      </div>
    );
  }
}

export default OrganisationChart;
