import React, { Component } from 'react';

class PopoverInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { data } = this.props;
    console.log(data);
    return <div>a</div>;
  }
}

export default PopoverInfo;
