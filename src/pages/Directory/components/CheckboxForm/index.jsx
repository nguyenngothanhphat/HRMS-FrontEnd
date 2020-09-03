/* eslint-disable react/no-unused-state */
/* eslint-disable import/no-extraneous-dependencies */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Checkbox } from 'antd';
import styles from './index.less';

class CheckBoxForms extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      list: [],
      indeterminate: true,
      checkAll: false,
    };
  }

  onChange = (checkedList) => {
    const { data } = this.props;
    this.setState({
      checkedList,
      list: checkedList,
      indeterminate: !!checkedList.length && checkedList.length < data.length,
      checkAll: checkedList.length === data.length,
    });
  };

  onCheckAllChange = (e) => {
    const { data } = this.props;
    this.setState({
      list: e.target ? data : [],
      checkAll: e.target,
    });
  };

  render() {
    const { name, all, data } = this.props;
    const { list } = this.state;
    return (
      <div className={styles.CheckBoxForm}>
        <div className={styles.title}>
          <p className={styles.nameCheckBox}>{name}</p>
          <span className={styles.allCheckBox} onClick={this.onCheckAllChange}>
            {all}
          </span>
        </div>
        <Checkbox.Group
          className={styles.groupCheckBox}
          options={data}
          value={list}
          onChange={this.onChange}
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
