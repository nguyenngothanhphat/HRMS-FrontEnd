import React, { PureComponent } from 'react';
import { Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import OrgChart from 'react-orgchart';
import 'react-orgchart/index.css';
import './index.less';

class Chart extends PureComponent {
  _renderNode = ({ node: { name = '', position = '', src = '', children = [] } = {} }) => {
    return (
      <div className="initechNode">
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
    const { data = [] } = this.props;

    return (
      <div id="initechOrgChart">
        <OrgChart tree={data} NodeComponent={this._renderNode} />
      </div>
    );
  }
}

export default Chart;
