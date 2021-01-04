import React, { Component } from 'react';
import { Button, Checkbox, Select, Row, Col, Spin, InputNumber } from 'antd';
import { connect } from 'umi';
import moment from 'moment';
import s from './index.less';

const CheckboxGroup = Checkbox.Group;

const { Option } = Select;
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
@connect(({ timeOff, loading }) => ({
  timeOff,
  loading: loading.effects['timeOff/fetchHolidaysList'],
}))
class HollidayCalendar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      // indeterminate: true,
      // checkedList: [],
      // plainOptions: [],
      // checkAll: false,
    };
  }

  componentDidMount = () => {
    const d = new Date();
    const year = d.getFullYear();
    this.initListHoliday(year);
  };

  // shouldComponentUpdate(nextProps, nextState) {
  //   const { year } = this.state;
  //   const { year: nextyear } = nextState;
  //   if (year !== nextyear) {
  //     this.initListHoliday(nextyear);
  //   }
  //   return true;
  // }

  initListHoliday = (currenYear) => {
    const { dispatch } = this.props;
    // const { year } = this.state;
    dispatch({
      type: 'timeOff/fetchHolidaysList',
      payload: { year: currenYear, month: '' },
    }).then((response) => {
      const { statusCode, data: holidaysList = [] } = response;
      if (statusCode === 200) {
        this.fomatDate(holidaysList);
      }
    });
  };

  handleChange = (value) => {
    const { data } = this.state;
    // this.setState({ select: value });
    const refComponent = data.find((item) => item.text === value);
    refComponent.ref.current.scrollIntoView(true);
    window.scrollBy(0, -70);
  };

  onChange = (value) => {
    // this.setState({ year: value });
    this.initListHoliday(value);
  };

  // onChangeCheckAll = (checkedList) => {
  //   const { plainOptions } = this.state;
  //   this.setState({
  //     list: checkedList,
  //     indeterminate: !!checkedList.length && checkedList.length,
  //     checkAll: checkedList.length === plainOptions.length,
  //   });
  // };

  renderItem = (item) => {
    const { children = [] } = item;
    const { checkedList, plainOptions } = this.state;
    return (
      <div ref={item.ref}>
        <div key={item.text} className={s.formTable}>
          <div className={s.title}>{item.month}</div>
          <div>
            {children.map((itemChildren) => {
              const { date, name, type } = itemChildren;
              const dateFormat = moment(date).format('MMM Do');
              const day = moment(date).format('dddd');
              return (
                <div>
                  <Row gutter={[30, 20]} className={s.textStyles}>
                    <Col>
                      <CheckboxGroup
                        options={plainOptions}
                        value={checkedList}
                        onChange={this.onChangeCheckAll}
                      />
                    </Col>
                    <Col span={6} className={s.textHoliday}>
                      {name}
                    </Col>
                    <Col span={4} className={s.textHoliday}>
                      {dateFormat}
                    </Col>
                    <Col span={4}>{day}</Col>
                    <Col span={6}>{type}</Col>
                  </Row>
                  <div className={s.straight} />
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
      const fomatDataItem = moment(item.date).format('YYYY, MMM');
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

  render() {
    const { data } = this.state;
    const { loading = false } = this.props;
    return (
      <div className={s.root}>
        <div className={s.setUpWrap}>
          <div className={s.title}>Setup the standard company Holiday Calendar</div>
          <div className={s.description}>
            Below is a list of holidays celebrated in your region/country. Select the ones for which
            your company
            <p> provides holidays. You may add holidays to the list as well.</p>
          </div>
        </div>
        <div className={s.listHoliday}>
          <div span={24} className={s.flex}>
            <div>
              <Checkbox
                // indeterminate={indeterminate} onChange={onCheckAllChange} checked={checkAll}
                className={s.select}
              >
                Select All
              </Checkbox>
            </div>
            <div>
              <Row gutter={[24, 0]}>
                <Col>
                  <Button className={s.btnHoliday}>Add a holiday</Button>
                </Col>
                <Col>
                  <InputNumber
                    min={2019}
                    max={2022}
                    defaultValue={moment().format('YYYY')}
                    onChange={this.onChange}
                  />
                </Col>
                <Col>
                  <Select style={{ width: 120 }} onChange={this.handleChange}>
                    {data.map((item) => (
                      <Option key={item.month} value={item.text}>
                        {item.text}
                      </Option>
                    ))}
                  </Select>
                </Col>
              </Row>
            </div>
          </div>
          <div>
            <Row>
              {loading ? (
                <Col span={24} className={s.center}>
                  <Spin />
                </Col>
              ) : (
                data.map((render) => <Col span={20}>{this.renderItem(render)}</Col>)
              )}
            </Row>
          </div>
        </div>
      </div>
    );
  }
}

export default HollidayCalendar;
