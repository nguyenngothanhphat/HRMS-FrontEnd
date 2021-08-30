import React, { PureComponent } from 'react';
import { Row, Col, DatePicker, Typography } from 'antd';
// import { formatMessage } from 'umi';
import moment from 'moment';
import InternalStyle from './CandidateFieldsComponent.less';

// const { Option } = Select;
class CandidateFieldsComponent extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isHidden: false,
      checkAuthor: false,
    };
  }

  componentDidMount() {
    const getAuthor = localStorage.getItem('antd-pro-authority');
    const check = getAuthor.includes('hr');
    if (check) {
      this.setState({ checkAuthor: true });
    }
  }

  handleClick = () => {
    this.setState((prevState) => ({
      isHidden: !prevState.isHidden,
    }));
  };

  render() {
    const {
      styles,
      candidateField,
      // candidatesNoticePeriod,
      prefferedDateOfJoining,
      _handleSelect,
    } = this.props;
    const { checkAuthor } = this.state;
    // const { isHidden, checkAuthor } = this.state;
    return (
      <div className={InternalStyle.CandidateFields}>
        <Row gutter={[24, 0]}>
          <Col xs={24} sm={24} md={12} lg={12} xl={12}>
            <Typography.Title level={5}>{candidateField[1].name}</Typography.Title>
            <DatePicker
              className={styles}
              placeholder=""
              picker="date"
              format="MM.DD.YY"
              disabled={!checkAuthor}
              onChange={(value) => _handleSelect(value, candidateField[1].title)}
              defaultValue={prefferedDateOfJoining ? moment(prefferedDateOfJoining) : ''}
            />
          </Col>
        </Row>
      </div>
    );
  }
}

export default CandidateFieldsComponent;
