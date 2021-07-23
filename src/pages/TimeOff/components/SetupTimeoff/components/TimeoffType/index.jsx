import React, { Component } from 'react';
import { connect } from 'umi';
import { getCurrentCompany, getCurrentTenant } from '@/utils/authority';
import RuleFrom from './RuleFrom';
import Configure from './Configure';
import styles from './index.less';

@connect(
  ({
    loading,
    timeOff: {
      timeOffTypesByCountry = [],
      itemTimeOffType = {},
      timeOffTypes,
      countryList = [],
      tempData: { type = {}, countrySelected = '' },
    } = {},
  }) => ({
    itemTimeOffType,
    type,
    countrySelected,
    timeOffTypesByCountry,
    timeOffTypes,
    countryList,
    loadingTimeOffType: loading.effects['timeOff/getDataTimeOffTypeById'],
    loadingUpdateType: loading.effects['timeOff/updateTimeOffType'],
    loadingAddType: loading.effects['timeOff/addTimeOffType'],
    loadingFetchList: loading.effects['timeOff/fetchTimeOffTypesByCountry'],
  }),
)
class TimeoffType extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isEdit: false,
    };
  }

  componentDidMount = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'timeOff/getCountryListByCompany',
      payload: {
        tenantIds: [getCurrentTenant()],
        company: getCurrentCompany(),
      },
    });
  };

  componentWillUnmount = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'timeOff/saveTemp',
      payload: {
        countrySelected: '',
        type: {},
      },
    });
    dispatch({
      type: 'timeOff/save',
      payload: {
        timeOffTypesByCountry: [],
      },
    });
  };

  onChangeType = async (id, value) => {
    // const { dispatch } = this.props;
    // await dispatch({
    //   type: 'timeOff/getDataTimeOffTypeById',
    //   payload: {
    //     _id: id,
    //     tenantId: getCurrentTenant(),
    //   },
    // });
    // this.setState({
    //   isEdit: value,
    // });
    console.log(id, value);
  };

  onExitEditing = (value) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'timeoff/save',
      payload: {
        itemTimeOffType: {},
      },
    });
    this.setState({
      isEdit: value,
    });
  };

  onSaveChange = (value) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'timeOff/updateTimeOffType',
      payload: value,
    });
  };

  onChangeCountry = (country) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'timeOff/fetchTimeOffTypesByCountry',
      payload: {
        country,
        company: getCurrentCompany(),
        tenantId: getCurrentTenant(),
      },
    });
    dispatch({
      type: 'timeOff/saveTemp',
      payload: {
        countrySelected: country,
      },
    });
  };

  onRemoveItem = (id) => {
    const { countrySelected } = this.props;
    const { dispatch } = this.props;
    dispatch({
      type: 'timeOff/removeTimeOffType',
      payload: {
        _id: id,
        tenantId: getCurrentTenant(),
        country: countrySelected,
      },
    }).then(async () => {
      await dispatch({
        type: 'timeOff/fetchTimeOffTypesByCountry',
        payload: {
          country: countrySelected,
          company: getCurrentCompany(),
          tenantId: getCurrentTenant(),
        },
      });
    });
  };

  onTypeSelected = (type) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'timeOff/saveTemp',
      payload: {
        type,
      },
    });
  };

  onAddNewType = async (newType) => {
    const { countrySelected, type } = this.props;
    const payload = {
      tenantId: getCurrentTenant(),
      name: newType.name,
      type: type.typeName,
      typeName: type.type.substr(8),
      noOfDays: newType.noOfDay,
      accrualSetting: {
        accrualMethod: newType.accrualMethod,
        accuralRate: newType.accrualRate,
      },
      company: getCurrentCompany(),
      country: countrySelected,
    };
    const { dispatch } = this.props;

    await dispatch({
      type: 'timeOff/addTimeOffType',
      payload,
    }).then(() => {
      dispatch({
        type: 'timeOff/fetchTimeOffTypesByCountry',
        payload: {
          country: countrySelected,
          company: getCurrentCompany(),
          tenantId: getCurrentTenant(),
        },
      });
      dispatch({
        type: 'timeOff/saveTemp',
        payload: {
          type: {},
        },
      });
    });
  };

  render() {
    const { isEdit } = this.state;
    const {
      timeOffTypesByCountry,
      // timeOffTypes,
      itemTimeOffType = {},
      countryList = [],
      loadingAddType,
      loadingFetchList,
      countrySelected,
    } = this.props;
    // console.log(timeOffTypesByCountry);
    return (
      <div className={styles.TimeoffType}>
        <div className={styles.TimeoffContain}>
          <div className={styles.TimeoffFrom}>
            {!isEdit ? (
              <div className={styles.Content}>Select & Configure timeoff types</div>
            ) : (
              <div className={styles.Content}>Configure {itemTimeOffType.name} policy </div>
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
            <RuleFrom
              onChangeType={this.onChangeType}
              timeOffTypes={timeOffTypesByCountry}
              countryList={countryList}
              addNewType={this.onAddNewType}
              handleChangeCountry={this.onChangeCountry}
              onTypeSelected={this.onTypeSelected}
              loadingAddType={loadingAddType}
              removeItem={this.onRemoveItem}
              countrySelected={countrySelected}
              loadingFetchList={loadingFetchList}
            />
          ) : (
            <Configure
              tabKey={isEdit}
              onExitEditing={this.onExitEditing}
              itemTimeOffType={itemTimeOffType}
              onSaveChange={this.onSaveChange}
            />
          )}
        </div>
      </div>
    );
  }
}

export default TimeoffType;
