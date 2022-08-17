import { Select } from 'antd';
import React, { useEffect } from 'react';
import { connect } from 'umi';
import LayoutHelpSettingPage from '@/components/LayoutHelpSettingPage';
import { HELP_STR, HELP_TYPO } from '@/constants/helpPage';
import { PageContainer } from '@/layouts/layout/src';
import Category from './components/Category';
import List from './components/List';
import styles from './index.less';
import { goToTop } from '@/utils/utils';

const { Option } = Select;

const Settings = (props) => {
  const {
    dispatch,
    countryID = '',
    companyLocationList = [],
    loadingGetListCountry = false,
    match: { params: { tabName = '' } = {} },
    helpPage: { selectedCountry = '', helpType = '' } = {},
  } = props;

  useEffect(() => {
    goToTop();
    dispatch({
      type: 'helpPage/save',
      payload: {
        selectedCountry: countryID,
      },
    });
  }, []);

  const removeDuplicate = (array, key) => {
    return [...new Map(array.map((x) => [key(x), x])).values()];
  };

  const renderCountry = () => {
    let countryArr = [];
    if (companyLocationList.length > 0) {
      countryArr = companyLocationList.map((item) => {
        return item.headQuarterAddress?.country;
      });
    }
    const newArr = removeDuplicate(countryArr, (item) => item?._id);

    let flagUrl = '';

    const flagItem = (id) => {
      newArr.forEach((item) => {
        if (item?._id === id) {
          flagUrl = item?.flag;
        }
        return flagUrl;
      });

      return (
        <div
          style={{
            maxWidth: '16px',
            height: '16px',
            display: 'inline-flex',
            alignItems: 'center',
            marginRight: '12px',
          }}
        >
          <img
            src={flagUrl}
            alt="flag"
            style={{
              width: '100%',
              borderRadius: '50%',
              height: '100%',
            }}
          />
        </div>
      );
    };
    return (
      <>
        {newArr.map((item) => (
          <Option key={item?._id} value={item?._id} className={styles.optionCountry}>
            <div className={styles.labelText}>
              {flagItem(item?._id)}
              <span style={{ fontSize: '12px', fontWeight: '500' }}>{item?.name}</span>
            </div>
          </Option>
        ))}
      </>
    );
  };

  const changeCountry = async (value) => {
    dispatch({
      type: 'helpPage/save',
      payload: {
        selectedCountry: value,
      },
    });

    dispatch({
      type: 'helpPage/fetchHelpCategoryList',
      payload: {
        country: [value],
        type: helpType,
      },
    });
  };

  const listMenu = [
    {
      id: 1,
      name: HELP_TYPO[helpType]?.SETTINGS.CATEGORY.TAB_NAME,
      link: 'category',
      component: <Category />,
    },
    {
      id: 2,
      name: HELP_TYPO[helpType]?.SETTINGS.QUESTION_TOPIC.TAB_NAME,
      link: 'list',
      component: <List />,
    },
  ];

  return (
    <PageContainer>
      <div className={styles.SettingFAQ}>
        <div className={styles.header}>
          <div className={styles.header__left}>Settings</div>
          <div className={styles.header__location}>
            <Select
              value={selectedCountry}
              size="large"
              placeholder="Please select the country"
              showArrow
              loading={loadingGetListCountry}
              disabled={loadingGetListCountry}
              filterOption={(input, option) => {
                return option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
              }}
              className={styles.selectCountry}
              onChange={changeCountry}
            >
              {renderCountry()}
            </Select>
          </div>
        </div>
        <LayoutHelpSettingPage
          listMenu={listMenu}
          reId={tabName}
          baseUrl={HELP_STR.SETTINGS[helpType]}
        />
      </div>
    </PageContainer>
  );
};

export default connect(
  ({
    loading,
    helpPage,
    user: {
      permissions = {},
      currentUser: {
        location: { headQuarterAddress: { country: { _id: countryID = '' } = {} } = {} } = {},
      } = {},
    },
    location: { companyLocationList = [] } = {},
  }) => ({
    loadingGetListCountry: loading.effects['helpPage/fetchListLocationEffect'],
    companyLocationList,
    countryID,
    permissions,
    helpPage,
  }),
)(Settings);
