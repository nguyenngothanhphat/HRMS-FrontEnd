import React, { PureComponent, Fragment } from 'react';
import { Row, Col } from 'antd';
import { formatMessage } from 'umi';
import styles from '../../HeadquaterAddress/View/index.less';

class View extends PureComponent {
  render() {
    const { information } = this.props;
    const companyInformation = [
      {
        label: formatMessage({ id: 'pages_admin.companies.table.companyName' }),
        value: information.name,
      },
      {
        label: 'DBA',
        value: information.dba,
      },
      {
        label: 'EIN',
        value: information.ein,
      },
      {
        label: formatMessage({ id: 'pages_admin.company.employeeNumber' }),
        value: information.employeeNumber,
      },
      {
        label: 'Phone',
        value: information.phone,
      },
      {
        label: 'Contact Email',
        value: information.contactEmail,
      },
      {
        label: formatMessage({ id: 'pages_admin.company.website' }),
        value: information.website,
      },
    ];

    // const blank = '_blank';

    return (
      <div className={styles.view}>
        <Row gutter={[0, 16]} className={styles.root}>
          {companyInformation.map((item) => (
            <Fragment key={item.label}>
              <Col span={6} className={styles.textLabel}>
                {item.label}
              </Col>
              {item.label === 'Website' ? (
                <Col span={18} className={styles.textValue}>
                  <a className={styles.textValue__website}>{item.value}</a>
                </Col>
              ) : (
                <Col span={18} className={styles.textValue}>
                  {item.value}
                </Col>
              )}
            </Fragment>
          ))}
          {/* Custom Col Here */}
        </Row>
      </div>
    );
  }
}

export default View;
