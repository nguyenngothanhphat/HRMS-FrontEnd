import React from 'react';
import { Row, Col } from 'antd';
import windowSize from 'react-window-size';
import { formatMessage } from 'umi-plugin-react/locale';
import styles from '../../index.less';

const EditableTab = props => {
  const {
    name,
    title,
    email,
    avatarUrl,
    company,
    currency,
    country,
    symbol,
    button,
    companyCode,
    listRate,
    windowWidth,
  } = props;
  const isHide = windowWidth < 905;
  const isLeftHide = windowWidth < 700;
  const drop = windowWidth < 650;
  const size = windowWidth <= 500;

  const Top = size ? '-40px' : undefined;

  return (
    <Row className={styles.myprofilechange}>
      <Col sx={drop ? 22 : false} md={8} sm={10} lg={3} style={{ minWidth: '180px' }}>
        <img className={styles.avatar} src={avatarUrl} alt="avatar" />
        <div className={styles.iconedit}>{button}</div>
      </Col>
      <Col md={8} sm={10} lg={6} className={styles.center}>
        <div className={styles.avatarprofle} style={{ wordWrap: 'break-word' }}>
          <div className={styles.name}>{name}</div>
          <div className={styles.contentTitle}>{title}</div>
          <p className={styles.email} style={{ wordWrap: 'break-word' }}>
            {email}
          </p>
        </div>
      </Col>

      {!isLeftHide ? (
        <Col span={1} className={styles.center}>
          <div style={{ borderLeft: '1px solid #EFF2FA', height: '75px' }} />
        </Col>
      ) : (
        false
      )}
      <Col xs={24} md={6} lg={6} className={styles.center} style={{ marginTop: Top }}>
        <div className={styles.centercss}>
          <div className={styles.wrapright}>
            <p style={{ wordWrap: 'break-word' }}>
              {company} {companyCode.length > 0 ? ` (${companyCode})` : ''} -
            </p>
            <p>{country}</p>
            <p className={styles.currency}>
              {currency}({symbol})
            </p>
          </div>
        </div>
      </Col>
      {!isHide ? (
        <Col span={1} className={styles.center}>
          <div style={{ borderLeft: '1px solid #EFF2FA', height: '75px' }} />
        </Col>
      ) : (
        false
      )}

      <Col xs={24} sm={7} lg={5} className={styles.center} style={{ marginTop: Top }}>
        <div className={styles.centercss}>
          <div className={styles.subtitle}>
            <div className={styles.subtitle}>{formatMessage({ id: 'profile.mileageTitle' })}</div>
            {listRate &&
              listRate.map(item => (
                <table>
                  <tr>
                    <td className={styles.mileage}>{item.name}</td>
                    <td>
                      {item.money} {item.currency}/{item.distanceUnit}
                    </td>
                  </tr>
                </table>
              ))}
          </div>
        </div>
      </Col>
    </Row>
  );
};
export default windowSize(EditableTab);
