import { Col, DatePicker, Popover, Radio, Row, Tooltip, Typography } from 'antd';
import moment from 'moment';
import React, { PureComponent } from 'react';
import { connect } from 'umi';
import WarningIcon from '@/assets/candidatePortal/warningIcon.svg';
import InternalStyle from './FilledByCandidate.less';

const dateFormat = 'MM.DD.YY';
@connect(({ candidatePortal: { data, tempData = {}, checkMandatory } = {} }) => ({
  data,
  tempData,
  checkMandatory,
}))
class FilledByCandidate extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isHidden: false,
      acceptDOJ: false,
      originalDOJ: '',
    };
  }

  componentDidMount = () => {
    const { data: { acceptDOJ = true, dateOfJoining = '' } = {} } = this.props;
    if (acceptDOJ && dateOfJoining) {
      this.setState({
        acceptDOJ: true,
        originalDOJ: dateOfJoining,
      });
    } else {
      this.setState({
        acceptDOJ: false,
        originalDOJ: dateOfJoining,
      });
    }
  };

  handleClick = () => {
    this.setState((prevState) => ({
      isHidden: !prevState.isHidden,
    }));
  };

  disabledDate = (current) => {
    // Can not select days before today and today
    return current && current < moment().startOf('day');
  };

  checkChange = (e) => {
    const {
      // dispatch, checkMandatory,
      _handleSelect = () => {},
    } = this.props;
    const { value } = e.target;
    this.setState({
      acceptDOJ: value,
    });
    _handleSelect(value, 'noPropose');
  };

  render() {
    const {
      styles,
      candidateField,
      _handleSelect = () => {},
      tempData: { dateOfJoining: tempDOJ = '' } = {},
    } = this.props;
    const { acceptDOJ, originalDOJ } = this.state;

    return (
      <div className={InternalStyle.CandidateFields}>
        <Row gutter={[24, 0]}>
          <Col xs={24} sm={24} md={12} lg={12} xl={12}>
            <Typography.Title level={5}>
              {candidateField[2].name}
              <Popover
                placement="right"
                content={
                  <span
                    style={{
                      color: '#707177',
                      display: 'inline-block',
                      maxWidth: '300px',
                      fontSize: '13px',
                    }}
                  >
                    This is our suggested Joining Date. If you cant join on this date, please select
                    'No' below to input your preferred Joining Date.
                  </span>
                }
                trigger="hover"
              >
                <span
                  style={{
                    marginLeft: '10px',
                    marginTop: '-2px',
                  }}
                >
                  <img src={WarningIcon} alt="info" />
                </span>
              </Popover>
            </Typography.Title>
            <DatePicker
              className={styles}
              allowClear={false}
              disabledDate={this.disabledDate}
              placeholder=""
              picker="date"
              format={dateFormat}
              disabled
              // onChange={(value) => _handleSelect(value, candidateField[2].title)}
              value={originalDOJ ? moment(originalDOJ) : undefined}
            />
          </Col>
          {/* {!acceptDOJ && (
            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
              <Typography.Title level={5}>{candidateField[0].name}</Typography.Title>
              <InputNumber
                min={1}
                placeholder={candidateField[0].placeholder}
                className={styles}
                onChange={(value) => _handleSelect(value, candidateField[0].title)}
                defaultValue={noticePeriod}
              />
            </Col>
          )} */}
        </Row>

        <Row gutter={[24, 0]} className={InternalStyle.RadioNewDate}>
          <Col xs={24}>
            <span className={InternalStyle.RadioNewDateTitle}>
              Can you join at the above mentioned date?
            </span>
            <Radio.Group onChange={this.checkChange} value={acceptDOJ} buttonStyle="solid">
              <Radio.Button value>Yes</Radio.Button>
              <Radio.Button value={false}>No</Radio.Button>
            </Radio.Group>
          </Col>
        </Row>

        {!acceptDOJ && (
          <Row gutter={[24, 0]}>
            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
              <Typography.Title level={5}>{candidateField[1].name}</Typography.Title>
              <DatePicker
                className={styles}
                allowClear={false}
                disabledDate={this.disabledDate}
                placeholder="Select a date"
                picker="date"
                format={dateFormat}
                onChange={(value) => _handleSelect(value, candidateField[2].title)}
                value={tempDOJ ? moment(tempDOJ) : null}
              />
            </Col>
          </Row>
        )}
      </div>
    );
  }
}

export default FilledByCandidate;
