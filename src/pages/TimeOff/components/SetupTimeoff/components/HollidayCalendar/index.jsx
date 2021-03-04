import React, { Component } from 'react';
import { Button, Checkbox, Select, Row, Col, Spin, InputNumber, Affix } from 'antd';
import { connect } from 'umi';
import moment from 'moment';
import AddHoliday from './AddHoliday';
import s from './index.less';

const { Option } = Select;

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
    timeOff: { countryList = [] } = {},
    loading,
    user: {
      currentUser: {
        company: { _id: idCompany = '' } = {},
        location: { _id: idLocation = '' } = {},
      } = {},
    } = {},
  }) => ({
    countryList,
    loading: loading.effects['timeOff/fetchHolidaysListBylocation'],
    loadingbyCountry: loading.effects['timeOff/fetchHolidaysListBylocation'],
    loadingAddHoliday: loading.effects['timeOff/addHoliday'],
    idCompany,
    idLocation,
  }),
)
class HollidayCalendar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      role: '',
      yearSelect: 2021,
      list: {},
      idCheck: [],
      visible: false,
      isActive: '',
      // listCheck: [],
      // indeterminate: true,
      // checkAll: false,
    };
  }

  findRole = (roles) => {
    const hrGlobal = roles.find((item) => item === 'hr-global');
    const role = hrGlobal || 'employee';
    return role;
  };

  componentDidMount = () => {
    const listRole = localStorage.getItem('antd-pro-authority');
    const role = this.findRole(JSON.parse(listRole));
    this.setState({
      role,
    });
    const d = new Date();
    const year = d.getFullYear();
    const formatYear = year.toString();
    this.initListHoliday(formatYear);
  };

  initListHoliday = (year) => {
    const { dispatch, idLocation } = this.props;
    dispatch({
      type: 'timeOff/fetchHolidaysListBylocation',
      payload: { location: idLocation },
    }).then((response) => {
      const { statusCode, data: listData = {} } = response;
      this.setState({
        list: listData,
      });
      const { holiday = [] } = listData;
      if (statusCode === 200) {
        const newList = holiday.filter((item) => {
          const { date } = item;
          const yearCurrent = moment(date).format('YYYY');
          return yearCurrent === year;
        });
        this.fomatDate(newList);
      }
    });
  };

  handleChange = (e, value) => {
    e.preventDefault();
    const { data } = this.state;
    const refComponent = data.find((item) => item.text === value);
    refComponent.ref.current.scrollIntoView(true);
    window.scrollBy({
      top: -60,
      left: 0,
      behavior: 'smooth',
    });

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

  changeCountry = (value) => {
    const { yearSelect } = this.state;
    const { dispatch } = this.props;
    const year = yearSelect.toString();
    dispatch({
      type: 'timeOff/fetchHolidaysByCountry',
      payload: { country: value },
    }).then((response) => {
      const { statusCode, data: listByCountry = {} } = response;
      this.setState({
        list: listByCountry,
      });
      const { holiday = [] } = listByCountry;
      if (statusCode === 200) {
        const newList = holiday.filter((item) => {
          const { date } = item;
          const yearCurrent = moment(date).format('YYYY');
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

  addHoliday = (value) => {
    const { dispatch } = this.props;
    const { yearSelect } = this.state;
    dispatch({
      type: 'timeOff/addHoliday',
      payload: value,
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
    const { list = [], yearSelect } = this.state;
    const { _id: idObjHolidays } = list;
    dispatch({
      type: 'timeOff/deleteHoliday',
      payload: { removeId: id, id: idObjHolidays },
    }).then((response) => {
      const { statusCode } = response;
      if (statusCode === 200) {
        this.initListHoliday(yearSelect.toString());
      }
    });
  };

  renderItem = (item) => {
    const { children = [] } = item;
    const { idCheck = [] } = this.state;
    return (
      <div ref={item.ref}>
        <div key={item.text} className={s.formTable}>
          <div className={s.title}>{item.month}</div>
          <div>
            {children.map((itemChildren, index) => {
              const { date, name, type, _id } = itemChildren;
              const dateFormat = moment(date).format('MM-DD-YYYY');
              const day = moment(date).format('dddd');
              return (
                <div key={_id}>
                  <Row gutter={[30, 20]} className={s.textStyles}>
                    <Col>
                      <Checkbox onChange={(e) => this.handleClickDelete(e, _id)} />
                      {/* <Checkbox.Group
                        // options={data}
                        value={listCheck}
                        onChange={(e) => this.handleClickDelete(e, _id)}
                      /> */}
                    </Col>

                    <Col span={8} className={s.textHoliday}>
                      {name}
                    </Col>
                    <Col span={4} className={s.dateHoliday}>
                      {dateFormat}
                    </Col>
                    <Col span={4} className={s.dateHoliday}>
                      {day}
                    </Col>
                    <Col span={4} className={s.dateHoliday}>
                      {type}
                    </Col>
                    {idCheck.indexOf(_id) > -1 && (
                      <Col span={3} onClick={() => this.deleteHoliday(_id)}>
                        <Button className={s.deleteHoliday}>Delete</Button>
                      </Col>
                    )}
                  </Row>
                  {index !== children.length - 1 ? <div className={s.straight} /> : ''}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  fomatDate = (holidaysList = []) => {
    let result = MOCK_DATA;
    holidaysList.forEach((item) => {
      const monthItem = moment(item.date).format('MMM');
      const fomatDataItem = moment(item.date).format('MMM , YYYY');
      result = result.map((resultItem) => ({
        ...resultItem,
        month: resultItem.text === monthItem ? fomatDataItem : resultItem.month,
        children:
          resultItem.text === monthItem ? [...resultItem.children, item] : resultItem.children,
      }));
    });
    result = result.filter((resultItem) => resultItem.children.length > 0);
    this.setState({ data: result });
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

  onCheckAllChange = () => {
    // this.setState({
    //   listCheck: [],
    // checkAll: e.target,
    // });
  };

  renderCountry = () => {
    const { countryList = [] } = this.props;
    const arrCountry = [
      {
        id: 'IN',
        value: 'India',
      },
      {
        id: 'US',
        value: 'USA',
      },
      {
        id: 'VN',
        value: 'Viet Nam',
      },
    ];

    let flagUrl = '';

    const flagItem = (id) => {
      countryList.forEach((item) => {
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
        {arrCountry.map((item) => (
          <Option key={item.id} value={item.value} style={{ height: '20px', display: 'flex' }}>
            <div className={s.labelText}>
              {flagItem(item.id)}
              <span>{item.value}</span>
            </div>
          </Option>
        ))}
      </>
    );
  };

  handleChangeSelect = (value) => {
    console.log('value: ', value);
  };

  render() {
    const { data, role, yearSelect, visible = true, isActive } = this.state;
    const { loading = false, loadingbyCountry = false, loadingAddHoliday = false } = this.props;
    // const classNameListDate = isActive ? s.listDateActive : s.listDate;
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
              filterOption={(input, option) =>
                option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              className={s.selectCountry}
              defaultValue="India"
              onChange={(value) => this.handleChangeSelect(value)}
            >
              {this.renderCountry()}
            </Select>
          </div>
        </div>

        <div className={s.container}>
          <Row gutter={[24, 12]}>
            <Col span={20}>
              <div className={s.listHoliday}>
                <div span={24} className={s.flex}>
                  <div>
                    <Checkbox className={s.select} onClick={this.onCheckAllChange}>
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
                <div>
                  <Row>
                    {loading || loadingbyCountry || loadingAddHoliday ? (
                      <Col span={24} className={s.center}>
                        <Spin />
                      </Col>
                    ) : (
                      data.map((render, index) => (
                        <Col key={`${index + 1}`} span={24}>
                          {this.renderItem(render)}
                        </Col>
                      ))
                    )}
                  </Row>
                </div>
              </div>
            </Col>
            <Col span={4}>
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
