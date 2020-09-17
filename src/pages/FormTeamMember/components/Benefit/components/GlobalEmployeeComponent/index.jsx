import React, { PureComponent } from 'react';
import { Checkbox, Typography, Row, Col } from 'antd';
import { connect } from 'umi';
import styles from './index.less';

class GlobalEmpoyeeComponent extends PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    const { globalEmployeesCheckbox } = this.props;
    const { title, name, checkBox } = globalEmployeesCheckbox;
    const { subCheckBox } = checkBox;
    return (
      <div className={styles.GlobalEmpoyeeComponent}>
        <Typography level={5}>{name}</Typography>
        {checkBox.map((arr) => {
          arr.subCheckBox.map((data) => {
            data.length > 1 ? <Checkbox checked="false">{arr.value}</Checkbox> : <span>Test</span>;
          });
        })}
      </div>
    );
  }
}

export default GlobalEmpoyeeComponent;
