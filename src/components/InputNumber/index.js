/* eslint-disable react/destructuring-assignment */
/* eslint-disable no-restricted-globals */
import React, { Component } from 'react';
import { Input } from 'antd';

class NumbericInput extends Component {
  onChange = e => {
    const { value } = e.target;
    const reg = /^-?[0-9]*(\.[0-9]*)?$/;
    if ((!isNaN(value) && reg.test(value)) || value === '' || value === '-') {
      this.props.onChange(value);
    }
  };

  // onBlur = () => {
  //   const { value, onBlur, onChange } = this.props;
  //   let valueTemp = value;
  //   if ((value && value.charAt(value.length - 1) === '.') || value === '-') {
  //     valueTemp = value.slice(0, -1);
  //   }
  //   onChange(valueTemp && valueTemp.replace(/0*(\d+)/, '$1'));
  //   if (onBlur) {
  //     onBlur();
  //   }
  // };

  render() {
    return (
      <Input
        {...this.props}
        onChange={this.onChange}
        // onBlur={this.onBlur}
        // placeholder="Input a number"
        maxLength={25}
      />
    );
  }
}

export default NumbericInput;
