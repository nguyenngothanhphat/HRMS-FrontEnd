import React, { PureComponent } from 'react';
// import { Card, Row, Col } from 'antd';
// import { formatMessage } from 'umi';
import View from './components/View';
import styles from './index.less';

// @connect(({ companiesManagement: { editCompany: { isOpenEditDetail = false } } = {} }) => ({
//   isOpenEditDetail,
// }))
class WorkLocation extends PureComponent {
  render() {
    const locations = [
      {
        name: 'Japan Office',
        address: '2-45 Minamisendanishimachi, Naka, Hiroshima, Hiroshima',
        country: 'Japan',
        state: 'Japan',
        zipCode: '900000',
        isheadQuarter: true,
      },
      {
        name: 'HoChiMinh Office',
        address: '66 Le Thi Ho, Go Vap',
        country: 'Viet Nam',
        state: 'HoChiMinh',
        zipCode: '700000',
        isheadQuarter: false,
      },
    ];

    return (
      <>
        {locations.map((item, index) => {
          return (
            <div key={`${index + 1}`} className={styles.workLocation}>
              <div className={styles.viewBottom}>
                <View location={item} />
              </div>
            </div>
          );
        })}
      </>
    );
  }
}

export default WorkLocation;
