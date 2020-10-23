/* eslint-disable react/no-unused-state */
/* eslint-disable import/no-extraneous-dependencies */
import React, { PureComponent } from 'react';
import { Checkbox } from 'antd';
import { connect } from 'umi';
import styles from './index.less';

@connect(({ loading, employeesManagement }) => ({
  loading: loading.effects['login/login'],
  employeesManagement,
}))
class CheckList extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      filter: [],
      clearList: [],
      list: [],
      indeterminate: true,
      checkAll: false,
    };
  }

  onChange = (checkedList) => {
    const { data, name, dispatch } = this.props;
    dispatch({
      type: 'employeesManagement/saveFilter',
      payload: { name, checkedList },
    });
    this.setState({
      checkedList,
      list: checkedList,
      indeterminate: !!checkedList.length && checkedList.length < data.length,
      checkAll: checkedList.length === data.length,
    });
  };

  onCheckAllChange = (e) => {
    const { data, dispatch, name } = this.props;
    const newdata = data.map((x) => x.value);
    dispatch({
      type: 'employeesManagement/saveFilter',
      payload: { name, checkedList: newdata },
    });
    this.setState({
      list: e.target ? newdata : [],
      checkAll: e.target,
    });
  };

  render() {
    const { name = '', all = '', data = [], employee = {} } = this.props;
    const { list } = this.state;
    const check = employee.clearFilter;
    return (
      <div className={styles.CheckList}>
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
          value={check ? [] : list}
          onChange={this.onChange}
        />
      </div>
    );
  }
}

export default CheckList;
