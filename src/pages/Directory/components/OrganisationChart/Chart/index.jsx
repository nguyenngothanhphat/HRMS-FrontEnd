import React, { Component } from 'react';
import { Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import OrgChart from 'react-orgchart';
import 'react-orgchart/index.css';
import './index.less';

class Chart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataDisplay: {},
    };
  }

  componentDidMount() {
    const { data: dataDisplay = {} } = this.props;
    this.setState({
      dataDisplay,
    });
  }

  _renderNode = ({
    node: { name = '', position = '', src = '', children = [] } = {},
    node = {},
  }) => {
    return (
      <div
        className="initechNode"
        onClick={() =>
          this.setState({
            dataDisplay: node,
          })
        }
      >
        <Avatar src={src} size={64} icon={<UserOutlined />} />
        <p style={{ fontSize: '14px', fontWeight: '600', margin: '12px 0', lineHeight: '1.36' }}>
          {name}
        </p>
        <p style={{ opacity: '0.5', margin: '0' }}>{position}</p>
        {children.length > 0 && <div className="iconA">Total: {children.length}</div>}
      </div>
    );
  };

  render() {
    const { dataDisplay = {} } = this.state;

    return (
      <div
        id="initechOrgChart"
        style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}
      >
        <OrgChart tree={dataDisplay} NodeComponent={this._renderNode} />
      </div>
    );
  }
}

export default Chart;
