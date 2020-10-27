import React, { Component } from 'react';
import { Avatar, Spin } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { connect } from 'umi';
import OrganizationChart from '@dabeng/react-orgchart';
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

  renderNode = ({ nodeData }) => {
    // const { title = '', name = '' } = nodeData;
    const {
      generalInfo: { avatar = '', firstName = '' } = {},
      department: { name = '' } = {},
      location: { name: nameLocation = '' } = {},
      user: { roles = [] } = {},
    } = nodeData;
    const [role] = roles;
    return (
      <div className={s.chartNode}>
        <Avatar src={avatar} size={64} icon={<UserOutlined />} />
        <p className="chartNode__textName">{firstName}</p>
        <div className="chartNode__textInfo">Department: {name}</div>
        <div className="chartNode__textInfo">Location: {nameLocation}</div>
        <div className="chartNode__textInfo">Role: {role}</div>
      </div>
    );
  };

  render() {
    const { dataOrgChart = {}, loading } = this.props;

    return (
      <div className={s.container}>
        {loading ? (
          <div className={s.viewLoading}>
            <Spin size="large" />
          </div>
        ) : (
          <OrganizationChart
            datasource={dataOrgChart}
            NodeTemplate={this.renderNode}
            chartClass={s.myChart}
            containerClass={s.chartContainer}
          />
        )}
      </div>
    );
  }
}

export default OrganisationChart;
