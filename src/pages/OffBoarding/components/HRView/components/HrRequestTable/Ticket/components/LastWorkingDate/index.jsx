import { Col, DatePicker, Row } from 'antd';
import moment from 'moment';
import React, { PureComponent } from 'react';
import styles from './index.less';

const dateFormat = 'MM.DD.YY';

export default class LastWorkingDate extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      lastDate: '',
      isEdit: true,
    };
  }

  componentDidMount() {
    const { myRequest: { lastWorkingDate = '' } = {} } = this.props;
    this.setState({ lastDate: lastWorkingDate });
  }

  changeDate = (_, lastDate) => {
    this.setState({
      lastDate,
    });
  };

  render() {
    const { lastDate = '', isEdit } = this.state;
    const { children } = this.props;
    const { myRequest: { requestLastDate = '', statusLastDay = '' } = {} } = this.props;

    const dateValue =
      requestLastDate && statusLastDay === 'ACCEPTED'
        ? moment(requestLastDate).locale('en').format('MM.DD.YY')
        : moment(lastDate).locale('en').format('MM.DD.YY');
    return (
      <>
        <Row className={styles.viewChangeLastWorkingDay__viewDateApproved} gutter={[50, 0]}>
          <Col span={12}>
            <DatePicker
              value={dateValue ? moment(dateValue) : null}
              format={dateFormat}
              className={styles.viewChangeLastWorkingDay__viewDateApproved__datePicker}
              onChange={this.changeDate}
              disabled={!isEdit}
            />
          </Col>
          {children && (
            <Col
              span={12}
              className={styles.viewChangeLastWorkingDay__viewDateApproved__description}
            >
              {children}
            </Col>
          )}
        </Row>
      </>
    );
  }
}
