/* eslint-disable react/no-unused-state */
/* eslint-disable import/no-extraneous-dependencies */
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Checkbox } from 'antd';
import { connect } from 'umi';
import styles from './index.less';

@connect(({ loading, employee }) => ({
  loading: loading.effects['login/login'],
  employee,
}))
class CheckBoxForms extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      filter: [],
      list: [],
      indeterminate: true,
      checkAll: false,
    };
  }

  onChange = (checkedList) => {
    const { data, onBox, name, dispatch } = this.props;
    dispatch({
      type: 'employee/saveFilter',
      payload: { name, checkedList },
    });
    this.setState(
      {
        checkedList,
        list: checkedList,
        indeterminate: !!checkedList.length && checkedList.length < data.length,
        checkAll: checkedList.length === data.length,
      },
      () => {
        onBox(this.state);
      },
    );
  };

  onCheckAllChange = (e) => {
    const { data } = this.props;
    const newdata = data.map((x) => x.value);
    this.setState({
      list: e.target ? newdata : [],
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
          name={name}
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
  data: PropTypes.arrayOf(PropTypes.string),
};
CheckBoxForms.defaultProps = {
  data: [],
};

export default CheckBoxForms;
