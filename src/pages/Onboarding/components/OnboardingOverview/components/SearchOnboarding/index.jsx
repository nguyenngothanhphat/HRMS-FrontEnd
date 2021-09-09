import React, { Component } from 'react';
import { Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

class SearchOnboarding extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { onChangeSearch = () => {} } = this.props;
    return (
      <div>
        <Input
          onChange={(e) => onChangeSearch(e.target.value)}
          placeholder="Search"
          prefix={<SearchOutlined />}
        />
      </div>
    );
  }
}

export default SearchOnboarding;
