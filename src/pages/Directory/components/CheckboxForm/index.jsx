/* eslint-disable react/no-unused-state */
/* eslint-disable import/no-extraneous-dependencies */
import React, { PureComponent } from 'react';
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
      clearList: [],
      list: [],
      indeterminate: true,
      checkAll: false,
    };
  }

  componentDidUpdate = (prevProps) => {
    // these lines is used to sync checkboxes from redux to this component
    // because I change filter on redux in components/DirectoryTable -> onFilter() function
    // if not, remove this componentDidUpdate
    const { employee = {}, name } = this.props;
    const { filter = [] } = employee;
    const { list } = this.state;
    if (JSON.stringify(prevProps.employee.filter) !== JSON.stringify(filter)) {
      let checkedList = [...list];
      filter.forEach((f) => {
        if (f.actionFilter?.name === name) {
          checkedList = [...f.checkedList];
        }
      });

      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({
        checkedList,
        list: checkedList,
      });

      const { dispatch } = this.props;
      dispatch({
        type: 'employee/saveFilter',
        payload: { name, checkedList },
      });
    }
  };

  onChange = (checkedList) => {
    const { data, name, dispatch } = this.props;
    dispatch({
      type: 'employee/saveFilter',
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
      type: 'employee/saveFilter',
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
          value={check ? [] : list}
          onChange={this.onChange}
        />
      </div>
    );
  }
}

export default CheckBoxForms;
