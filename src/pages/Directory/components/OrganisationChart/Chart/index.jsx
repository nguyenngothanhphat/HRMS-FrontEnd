import React, { Component, Fragment } from 'react';
import { Avatar, Row, Col } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import OrgChart from 'react-orgchart';
import 'react-orgchart/index.css';
import './index.less';

class Chart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataDisplay: {},
      itemSelected: {},
      itemCLA: {},
    };
  }

  componentDidMount() {
    const { data: dataDisplay = {} } = this.props;
    this.setState({
      dataDisplay,
    });
  }

  _renderNode = ({ node = {} }) => {
    const {
      generalInfo: { avatar = '', firstName = '' } = {},
      department: { name = '' } = {},
      location: { name: nameLocation = '' } = {},
      user: { roles = [] } = {},
    } = node;
    const [role] = roles;
    return (
      <div className="initechNode" onClick={() => this.handleSelectNode(node)}>
        <Avatar src={avatar} size={64} icon={<UserOutlined />} />
        <p className="initechNode__textName">{firstName}</p>
        <div className="initechNode__textInfo">Department: {name}</div>
        <div className="initechNode__textInfo">Location: {nameLocation}</div>
        <div className="initechNode__textInfo">Role: {role}</div>
      </div>
    );
  };

  handleSelectNode = (node) => {
    this.setState({ itemSelected: node });
  };

  changeKeyObj = (obj = {}) => {
    const { children = [] } = obj;
    let newArr = [...children];
    newArr = newArr.map((item) => {
      const { _id = '', user = {}, location = {}, generalInfo = {}, department = {} } = item;
      return {
        _id,
        user,
        location,
        generalInfo,
        department,
      };
    });
    const newObj = {
      _id: obj._id,
      user: obj.user,
      location: obj.location,
      generalInfo: obj.generalInfo,
      department: obj.department,
      children: newArr,
    };
    return newObj;
  };

  findItemSelected = (item) => {
    const { dataDisplay = {} } = this.state;
    const { children = [] } = dataDisplay;
    const { user: { roles = [] } = {}, _id = '' } = item;
    const [role] = roles;
    let user = {};
    if (role === 'ADMIN-CLA') {
      user = children.find((e) => {
        const { _id: itemId = '' } = e;
        return itemId === _id;
      });
      this.setState({
        dataDisplay: user || dataDisplay,
        itemSelected: {},
        itemCLA: user || dataDisplay,
      });
    }
    if (role === 'ADMIN-CDA') {
      user = children.find((e) => {
        const { _id: itemId = '' } = e;
        return itemId === _id;
      });
      this.setState({ dataDisplay: user || dataDisplay, itemSelected: {} });
    }
  };

  hanldeBack = () => {
    const { data = {} } = this.props;
    const { dataDisplay = {}, itemCLA = {} } = this.state;
    const { user: { roles = [] } = {} } = dataDisplay;
    const [role] = roles;
    if (role === 'ADMIN-CLA') {
      this.setState({ dataDisplay: data });
    }
    if (role === 'ADMIN-CDA') {
      this.setState({ dataDisplay: itemCLA });
    }
  };

  render() {
    const { dataDisplay = {}, itemSelected } = this.state;
    const data = this.changeKeyObj(dataDisplay);
    if (itemSelected._id) {
      this.findItemSelected(itemSelected);
    }
    const { employeesOfDepartment = [], user: { roles = [] } = {} } = dataDisplay;
    const [role] = roles;

    return (
      <Fragment>
        {role !== 'ADMIN-CSA' && (
          <div className="buttonBack" onClick={this.hanldeBack}>
            BACK
          </div>
        )}
        <div
          id="initechOrgChart"
          style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}
        >
          <OrgChart tree={data} NodeComponent={this._renderNode} />
        </div>
        {role === 'ADMIN-CDA' && (
          <div className="listEmployee">
            <p className="listEmployee__title">List Employees Of Department:</p>
            <Row type="flex" justify="space-between" gutter={[32, 15]} style={{ padding: '2rem' }}>
              {employeesOfDepartment.map((item) => {
                const {
                  generalInfo: { avatar = '', firstName = '' } = {},
                  department: { name = '' } = {},
                  location: { name: nameLocation = '' } = {},
                  user: { roles: rolesItem = [] } = {},
                  _id: _idItem,
                } = item;
                const [roleItem] = rolesItem;
                return (
                  <Col xl={3} sm={6} xs={12} key={_idItem}>
                    <div className="initechNode employeesOfDepartment">
                      <Avatar src={avatar} size={64} icon={<UserOutlined />} />
                      <p className="initechNode__textName">{firstName}</p>
                      <div className="initechNode__textInfo">Department: {name}</div>
                      <div className="initechNode__textInfo">Location: {nameLocation}</div>
                      <div className="initechNode__textInfo">Role: {roleItem}</div>
                    </div>
                  </Col>
                );
              })}
            </Row>
          </div>
        )}
      </Fragment>
    );
  }
}

export default Chart;
