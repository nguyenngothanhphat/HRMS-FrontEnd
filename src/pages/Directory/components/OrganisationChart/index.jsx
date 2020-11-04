import React, { Component } from 'react';
import { Avatar, Spin } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { connect } from 'umi';
import OrganizationChart from '@dabeng/react-orgchart';
import s from './index.less';

@connect(
  ({
    employee: { dataOrgChart = {} } = {},
    loading,
    user: { currentUser: { employee: { _id: myEmployeeId = '' } = {} } = {} } = {},
  }) => ({
    dataOrgChart,
    loading: loading.effects['employee/fetchDataOrgChart'],
    myEmployeeId,
  }),
)
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
    const { myEmployeeId = '' } = this.props;
    const {
      _id = '',
      generalInfo: { avatar = '', firstName = '' } = {},
      department: { name = '' } = {},
      location: { name: nameLocation = '' } = {},
      title: { name: title = '' } = {},
    } = nodeData;
    const check = _id === myEmployeeId;
    return (
      <div
        className={s.chartNode}
        style={check ? { border: '1px solid rgba(217, 83, 79, 0.8)' } : {}}
      >
        <Avatar src={avatar} size={64} icon={<UserOutlined />} />
        <p className={s.chartNode__textName}>{firstName}</p>
        <div className={s.chartNode__textInfo}>{title}</div>
        <div className={s.chartNode__textInfo}>{name}</div>
        <div className={s.chartNode__textInfo}>{nameLocation}</div>
      </div>
    );
  };

  render() {
    const { dataOrgChart = {}, loading, myEmployeeId } = this.props;

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
            pan
            zoom
            zoominLimit={1}
            zoomoutLimit={0.5}
          />
        )}
      </div>
    );
  }
}

export default OrganisationChart;
