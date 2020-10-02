import React, { PureComponent } from 'react';
import { Row, Col, Select, DatePicker, Typography } from 'antd';
import { formatMessage } from 'umi';
import InternalStyle from './CandidateFieldsComponent.less';

const { Option } = Select;
class CandidateFieldsComponent extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isHidden: false,
    };
  }

  handleClick = () => {
    this.setState((prevState) => ({
      isHidden: !prevState.isHidden,
    }));
  };

  render() {
    const { styles, candidateField, _handleSelect = () => {}, jobDetail = {} } = this.props;
    const { isHidden } = this.state;
    const { candidatesNoticePeriod, prefferedDateOfJoining } = jobDetail;
    return (
      <div className={InternalStyle.CandidateFields}>
        <Typography.Title level={5} className={InternalStyle.title}>
          {formatMessage({ id: 'component.jobDetail.filledByCandidate' })}
        </Typography.Title>
        <Row gutter={[24, 0]}>
          <Col xs={24} sm={24} md={12} lg={12} xl={12}>
            <Typography.Title level={5}>{candidateField[0].name}</Typography.Title>
            <Select
              placeholder={candidateField[0].placeholder}
              className={styles}
              onChange={(value) => _handleSelect(value, candidateField[0].title)}
              defaultValue={candidatesNoticePeriod}
            >
              {candidateField[0].Option.map((data) => (
                <Option value={data.value}>
                  <Typography.Text className={InternalStyle.SelectedOption}>
                    {data.value}
                  </Typography.Text>
                </Option>
              ))}
            </Select>
          </Col>
        </Row>
        <Row gutter={[24, 0]}>
          <Col xs={24} sm={24} md={12} lg={12} xl={12}>
            <Typography.Title level={5}>{candidateField[1].name}</Typography.Title>
            <DatePicker
              className={styles}
              placeholder=""
              picker="date"
              format="MM/DD/YYYY"
              onChange={(value) => _handleSelect(value, candidateField[1].title)}
              defaultValue={prefferedDateOfJoining}
            />
          </Col>
          <Col xs={16} sm={16} md={14} lg={10} xl={10}>
            {!isHidden ? (
              <div className={InternalStyle.warning}>
                <button
                  type="button"
                  className={`ant-alert-close-icon ${InternalStyle.DismissButton}`}
                  tabIndex="0"
                  onClick={this.handleClick}
                >
                  <span role="img" aria-label="close" className="anticon anticon-close">
                    <svg
                      viewBox="64 64 896 896"
                      focusable="false"
                      className=""
                      data-icon="close"
                      width="7px"
                      height="7px"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path d="M563.8 512l262.5-312.9c4.4-5.2.7-13.1-6.1-13.1h-79.8c-4.7 0-9.2 2.1-12.3 5.7L511.6 449.8 295.1 191.7c-3-3.6-7.5-5.7-12.3-5.7H203c-6.8 0-10.5 7.9-6.1 13.1L459.4 512 196.9 824.9A7.95 7.95 0 00203 838h79.8c4.7 0 9.2-2.1 12.3-5.7l216.5-258.1 216.5 258.1c3 3.6 7.5 5.7 12.3 5.7h79.8c6.8 0 10.5-7.9 6.1-13.1L563.8 512z" />
                    </svg>
                  </span>
                </button>
                <div className={InternalStyle.contentWrapper}>
                  <svg
                    viewBox="64 64 896 896"
                    focusable="false"
                    className=""
                    data-icon="exclamation-circle"
                    width="14px"
                    height="14px"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm-32 232c0-4.4 3.6-8 8-8h48c4.4 0 8 3.6 8 8v272c0 4.4-3.6 8-8 8h-48c-4.4 0-8-3.6-8-8V296zm32 440a48.01 48.01 0 010-96 48.01 48.01 0 010 96z" />
                  </svg>
                  <Typography.Title className={InternalStyle.TitleText} level={5}>
                    {formatMessage({ id: 'component.reminder.title' })}
                  </Typography.Title>
                </div>
                <Typography.Text className={InternalStyle.ContentText}>
                  {formatMessage({ id: 'component.jobDetail.reminder.content' })}
                  <p className={InternalStyle.BoldText}>
                    {formatMessage({ id: 'component.jobDetail.reminder.content2' })}
                  </p>
                </Typography.Text>
              </div>
            ) : null}
          </Col>
        </Row>
      </div>
    );
  }
}

export default CandidateFieldsComponent;
