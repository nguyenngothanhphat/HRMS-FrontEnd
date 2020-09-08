import React, { Component } from 'react';
import { Radio } from 'antd';
import CandidateFieldsComponent from './CandidateFieldsComponent';
import FirstFieldsComponent from './FirstFieldsComponent';
import styles from './index.less';
class FieldsComponent extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const { dropdownField } = this.props;
    return (
      <div>
        <FirstFieldsComponent styles={styles.Input} dropdownField={dropdownField} />
        <CandidateFieldsComponent styles={styles.Input} dropdownField={dropdownField} />
      </div>
    );
  }
}

export default FieldsComponent;
