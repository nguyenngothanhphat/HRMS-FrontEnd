import React, { Component } from 'react';

class NumericInput extends Component {
  onChange = (e) => {
    const { onChange } = this.props;
    const { value } = e.target;
    const reg = /^-?[0-9]*(\.[0-9]*)?$/;
    if ((!Number.isNaN(value) && reg.test(value)) || value === '' || value === '-') {
      onChange(value);
    }
  };

  render() {
    return (
      <input
        {...this.props}
        type="number"
        onChange={this.onChange}
        onInput={(e) => {
          const maxLen = e.target.maxLength;
          const { value } = e.target;
          if (value.length > maxLen) {
            e.target.value = value.slice(0, maxLen);
          }
        }}
      />
    );
  }
}

export default NumericInput;
