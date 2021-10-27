import React from 'react';
import { Typography } from 'antd';
import { Row, Col } from 'antd';
import styles from './index.less';
import Tickets from './components/Tickets'
const { Title } = Typography;


const OverView = () => {
    return (
        <div>
            <Row gutter={[25, 27]}>
                <Col span={8}>
                    <div className={styles.title}>
                        <h1>Hello HR Manager!</h1>
                        <p>You have 4 new tickets that needs your attention!</p>
                    </div>
                    <div>
                        <Tickets />
                    </div>
                </Col>
                <Col span={16}></Col>
            </Row>
            <Row gutter={[19, 27]}>
                <Col span={12}></Col>
                <Col span={12}></Col>
                <Col span={24}></Col>

            </Row>

        </div>
    )
}

export default OverView
