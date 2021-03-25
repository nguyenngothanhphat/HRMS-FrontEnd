import React, { Component } from 'react';
import ViewPrimary from './View';

class PrimaryAdminstrator extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isChange: false,
    };
  }

  handleChange = () => {
    this.setState({ isChange: true });
  };

  render() {
    const { isChange } = this.state;

    return (
      <div>
        <ViewPrimary isChange={isChange} handleChange={this.handleChange} />
      </div>
    );
  }
}

export default PrimaryAdminstrator;
