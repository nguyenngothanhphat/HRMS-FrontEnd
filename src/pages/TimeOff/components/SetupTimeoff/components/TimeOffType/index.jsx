import React, { useEffect, useState } from 'react';
import { connect, history } from 'umi';
import { getCurrentCompany, getCurrentLocation, getCurrentTenant } from '@/utils/authority';
import Types from './components/Types';
import styles from './index.less';

const TimeOffType = (props) => {
  const {
    dispatch,
    timeOffTypesByCountry,
    countryList = [],
    loadingAddType,
    loadingFetchList,
    selectedCountry,
    type = '',
    loadingFetchCountryList = false,
  } = props;

  const [countryListState, setCountryListState] = useState([]);

  const fetchTimeoffType = () => {
    dispatch({
      type: 'timeOff/fetchTimeOffTypesByCountry',
      payload: {
        country: selectedCountry,
        company: getCurrentCompany(),
        tenantId: getCurrentTenant(),
      },
    });
  };

  const onChangeCountry = (country) => {
    dispatch({
      type: 'timeOff/saveTemp',
      payload: {
        selectedCountry: country,
      },
    });
  };

  // useEffect(() => {
  //   return () => {
  //     dispatch({
  //       type: 'timeOff/saveTemp',
  //       payload: {
  //         selectedCountry: '',
  //         type: {},
  //       },
  //     });
  //   };
  // }, []);

  useEffect(() => {
    if (selectedCountry) {
      fetchTimeoffType();
    }
  }, [selectedCountry]);

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
          selectedCountry: find?.headQuarterAddress?.country?._id,
        },
      });
    }
  }, [JSON.stringify(countryList)]);

  const onChangeType = async (payload) => {
    history.push({
      pathname: `/time-off/setup/types-rules/configure/${payload._id}`,
      state: {
        isValid: true,
        type: payload.type,
        typeName: payload.typeName,
        country: payload.country,
      },
    });
  };

  const onRemoveItem = (id) => {
    dispatch({
      type: 'timeOff/removeTimeOffType',
      payload: {
        _id: id,
        tenantId: getCurrentTenant(),
        country: selectedCountry,
      },
    }).then(async () => {
      fetchTimeoffType();
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
      country: selectedCountry,
    };

    await dispatch({
      type: 'timeOff/addTimeOffType',
      payload,
    }).then(() => {
      fetchTimeoffType();
      dispatch({
        type: 'timeOff/saveTemp',
        payload: {
          type: {},
        },
      });
    });
  };

  return (
    <div className={styles.TimeOffType}>
      <div className={styles.TimeoffContain}>
        <div className={styles.TimeoffFrom}>
          <div className={styles.Content}>Select & Configure Timeoff Types</div>

          <div className={styles.SubContent}>
            You will find below a list of generic timeoffs which every company provides. Configure
            the rules for each timeoff as per your company norms. Also you can add timeoffs under
            each category as per your company requirements. This step will take about 80 minutes to
            complete.
          </div>
        </div>

        <Types
          onChangeType={onChangeType}
          timeOffTypes={timeOffTypesByCountry}
          countryList={countryListState}
          addNewType={onAddNewType}
          handleChangeCountry={onChangeCountry}
          onTypeSelected={onTypeSelected}
          loadingAddType={loadingAddType}
          removeItem={onRemoveItem}
          selectedCountry={selectedCountry}
          loadingFetchList={loadingFetchList}
          loadingFetchCountryList={loadingFetchCountryList}
        />
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
      tempData: { type = {}, selectedCountry = '' },
    } = {},
    location: { companyLocationList: countryList = [] } = {},
  }) => ({
    itemTimeOffType,
    type,
    selectedCountry,
    timeOffTypesByCountry,
    timeOffTypes,
    countryList,
    loadingTimeOffType: loading.effects['timeOff/getDataTimeOffTypeById'],
    loadingUpdateType: loading.effects['timeOff/updateTimeOffType'],
    loadingAddType: loading.effects['timeOff/addTimeOffType'],
    loadingFetchList: loading.effects['timeOff/fetchTimeOffTypesByCountry'],
    loadingFetchCountryList: loading.effects['timeOff/getCountryListByCompany'],
  }),
)(TimeOffType);
