import React, { Component } from 'react';
import { connect } from 'umi';
import { getCurrentTenant } from '@/utils/authority';
import RuleFrom from './RuleFrom';
import Configure from './Configure';
import styles from './index.less';

@connect(({ loading, timeOff: { itemTimeOffType = {} } = {} }) => ({
  itemTimeOffType,
  loadingTimeOffType: loading.effects['timeOff/getDataTimeOffTypeById'],
}))
class TimeoffType extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isEdit: false,
    };
  }

  onChangeType = async (id, value) => {
    const { dispatch } = this.props;
    await dispatch({
      type: 'timeOff/getDataTimeOffTypeById',
      payload: {
        _id: id,
        tenantId: getCurrentTenant(),
      },
    });
    this.setState({
      isEdit: value,
    });
  };

  onExitEditing = (value) => {
    this.setState({
      isEdit: value,
    });
  };

  render() {
    const { isEdit } = this.state;
    const { timeOffTypes, itemTimeOffType = {} } = this.props;
    return (
      <div className={styles.TimeoffType}>
        <div className={styles.TimeoffContain}>
          <div className={styles.TimeoffFrom}>
            {!isEdit ? (
              <div className={styles.Content}>Select & Configure timeoff types</div>
            ) : (
              <div className={styles.Content}>Configure Casual leave policy </div>
            )}
            {!isEdit ? (
              <div className={styles.SubContent}>
                You will find below a list of generic timeoffs which every company provides.
                Configue the rules for each timeoff as per your company norms. Also you can add
                timeoffs under each category as per your company requirements. This step will take
                about 80 minutes to complete.
              </div>
            ) : (
              <div className={styles.SubContent}>
                Casual Leave or CL is granted to an eligible employee if they cannot report to work
                due to an unforeseen situation. Casual leave can also be utilised if an eligible
                employee wants to take leave for a couple of days for personal reasons.
              </div>
            )}
          </div>
          {!isEdit ? (
            <RuleFrom onChangeType={this.onChangeType} timeOffTypes={timeOffTypes} />
          ) : (
            <Configure
              tabKey={isEdit}
              onExitEditing={this.onExitEditing}
              itemTimeOffType={itemTimeOffType}
            />
          )}
        </div>
      </div>
    );
  }
}

export default TimeoffType;
