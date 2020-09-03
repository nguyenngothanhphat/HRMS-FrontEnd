/* eslint-disable import/no-extraneous-dependencies */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Checkbox } from 'antd';
import styles from './index.less';

class CheckBoxForms extends PureComponent {
  render() {
    const { name, all, data } = this.props;
    return (
      <div className={styles.CheckBoxForm}>
        <div className={styles.title}>
          <p className={styles.nameCheckBox}>{name}</p>
          <span className={styles.allCheckBox}>{all}</span>
        </div>
        <Checkbox.Group
          className={styles.groupCheckBox}
          options={data}
          //   value={this.state.checkedList}
          //   onChange={this.onChange}
        />
      </div>
    );
  }
}

CheckBoxForms.propTypes = {
  name: PropTypes.string.isRequired,
  all: PropTypes.string.isRequired,
  //   data: PropTypes.array.isRequired,
  data: PropTypes.arrayOf(PropTypes.string),
};
CheckBoxForms.defaultProps = {
  data: [],
};

export default CheckBoxForms;
