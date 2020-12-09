import React, { Component } from 'react';
import { Button, Checkbox, Select, Row, Col } from 'antd';
// import { array } from 'prop-types';
// import { listMonths } from './ListData';
// import CalanderTable from '../CalanderTable';
import s from './index.less';

const { Option } = Select;
const data = [
  {
    mounth: 'Jan ,2020',
    text: 'Jan',
    ref: React.createRef(),
    children: [
      {
        name: 'New Years Day',
        day: 'Friday',
        date: '1st Jan ',
        type: 'Restricted Holiday',
      },
      {
        name: 'New Years Day',
        day: 'Friday',
        date: '1st Jan ',
        type: 'Restricted Holiday',
      },
      {
        name: 'New Years Day',
        day: 'Friday',
        date: '1st Jan ',
        type: 'Restricted Holiday',
      },
      {
        name: 'New Years Day',
        day: 'Friday',
        date: '1st Jan ',
        type: 'Restricted Holiday',
      },
      {
        name: 'New Years Day',
        day: 'Friday',
        date: '1st Jan ',
        type: 'Restricted Holiday',
      },
      {
        name: 'New Years Day',
        day: 'Friday',
        date: '1st Jan ',
        type: 'Restricted Holiday',
      },
    ],
  },
  {
    mounth: 'Feb ,2020',
    text: 'Feb',
    ref: React.createRef(),
    children: [
      {
        name: 'New Years Day',
        day: 'Friday',
        date: '1st Jan ',
        type: 'Restricted Holiday',
      },
      {
        name: 'New Years Day',
        day: 'Friday',
        date: '1st Jan ',
        type: 'Restricted Holiday',
      },
      {
        name: 'New Years Day',
        day: 'Friday',
        date: '1st Jan ',
        type: 'Restricted Holiday',
      },
      {
        name: 'New Years Day',
        day: 'Friday',
        date: '1st Jan ',
        type: 'Restricted Holiday',
      },
      {
        name: 'New Years Day',
        day: 'Friday',
        date: '1st Jan ',
        type: 'Restricted Holiday',
      },
      {
        name: 'New Years Day',
        day: 'Friday',
        date: '1st Jan ',
        type: 'Restricted Holiday',
      },
      {
        name: 'New Years Day',
        day: 'Friday',
        date: '1st Jan ',
        type: 'Restricted Holiday',
      },
    ],
  },
  {
    mounth: 'Mar ,2020',
    text: 'Mar',
    ref: React.createRef(),
    children: [
      {
        name: 'New Years Day',
        day: 'Friday',
        date: '1st Jan ',
        type: 'Restricted Holiday',
      },
      {
        name: 'New Years Day',
        day: 'Friday',
        date: '1st Jan ',
        type: 'Restricted Holiday',
      },
      {
        name: 'New Years Day',
        day: 'Friday',
        date: '1st Jan ',
        type: 'Restricted Holiday',
      },
      {
        name: 'New Years Day',
        day: 'Friday',
        date: '1st Jan ',
        type: 'Restricted Holiday',
      },
      {
        name: 'New Years Day',
        day: 'Friday',
        date: '1st Jan ',
        type: 'Restricted Holiday',
      },
      {
        name: 'New Years Day',
        day: 'Friday',
        date: '1st Jan ',
        type: 'Restricted Holiday',
      },
    ],
  },
  {
    mounth: 'Apr ,2020',
    text: 'Apr',
    ref: React.createRef(),
    children: [
      {
        name: 'New Years Day',
        day: 'Friday',
        date: '1st Jan ',
        type: 'Restricted Holiday',
      },
      {
        name: 'New Years Day',
        day: 'Friday',
        date: '1st Jan ',
        type: 'Restricted Holiday',
      },
      {
        name: 'New Years Day',
        day: 'Friday',
        date: '1st Jan ',
        type: 'Restricted Holiday',
      },
    ],
  },
];
class HollidayCalendar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      select: 'Jan',
    };
  }

  // componentDidMount() {
  //   window.addEventListener('scroll', this.listenToScroll);
  // }

  // componentWillUnmount() {
  //   window.removeEventListener('scroll', this.listenToScroll);
  // }

  // listenToScroll = () => {
  //   const position = window.pageYOffset;
  //   console.log(position);
  //   if (position < 400) {
  //     this.setState({ select: 'Jan' });
  //   } else if (position > 400 && position < 1000) {
  //     this.setState({ select: 'Feb' });
  //   } else if (position > 1000 && position < 1500) {
  //     this.setState({ select: 'Feb' });
  //   } else if (position > 1500 && position < 2000) {
  //     this.setState({ select: 'Mar' });
  //   } else if (position > 900 && position < 1200) {
  //     this.setState({ select: 'Apr' });
  //   }
  // };

  handleChange = (value) => {
    this.setState({ select: value });
    const refComponent = data.find((item) => item.text === value);
    const { ref } = refComponent;
    ref.current.scrollIntoView({ behavior: 'smooth' });
  };

  renderItem = (item) => {
    const { children = [] } = item;
    return (
      <div ref={item.ref}>
        <div key={item.text} className={s.formTable}>
          <div className={s.title}>{item.mounth}</div>
          <div>
            {children.map((itemChildren) => {
              const { date, name, day, type } = itemChildren;
              return (
                <div>
                  <Row gutter={[30, 20]}>
                    <Col>
                      <Checkbox />
                    </Col>
                    <Col span={6}>{name}</Col>
                    <Col span={4}>{date}</Col>
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

  render() {
    const { select } = this.state;
    console.log(select);
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
              <Checkbox>Select All</Checkbox>
            </div>
            <div>
              <Row gutter={[24, 0]}>
                <Col>
                  <Button className={s.btnHoliday}>Add a holiday</Button>
                </Col>
                <Col>
                  <Select style={{ width: 120 }} onChange={this.handleChange}>
                    {data.map((item) => (
                      <Option key={item.mounth} value={item.text}>
                        {item.text}
                      </Option>
                    ))}
                  </Select>
                </Col>
              </Row>
            </div>
          </Col>
          <Row>
            {data.map((render) => (
              <Col span={20}>{this.renderItem(render)}</Col>
            ))}
          </Row>
        </Row>
      </div>
    );
  }
}

export default HollidayCalendar;
