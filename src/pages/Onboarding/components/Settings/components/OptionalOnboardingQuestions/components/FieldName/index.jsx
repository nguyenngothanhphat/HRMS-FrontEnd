import React, { Component } from 'react';
import { FormOutlined, DeleteOutlined } from '@ant-design/icons';
import styles from './index.less';

class FieldName extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    const { fieldName = {} } = this.props;
    return (
      <div className={styles.FieldName}>
        <p>{fieldName.name}</p>
        <div className={styles.buttons}>
          <FormOutlined />
          <DeleteOutlined />
        </div>
      </div>
    );
  }
}

export default FieldName;
