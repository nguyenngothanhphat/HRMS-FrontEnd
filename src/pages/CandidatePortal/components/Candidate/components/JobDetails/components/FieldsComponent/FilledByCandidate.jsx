import { Col, DatePicker, Radio, Row, Typography } from 'antd';
import moment from 'moment';
import React, { PureComponent } from 'react';
import { connect } from 'umi';
import InternalStyle from './FilledByCandidate.less';

const dateFormat = 'MM.DD.YY';
@connect(({ candidatePortal: { data, checkMandatory } = {} }) => ({
  data,
  checkMandatory,
}))
class FilledByCandidate extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isHidden: false,
      acceptDOJ: false,
    };
  }

  componentDidMount = () => {
    const { data: { acceptDOJ = true, dateOfJoining = '' } = {} } = this.props;
    if (acceptDOJ && dateOfJoining) {
      this.setState({
        acceptDOJ: true,
      });
    } else {
      this.setState({
        acceptDOJ: false,
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
      data: { dateOfJoining = '' },
    } = this.props;
    const { acceptDOJ } = this.state;

    return (
      <div className={InternalStyle.CandidateFields}>
        <Row gutter={[24, 0]}>
          <Col xs={24} sm={24} md={12} lg={12} xl={12}>
            <Typography.Title level={5}>
              {acceptDOJ ? candidateField[1].name : candidateField[2].name}*
            </Typography.Title>
            <DatePicker
              className={styles}
              allowClear={false}
              disabledDate={this.disabledDate}
              placeholder=""
              picker="date"
              format={dateFormat}
              disabled={acceptDOJ}
              onChange={(value) => _handleSelect(value, candidateField[2].title)}
              value={dateOfJoining ? moment(dateOfJoining) : undefined}
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
      </div>
    );
  }
}

export default FilledByCandidate;
