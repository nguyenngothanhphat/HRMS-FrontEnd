import React, { Component } from 'react';
import { Button, Checkbox, Select, Row, Col, Spin, InputNumber, Affix, Divider } from 'antd';
import { connect } from 'umi';
import moment from 'moment';
import { getCurrentCompany, getCurrentLocation, getCurrentTenant } from '@/utils/authority';
import AddHoliday from './AddHoliday';
import s from './index.less';

const { Option } = Select;
const CheckboxGroup = Checkbox.Group;

// const listCountry = [
//   { country: 'VN', code: 'vietnamese', label: 'Viet Nam' },
//   { country: 'US', code: 'usa', label: 'US' },
//   { country: 'IN', code: 'indian', label: ' India' },
// ];

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
@connect(
  ({
    timeOff: {
      holidaysListByLocation = [],
      holidaysListByCountry = [],
      tempData: { countryHoliday = '' },
    } = {},
    location: { companyLocationList: countryList = [] } = {},
    loading,
    user: { currentUser: { company: { _id: idCompany = '' } = {}, location = {} } = {} } = {},
  }) => ({
    holidaysListByLocation,
    holidaysListByCountry,
    countryHoliday,
    countryList,
    loading: loading.effects['timeOff/fetchHolidaysListBylocation'],
    loadingbyCountry: loading.effects['timeOff/fetchHolidaysByCountry'],
    loadingAddHoliday: loading.effects['timeOff/addHoliday'],
    idCompany,
    location,
  }),
)
class HollidayCalendar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      yearSelect: moment().format('YYYY'),
      list: {},
      idCheck: [],
      visible: false,
      isActive: 'Jan',
      checkAll: false,
      plainOptions: [],
      checkedList: [],
      indeterminate: false,
    };
  }

  componentDidUpdate = (prevProps, prevState) => {
    const { yearSelect } = this.state;
    const year = yearSelect.toString();
    const { dispatch, countryHoliday } = this.props;
    if (yearSelect !== prevState.yearSelect) {
      dispatch({
        type: 'timeOff/fetchHolidaysByCountry',
        payload: {
          country: countryHoliday,
        },
      }).then((response) => {
        const { statusCode, data } = response;
        this.setState({
          list: data,
        });
        // const { holiday = [] } = data;
        if (statusCode === 200) {
          const newList = data.filter((item) => {
            const { date: { dateTime: { year: yearCurrent = '' } = {} } = {} } = item;
            // const yearCurrent = moment(date).format('YYYY');
            return yearCurrent === year;
          });
          this.fomatDate(newList);
        }
      });
    }
  };

  componentWillUnmount = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'timeOff/saveTemp',
      payload: {
        countryHoliday: '',
      },
    });
  };

  findRole = (roles) => {
    const hrGlobal = roles.find((item) => item === 'hr-global');
    const role = hrGlobal || 'employee';
    return role;
  };

  initListHoliday = (year) => {
    const { dispatch, countryHoliday } = this.props;
    dispatch({
      type: 'timeOff/fetchHolidaysByCountry',
      payload: {
        // location: getCurrentLocation(),
        country: countryHoliday,
      },
    }).then((response) => {
      const { statusCode, data } = response;
      this.setState({
        list: data,
      });
      if (statusCode === 200) {
        const newList = data.filter((item) => item.date.dateTime.year === year);
        this.fomatDate(newList);
      }
    });
  };

  handleChangeSelect = (value) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'timeOff/fetchHolidaysByCountry',
      payload: {
        country: value,
      },
    });
  };

  handleChange = (e, value) => {
    e.preventDefault();
    const { data } = this.state;
    const refComponent = data.find((item) => item.text === value);
    if (refComponent.ref.current) {
      refComponent.ref.current.scrollIntoView(true);
      window.scrollBy({
        top: -60,
        left: 0,
        behavior: 'smooth',
      });
    }

    this.setState({ isActive: value });
  };

  onChange = (value) => {
    const { list } = this.state;

    this.setState({
      yearSelect: value,
    });
    const { holiday = [] } = list;
    const newList = holiday.filter((item) => {
      const { date } = item;
      const yearCurrent = moment(date).format('YYYY');
      return yearCurrent === value.toString();
    });
    this.fomatDate(newList);
  };

  changeCountry = async (value) => {
    const { yearSelect } = this.state;
    const { dispatch } = this.props;
    const year = yearSelect.toString();
    dispatch({
      type: 'timeOff/saveTemp',
      payload: {
        countryHoliday: value,
      },
    });
    await dispatch({
      type: 'timeOff/fetchHolidaysByCountry',
      payload: { country: value, tenantId: getCurrentTenant() },
    }).then((response) => {
      const { statusCode, data } = response;
      this.setState({
        list: data,
      });
      // const { holiday = [] } = data;
      if (statusCode === 200) {
        const newList = data.filter((item) => {
          const { date: { dateTime: { year: yearCurrent = '' } = {} } = {} } = item;
          // const yearCurrent = moment(date).format('YYYY');
          return yearCurrent === year;
        });
        this.fomatDate(newList);
      }
    });
  };

  handleClickDelete = (e, id) => {
    const { idCheck } = this.state;
    this.setState({
      idCheck: e.target.checked === true ? [...idCheck, id] : idCheck.filter((x) => x !== id),
    });
  };

  addHoliday = async (value) => {
    const { dispatch, countryHoliday } = this.props;
    const { yearSelect } = this.state;
    const payload = {
      newHoliday: {
        ...value,
        country: countryHoliday,
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
        this.initListHoliday(yearSelect.toString());
        this.setState({
          visible: false,
        });
      }
    });
  };

  deleteHoliday = (id) => {
    const { dispatch } = this.props;
    const { yearSelect } = this.state;
    dispatch({
      type: 'timeOff/deleteHoliday',
      payload: { id, tenantId: getCurrentTenant() },
    }).then((response) => {
      const { statusCode } = response;
      if (statusCode === 200) {
        this.initListHoliday(yearSelect.toString());
      }
    });
  };

  onChangeChkBoxGroup = (list) => {
    const { plainOptions = [] } = this.state;

    this.setState({
      checkedList: list,
      indeterminate: !!list.length && list.length < plainOptions.length,
      checkAll: list.length === plainOptions.length,
    });
  };

  // handleCheckBox = (e) => {
  //   const chkBoxVal = e.target.value;
  // };

  fomatDate = (holidaysList = []) => {
    let result = MOCK_DATA;
    const listID = [];
    holidaysList.forEach((item) => {
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
    // result = [...result, result.filter((resultItem) => resultItem.children.length > 0)];
    // get id of each children
    result.forEach((item) => {
      const { children = [] } = item;
      children.sort(
        (a, b) => moment(a.date.iso).format('YYYYMMDD') - moment(b.date.iso).format('YYYYMMDD'),
      );
      const arrID = children.map((subChild) => subChild._id);
      listID.push(...arrID);
    });
    this.setState({ data: result, plainOptions: listID });
  };

  handleCandelSchedule = () => {
    this.setState({
      visible: false,
    });
  };

  handleClick = () => {
    this.setState({
      visible: true,
    });
  };

  renderCountry = () => {
    const { countryList = [] } = this.props;
    let countryArr = [];
    countryArr = countryList.map((item) => {
      return item.headQuarterAddress.country;
    });
    const newArr = this.removeDuplicate(countryArr, (item) => item._id);

    let flagUrl = '';

    const flagItem = (id) => {
      newArr.forEach((item) => {
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
        {newArr.map((item) => (
          <Option key={item._id} value={item._id} style={{ height: '20px', display: 'flex' }}>
            <div className={s.labelText}>
              {flagItem(item._id)}
              <span>{item.name}</span>
            </div>
          </Option>
        ))}
      </>
    );
  };

  removeDuplicate = (array, key) => {
    return [...new Map(array.map((x) => [key(x), x])).values()];
  };

  renderHoliday = (id, dataItem) => {
    const { children } = dataItem;
    const { idCheck = [] } = this.state;
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
                  <Row className={s.holiday}>
                    <Col span={9}>
                      <div className={s.holiday__text}>{name}</div>
                    </Col>
                    <Col span={5}>
                      <div className={s.holiday__date}>{dateFormat}</div>
                    </Col>
                    <Col span={5}>
                      <div className={s.holiday__date}>{day}</div>
                    </Col>
                    <Col span={4}>
                      <div className={s.holiday__date}>{type[0]}</div>
                    </Col>
                    {idCheck.indexOf(_id) > -1 && (
                      <Col span={3} onClick={() => this.deleteHoliday(_id)}>
                        <Button className={s.deleteHoliday}>Delete</Button>
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

  renderInfo = () => {
    const { data, plainOptions } = this.state;
    const newData = data.filter((item) => item.children.length > 0);
    return (
      <div>
        {newData.map((itemData, index) => {
          const { children = [] } = itemData;
          return (
            <Row ref={itemData.ref} key={`${index + 1}`} className={s.holidayInfo}>
              <Col span={24} className={s.dateTitle}>
                {itemData.month}
              </Col>
              <Col span={24} className={s.holidayList}>
                {plainOptions.map((id) => (
                  <>
                    {children.map((item, idx) => (
                      <>
                        {item._id === id ? (
                          <Row>
                            <Col span={1}>
                              <div span={1} key={`${idx + 1}`}>
                                <Checkbox
                                  onClick={(e) => this.handleClickDelete(e, item._id)}
                                  onChange={this.handleCheckBox}
                                  value={id}
                                />
                              </div>
                            </Col>
                            <Col span={23}>{this.renderHoliday(id, itemData)}</Col>
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

  render() {
    const {
      data,
      yearSelect,
      visible = true,
      isActive,
      checkAll,
      indeterminate,
      plainOptions,
      checkedList,
    } = this.state;
    const {
      // loading = false,
      loadingbyCountry,
      loadingAddHoliday,
      countryHoliday,
    } = this.props;

    const newData = data.filter((item) => item.children.length > 0);
    return (
      <div className={s.root}>
        <div className={s.setUpWrap}>
          <div className={s.title}>Setup the standard company Holiday Calendar</div>
          <div className={s.description}>
            Below is a list of holidays celebrated in your region/country. Select the ones for which
            your company
            <p> provides holidays. You may add holidays to the list as well.</p>
          </div>

          {/* {role === 'hr-global' && (
            <Select style={{ width: 250 }} onChange={this.changeCountry}>
              {listCountry.map((item) => (
                <Option key={item.code} value={item.country}>
                  {item.label}
                </Option>
              ))}
            </Select>
          )} */}
          <div className={s.topHeader}>
            <Select
              size="large"
              placeholder="Please select country"
              showArrow
              filterOption={(input, option) => {
                return option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
              }}
              className={s.selectCountry}
              onChange={(value) => this.changeCountry(value)}
            >
              {this.renderCountry()}
            </Select>
          </div>
        </div>
        {countryHoliday !== '' && (
          <div className={s.container}>
            <Row gutter={[24, 24]}>
              <Col span={18} className={s.listHoliday}>
                <div>
                  <div span={24} className={s.flex}>
                    <div>
                      <Checkbox
                        className={s.select}
                        onChange={(e) => {
                          this.setState({
                            checkedList: e.target.checked ? plainOptions : [],
                            indeterminate: false,
                            checkAll: e.target.checked,
                          });
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
                          <Button className={s.btnHoliday} onClick={this.handleClick}>
                            Add a holiday
                          </Button>
                        </Col>
                      </Row>
                    </div>
                  </div>
                  {loadingbyCountry || loadingAddHoliday ? (
                    <div className={s.loadingListCountry}>
                      <Spin size="large" />
                    </div>
                  ) : (
                    <div>
                      <Row>
                        <Col span={24}>
                          <CheckboxGroup
                            className={s.chkBoxGroup}
                            value={checkedList}
                            onChange={this.onChangeChkBoxGroup}
                          >
                            <div>{this.renderInfo()}</div>
                          </CheckboxGroup>
                        </Col>
                      </Row>
                    </div>
                  )}
                </div>
              </Col>
              <Col span={6} justify="center">
                <Affix offsetTop={42} className={s.affix}>
                  <div className={s.rightSection}>
                    <InputNumber
                      min={2020}
                      max={2022}
                      defaultValue={yearSelect}
                      onChange={this.onChange}
                      className={s.inputNum}
                    />
                    <div className={s.dateSelect}>
                      {data.map((item) => (
                        <div
                          key={item.month}
                          className={s.listDate}
                          onClick={(e) => this.handleChange(e, item.text)}
                        >
                          {isActive === item.text ? (
                            <span className={s.listDate__active}>{item.text}</span>
                          ) : (
                            <span className={s.listDate__nonActive}>{item.text}</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </Affix>
              </Col>
            </Row>
          </div>
        )}
        <AddHoliday
          visible={visible}
          handleCancel={this.handleCandelSchedule}
          addHoliday={this.addHoliday}
        />
      </div>
    );
  }
}

export default HollidayCalendar;
