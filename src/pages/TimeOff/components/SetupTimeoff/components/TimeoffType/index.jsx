import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import { getCurrentCompany, getCurrentLocation, getCurrentTenant } from '@/utils/authority';
import Configure from './Configure';
import styles from './index.less';
import RuleFrom from './RuleFrom';

const TimeoffType = (props) => {
  const {
    dispatch,
    timeOffTypesByCountry,
    // timeOffTypes,
    itemTimeOffType = {},
    countryList = [],
    loadingAddType,
    loadingFetchList,
    countrySelected,
    type = '',
    loadingFetchCountryList = false,
  } = props;

  const [isEdit, setIsEdit] = useState(false);
  const [countryListState, setCountryListState] = useState([]);

  const onChangeCountry = (country) => {
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

  useEffect(() => {
    return () => {
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
  }, []);

  const removeDuplicate = (array, key) => {
    return [...new Map(array.map((x) => [key(x), x])).values()];
  };

  useEffect(() => {
    let countryArr = [];
    countryArr = countryList.map((item) => {
      return item.headQuarterAddress.country;
    });
    const newArr = removeDuplicate(countryArr, (item) => item._id);
    setCountryListState(newArr);

    const find = countryList.find((x) => x._id === getCurrentLocation());
    if (find) {
      dispatch({
        type: 'timeOff/saveTemp',
        payload: {
          countrySelected: find?.headQuarterAddress?.country?._id,
        },
      });
    }
  }, [JSON.stringify(countryList)]);

  const onChangeType = async (id, value) => {
    console.log(id, value);
  };

  const onExitEditing = (value) => {
    dispatch({
      type: 'timeoff/save',
      payload: {
        itemTimeOffType: {},
      },
    });
    setIsEdit(value);
  };

  const onSaveChange = (value) => {
    dispatch({
      type: 'timeOff/updateTimeOffType',
      payload: value,
    });
  };

  const onRemoveItem = (id) => {
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

  const onTypeSelected = (typeTemp) => {
    dispatch({
      type: 'timeOff/saveTemp',
      payload: {
        type: typeTemp,
      },
    });
  };

  const onAddNewType = async (newType) => {
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
              You will find below a list of generic timeoffs which every company provides. Configue
              the rules for each timeoff as per your company norms. Also you can add timeoffs under
              each category as per your company requirements. This step will take about 80 minutes
              to complete.
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
            onChangeType={onChangeType}
            timeOffTypes={timeOffTypesByCountry}
            countryList={countryListState}
            addNewType={onAddNewType}
            handleChangeCountry={onChangeCountry}
            onTypeSelected={onTypeSelected}
            loadingAddType={loadingAddType}
            removeItem={onRemoveItem}
            countrySelected={countrySelected}
            loadingFetchList={loadingFetchList}
            loadingFetchCountryList={loadingFetchCountryList}
          />
        ) : (
          <Configure
            tabKey={isEdit}
            onExitEditing={onExitEditing}
            itemTimeOffType={itemTimeOffType}
            onSaveChange={onSaveChange}
          />
        )}
      </div>
    </div>
  );
};

export default connect(
  ({
    loading,
    timeOff: {
      timeOffTypesByCountry = [],
      itemTimeOffType = {},
      timeOffTypes,
      tempData: { type = {}, countrySelected = '' },
    } = {},
    location: { companyLocationList: countryList = [] } = {},
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
    loadingFetchCountryList: loading.effects['timeOff/getCountryListByCompany'],
  }),
)(TimeoffType);
