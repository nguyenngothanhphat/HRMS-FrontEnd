import { Button, Checkbox, Col, Divider, InputNumber, Row, Select, Spin } from 'antd';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { connect } from 'umi';
import { getCurrentCompany, getCurrentLocation, getCurrentTenant } from '@/utils/authority';
import AddHoliday from './components/AddHoliday';
import styles from './index.less';

const { Option } = Select;
const CheckboxGroup = Checkbox.Group;

const MOCK_DATA = [
  {
    text: 'Jan',
    ref: React.createRef(),
    children: [],
  },
  {
    text: 'Feb',
    ref: React.createRef(),
    children: [],
  },
  {
    text: 'Mar',
    ref: React.createRef(),
    children: [],
  },
  {
    text: 'Apr',
    ref: React.createRef(),
    children: [],
  },
  {
    text: 'May',
    ref: React.createRef(),
    children: [],
  },
  {
    text: 'Jun',
    ref: React.createRef(),
    children: [],
  },
  {
    text: 'Jul',
    ref: React.createRef(),
    children: [],
  },
  {
    text: 'Aug',
    ref: React.createRef(),
    children: [],
  },
  {
    text: 'Sep',
    ref: React.createRef(),
    children: [],
  },
  {
    text: 'Oct',
    ref: React.createRef(),
    children: [],
  },
  {
    text: 'Nov',
    ref: React.createRef(),
    children: [],
  },
  {
    text: 'Dec',
    ref: React.createRef(),
    children: [],
  },
];

