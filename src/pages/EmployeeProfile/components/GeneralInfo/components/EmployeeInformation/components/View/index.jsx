import React, { PureComponent, Fragment } from 'react';
import { Row, Col, Tooltip } from 'antd';
import { connect } from 'umi';
import Icon from '@ant-design/icons';
import Moment from 'moment';
import ConformIcondata from '../../../confirmIcon';
import iconQuestTion from '../../../Icon/icon';
import styles from './index.less';

@connect(({ upload: { urlImage = '' } = {} }) => ({
  urlImage,
}))
class View extends PureComponent {
  render() {
    const { dataAPI, urlImage } = this.props;
    const splitUrl = urlImage.split('/');
    const dummyData = [
      { label: 'Legal Name', value: dataAPI.legalName },
      {
        label: 'Date of Birth',
        value: dataAPI.DOB ? Moment(dataAPI.DOB).locale('en').format('Do MMM YYYY') : '',
      },
      { label: 'Legal Gender', value: dataAPI.legalGender },
      { label: 'Employee ID', value: dataAPI.employeeId },
      { label: 'Work Email', value: dataAPI.workEmail },
      { label: 'Work Number', value: dataAPI.workNumber },
      { label: 'Adhaar Card Number', value: dataAPI.adhaarCardNumber },
      { label: 'UAN Number', value: dataAPI.uanNumber },
    ];
    const content = 'We require your gender for legal reasons.';
    return (
      <Row gutter={[0, 16]} className={styles.root}>
        {dummyData.map((item) => (
          <Fragment key={item.label}>
            <Col span={6} className={styles.textLabel}>
              {item.label}
              {item.label === 'Legal Gender' ? (
                <Tooltip
                  placement="top"
                  title={content}
                  overlayClassName={styles.GenEITooltip}
                  color="#568afa"
                >
                  <Icon component={iconQuestTion} className={styles.iconQuestTion} />
                </Tooltip>
              ) : (
                ''
              )}
            </Col>
            <Col span={18} className={styles.textValue}>
              {item.value}
              {item.label === 'Adhaar Card Number' && urlImage ? (
                <div className={styles.viewFileUpLoad}>
                  <a
                    href={urlImage}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.urlData}
                  >
                    {splitUrl[6]}
                  </a>
                  <ConformIcondata data={splitUrl[6]} />
                </div>
              ) : (
                ''
              )}
            </Col>
          </Fragment>
        ))}
        {/* Custom Col Here */}
      </Row>
    );
  }
}

export default View;
