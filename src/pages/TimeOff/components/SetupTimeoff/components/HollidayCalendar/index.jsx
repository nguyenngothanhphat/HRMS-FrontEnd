import React, { Component } from 'react';
import { Button, Checkbox, Select, Row, Col, Spin } from 'antd';
import { connect } from 'umi';
import moment from 'moment';
import s from './index.less';

const { Option } = Select;
@connect(({ timeOff, loading }) => ({
  timeOff,
  loading: loading.effects['timeOff/fetchHolidaysList'],
}))
class HollidayCalendar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      select: 'Jan',
      data: [
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
      ],
    };
  }

  componentDidMount = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'timeOff/fetchHolidaysList',
      payload: { year: moment().format('YYYY'), month: '' },
    }).then((response) => {
      const { statusCode, data: holidaysList = [] } = response;
      if (statusCode === 200) {
        this.fomatDate(holidaysList);
      }
    });
  };

  handleChange = (value) => {
    const { data } = this.state;
    this.setState({ select: value });
    const refComponent = data.find((item) => item.text === value);
    refComponent.ref.current.scrollIntoView(true);
    window.scrollBy(0, -70);
  };

  renderItem = (item) => {
    const { children = [] } = item;
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
                      <Checkbox />
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
    const { data } = this.state;
    let result = data;
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
    const { select, data } = this.state;
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
        <Row className={s.listHoliday}>
          <Col span={24} className={s.flex}>
            <div>
              <Checkbox className={s.select}>Select All</Checkbox>
            </div>
            <div>
              <Row gutter={[24, 0]}>
                <Col>
                  <Button className={s.btnHoliday}>Add a holiday</Button>
                </Col>
                <Col>
                  <Select style={{ width: 120 }} onChange={this.handleChange} value={select}>
                    {data.map((item) => (
                      <Option key={item.month} value={item.text}>
                        {item.text}
                      </Option>
                    ))}
                  </Select>
                </Col>
              </Row>
            </div>
          </Col>
          <Row style={{ width: '100%' }}>
            {loading ? (
              <Col span={24} className={s.center}>
                <Spin />
              </Col>
            ) : (
              data.map((render) => <Col span={20}>{this.renderItem(render)}</Col>)
            )}
          </Row>
        </Row>
      </div>
    );
  }
}

export default HollidayCalendar;