const TimeOffType = (props) => {
  const {
    dispatch,
    countryList = [],
    loadingFetchCountryList = false,
    timeOff: { holidaysListByCountry = [], tempData: { selectedCountry = '' } } = {},
    loadingFetchByCountry = false,
    loadingAddHoliday = false,
  } = props;

  const [countryListState, setCountryListState] = useState([]);
  const [data, setData] = useState([]);
  const [checkedList, setCheckedList] = useState([]);
  const [indeterminate, setIndeterminate] = useState(false);
  const [checkAll, setCheckAll] = useState(false);
  const [checkedIds, setCheckedIds] = useState([]);
  const [plainOptions, setPlainOptions] = useState([]);
  const [activeMonth, setActiveMonth] = useState('Jan');
  const [selectedYear, setSelectedYear] = useState(moment().format('YYYY'));
  const [isAddHolidayVisible, setIsAddHolidayVisible] = useState(false);

  const fetchHolidaysByCountry = () => {
    dispatch({
      type: 'timeOff/fetchHolidaysByCountry',
      payload: {
        country: selectedCountry,
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

  const formatData = (year) => {
    const tempData = holidaysListByCountry.filter((item) => {
      const { date: { dateTime: { year: currentYear = '' } = {} } = {} } = item;
      return currentYear === year.toString();
    });

    let result = MOCK_DATA;
    const listID = [];
    tempData.forEach((item) => {
      const monthItem = moment(item.date.iso).format('MMM');
      const fomatDataItem = moment(item.date.iso).format('MMM , YYYY');
      result = result.map((resultItem) => ({
        ...resultItem,
        month:
          resultItem.text === monthItem
            ? fomatDataItem
            : `${resultItem.text}, ${item.date.dateTime.year}`,
        children:
          resultItem.text === monthItem ? [...resultItem.children, item] : resultItem.children,
      }));
    });
    // get id of each children
    result.forEach((item) => {
      const { children = [] } = item;
      children.sort(
        (a, b) => moment(a.date.iso).format('YYYYMMDD') - moment(b.date.iso).format('YYYYMMDD'),
      );
      const arrID = children.map((subChild) => subChild._id);
      listID.push(...arrID);
    });

    setData(result);
    setPlainOptions(listID);
  };

  useEffect(() => {
    if (selectedCountry) {
      fetchHolidaysByCountry();
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

  useEffect(() => {
    formatData(selectedYear);
  }, [JSON.stringify(holidaysListByCountry), selectedYear]);

  const handleMonthChange = (e, value) => {
    e.preventDefault();
    const refComponent = data.find((item) => item.text === value);
    if (refComponent?.ref?.current) {
      refComponent.ref.current.scrollIntoView(true);
      window.scrollBy({
        top: -60,
        left: 0,
        behavior: 'smooth',
      });
    }

    setActiveMonth(value);
  };

  const renderCountry = () => {
    let flagUrl = '';

    const flagItem = (id) => {
      countryListState.forEach((item) => {
        if (item._id === id) {
          flagUrl = item.flag;
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
        {countryListState.map((item) => (
          <Option key={item._id} value={item._id} style={{ height: '20px', display: 'flex' }}>
            <div className={styles.labelText}>
              {flagItem(item._id)}
              <span>{item.name}</span>
            </div>
          </Option>
        ))}
      </>
    );
  };

  const newData = data.filter((item) => (item.children ? item.children.length > 0 : false));
  const onChangeCheckBoxGroup = (list) => {
    setCheckedList(list);
    setIndeterminate(!!list.length && list.length < plainOptions.length);
    setCheckAll(list.length === plainOptions.length);
  };

  const handleClickDelete = (e, id) => {
    setCheckedIds(
      e.target.checked === true ? [...checkedIds, id] : checkedIds.filter((x) => x !== id),
    );
  };

  const onAddHoliday = async (value) => {
    const payload = {
      newHoliday: {
        ...value,
        country: selectedCountry,
        location: getCurrentLocation(),
        company: getCurrentCompany(),
      },
    };
    await dispatch({
      type: 'timeOff/addHoliday',
      payload,
    }).then((response) => {
      const { statusCode } = response;
      if (statusCode === 200) {
        setIsAddHolidayVisible(false);
        fetchHolidaysByCountry();
      }
    });
  };

  const deleteHoliday = (id) => {
    dispatch({
      type: 'timeOff/deleteHoliday',
      payload: { id, tenantId: getCurrentTenant() },
    }).then((response) => {
      const { statusCode } = response;
      if (statusCode === 200) {
        fetchHolidaysByCountry();
      }
    });
  };

  const renderHoliday = (id, dataItem) => {
    const { children } = dataItem;
    return (
      <>
        {children.map((subChild) => {
          const { date, name, type, _id } = subChild;
          const dateFormat = moment(date.iso).format('Do MMM');
          const day = moment(date.iso).format('dddd');
          return (
            <>
              {subChild._id === id ? (
                <div key={_id}>
                  <Row className={styles.holiday}>
                    <Col span={9}>
                      <div className={styles.holiday__text}>{name}</div>
                    </Col>
                    <Col span={5}>
                      <div className={styles.holiday__date}>{dateFormat}</div>
                    </Col>
                    <Col span={5}>
                      <div className={styles.holiday__date}>{day}</div>
                    </Col>
                    <Col span={4}>
                      <div className={styles.holiday__date}>{type[0]}</div>
                    </Col>
                    {checkedIds.indexOf(_id) > -1 && (
                      <Col span={3} onClick={() => deleteHoliday(_id)}>
                        <Button className={styles.deleteHoliday}>Delete</Button>
                      </Col>
                    )}
                  </Row>
                </div>
              ) : null}
            </>
          );
        })}
      </>
    );
  };

  const renderInfo = () => {
    return (
      <div>
        {newData.map((itemData, index) => {
          const { children = [] } = itemData;
          return (
            <Row ref={itemData.ref} key={`${index + 1}`} className={styles.holidayInfo}>
              <Col span={24} className={styles.dateTitle}>
                {itemData.month}
              </Col>
              <Col span={24} className={styles.holidayList}>
                {plainOptions.map((id) => (
                  <>
                    {children.map((item, idx) => (
                      <>
                        {item._id === id ? (
                          <Row>
                            <Col span={1}>
                              <div span={1} key={`${idx + 1}`}>
                                <Checkbox
                                  onClick={(e) => handleClickDelete(e, item._id)}
                                  value={id}
                                />
                              </div>
                            </Col>
                            <Col span={23}>{renderHoliday(id, itemData)}</Col>
                            {idx !== children.length - 1 ? <Divider /> : null}
                          </Row>
                        ) : null}
                      </>
                    ))}
                  </>
                ))}
              </Col>
            </Row>
          );
        })}
      </div>
    );
  };

  const onChange = (value) => {
    setSelectedYear(value);
  };

  return (
    <div className={styles.HolidayCalendar}>
      <div className={styles.header}>
        <div className={styles.title}>Setup the standard company Holiday Calendar</div>

        <div className={styles.description}>
          Below is a list of holidays celebrated in your region/country. Select the ones for which
          your company provides holidays. You may add holidays to the list as well.
        </div>
      </div>

      <div className={styles.countrySelector}>
        <Select
          showArrow
          filterOption={(input, option) => {
            return option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
          }}
          value={selectedCountry}
          className={styles.selectCountry}
          onChange={onChangeCountry}
          loading={loadingFetchCountryList}
          placeholder={loadingFetchCountryList ? 'Loading country list...' : 'Select country'}
        >
          {renderCountry()}
        </Select>
      </div>

      {selectedCountry && (
        <Spin spinning={loadingFetchByCountry || loadingAddHoliday}>
          <div className={styles.container}>
            <Row gutter={[24, 24]}>
              <Col xs={18} xl={20} className={styles.listHoliday}>
                <div>
                  <div span={24} className={styles.flex}>
                    <div>
                      <Checkbox
                        className={styles.select}
                        onChange={(e) => {
                          setCheckedList(e.target.checked ? plainOptions : []);
                          setIndeterminate(false);
                          setCheckAll(e.target.checked);
                        }}
                        checked={checkAll}
                        indeterminate={indeterminate}
                        disabled={newData.length === 0}
                      >
                        Select All
                      </Checkbox>
                    </div>
                    <div>
                      <Row gutter={[24, 0]}>
                        <Col>
                          <Button
                            className={styles.btnHoliday}
                            onClick={() => setIsAddHolidayVisible(true)}
                          >
                            Add a holiday
                          </Button>
                        </Col>
                      </Row>
                    </div>
                  </div>

                  <div>
                    <Row>
                      <Col span={24}>
                        <CheckboxGroup
                          className={styles.chkBoxGroup}
                          value={checkedList}
                          onChange={onChangeCheckBoxGroup}
                        >
                          <div>{renderInfo()}</div>
                        </CheckboxGroup>
                      </Col>
                    </Row>
                  </div>
                </div>
              </Col>

              <Col xs={6} xl={4} justify="center">
                <div className={styles.rightSection}>
                  <InputNumber
                    min={2020}
                    max={2022}
                    defaultValue={selectedYear}
                    onChange={onChange}
                    className={styles.inputNum}
                  />
                  <div className={styles.yearSelector}>
                    {data.map((item) => (
                      <div
                        key={item.month}
                        className={styles.listDate}
                        onClick={(e) => handleMonthChange(e, item.text)}
                      >
                        {activeMonth === item.text ? (
                          <span className={styles.listDate__active}>{item.text}</span>
                        ) : (
                          <span className={styles.listDate__nonActive}>{item.text}</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </Col>
            </Row>
          </div>
        </Spin>
      )}
      <AddHoliday
        visible={isAddHolidayVisible}
        handleCancel={() => setIsAddHolidayVisible(false)}
        addHoliday={onAddHoliday}
      />
    </div>
  );
};

export default connect(
  ({ timeOff, location: { companyLocationList: countryList = [] } = {}, loading }) => ({
    timeOff,
    countryList,
    loadingFetchByLocation: loading.effects['timeOff/fetchHolidaysListByLocation'],
    loadingFetchByCountry: loading.effects['timeOff/fetchHolidaysByCountry'],
    loadingAddHoliday: loading.effects['timeOff/addHoliday'],
  }),
)(TimeOffType);
