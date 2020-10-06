import React, { Component } from 'react';
import { Button } from 'antd';
import styles from './index.less';

class CustomFieldsContent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      // checked: true,
    };
  }

  render() {
    return (
      <div className={styles.CustomFieldsContent}>
        <div className={styles.CustomFieldsContent_header}>
          <div className={styles.CustomFieldsContent_header_title}>Custom fields</div>
          <div className={styles.CustomFieldsContent_header_buttons}>
            <Button>+ New Section</Button>
            <Button>+ New Field</Button>
          </div>
        </div>
        <hr />
        <div className={styles.CustomFieldsContent_form}>
          <div className={styles.CustomFieldsContent_form_section}>
            <div className={styles.subTitle}>Section name</div>
          </div>

          <div className={styles.CustomFieldsContent_form_name}>
            <div className={styles.subTitle}>Field name</div>
            <div className={styles.list}>yay</div>
          </div>
        </div>
      </div>
    );
  }
}

export default CustomFieldsContent;
