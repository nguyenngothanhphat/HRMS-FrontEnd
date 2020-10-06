import React, { Component } from 'react';
import { Checkbox } from 'antd';

import styles from './index.less';

class Option extends Component {
  constructor(props) {
    super(props);

    this.state = {
      // checked: true,
    };
  }

  static getDerivedStateFromProps(props) {
    if ('option' in props) {
      return { option: props.option || {} };
    }
    return null;
  }

  handleChange = (e, name) => {
    const value = e.nativeEvent.target.checked;
    console.log(name, value);
  };

  render() {
    const { option = {} } = this.props;
    const { checked, name = '', title = '', description = '', link = '' } = option;
    console.log(checked);
    return (
      <div className={styles.Option}>
        <Checkbox
          onChange={(e) => this.handleChange(e, option.name)}
          defaultChecked={checked}
          value={name}
          style={{
            lineHeight: '32px',
          }}
        >
          {title}
        </Checkbox>
        <div className={styles.Option_description}>
          {link === '' ? description : <a href={link}>{description}</a>}
        </div>
      </div>
    );
  }
}

export default Option;
