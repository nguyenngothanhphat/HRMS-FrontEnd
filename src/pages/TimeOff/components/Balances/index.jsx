import React, { PureComponent } from 'react';
import { Row, Col } from 'antd';
import Icon1 from '@/assets/balanceIcon1.svg';
import Icon2 from '@/assets/balanceIcon2.svg';
import Icon3 from '@/assets/balanceIcon3.svg';
import Icon4 from '@/assets/balanceIcon4.svg';

import BalanceInfoBox from './components/BalanceInfoBox';
import styles from './index.less';

class Balances extends PureComponent {
  render() {
    const boxTitle = [
      'Total hours of timeoff',
      'Timeoff scheduled this month',
      'Total hours taken this year',
      'Current PTO Liability',
    ];
    const boxValue = [150, 150, 150, 150];
    const icon = [Icon1, Icon2, Icon3, Icon4];
    return (
      <div className={styles.Balances}>
        <Row gutter={['20', '20']}>
          {boxTitle.map((box, index) => (
            <Col span={6}>
              <BalanceInfoBox title={box} value={boxValue[index]} icon={icon[index]} />
            </Col>
          ))}
        </Row>
      </div>
    );
  }
}

export default Balances;
