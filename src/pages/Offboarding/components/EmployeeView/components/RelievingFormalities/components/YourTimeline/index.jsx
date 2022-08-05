import React, { PureComponent } from 'react';
import { Button, Row, Col } from 'antd';
import SideImage from '@/assets/teamVectorImage.svg';
import ViewTimelineModal from '../ViewTimelineModal';
import styles from './index.less';

export default class YourTimeline extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      showViewTimelineModal: false,
    };
  }

  onViewTimelineClick = (value) => {
    this.setState({
      showViewTimelineModal: value,
    });
  };

  render() {
    const {
      title = 'Your timeline with us',
      describe = (
        <p>
          Hey, Venkat Vamsi Krishna Ambula. Though this day will mark a loss for the company,
          however we would like that you move on for your future endeavors with a big and proud
          smile. We have captured your time with us into a timeline board.
        </p>
      ),
      buttonText = 'See timeline',
    } = this.props;

    const { showViewTimelineModal } = this.state;

    return (
      <div className={styles.YourTimeline}>
        <Row>
          <Col span={14} className={styles.leftContainer}>
            <div className={styles.abovePart}>
              <span className={styles.title}>{title}</span>
              <p className={styles.describe}>{describe}</p>
            </div>
            <Button onClick={() => this.onViewTimelineClick(true)}>{buttonText}</Button>
          </Col>
          <Col className={styles.sideContainer} span={10}>
            <div className={styles.sideImage}>
              <img src={SideImage} alt="side" />
            </div>
          </Col>
        </Row>
        <ViewTimelineModal
          visible={showViewTimelineModal}
          onClose={() => this.onViewTimelineClick(false)}
          submitText="OK"
        />
      </div>
    );
  }
}
