import React, { PureComponent } from 'react';
import { Row, Col, BackTop } from 'antd';
import s from './index.less';
import ZoomImage from '@/components/ZoomImage';

class NewMileage extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      src: '',
    };
  }

  showModal = src => {
    this.setState({
      visible: true,
      src,
    });
  };

  _handleCancel = () => {
    this.setState({
      visible: false,
    });
  };

  render() {
    const { visible, src } = this.state;
    return (
      <Row className={s.containerView}>
        <Col span={24} className={s.contentView}>
          <div>
            <BackTop />
          </div>
          <div>
            <p className={s.textContent}>
              After login successfully to the app, the user can choose MY EXPENSES on left menu to
              access list of expenses screen.
            </p>
            <img
              onClick={() => this.showModal('/assets/images/038.png')}
              className={s.img}
              src="/assets/images/038.png"
              alt="expense"
            />
            <p className={s.textContent}>
              Tapping on “ADD NEW EXPENSE” Button, and a bottom popup will appear with some options.
            </p>
            <img
              onClick={() => this.showModal('/assets/images/039.png')}
              className={s.img}
              src="/assets/images/039.png"
              alt="expense"
            />
            <p className={s.textContent}>Choosing “Create Mileage” to add a new Mileage</p>
            <img
              onClick={() => this.showModal('/assets/images/052.png')}
              className={s.img}
              src="/assets/images/052.png"
              alt="expense"
            />
            <p className={s.textContent}>The mileage form will appear with required fields:</p>
            <p className={s.textLv1}>
              <span className={s.strong}>&bull; Type</span>: type of mileage, supporting 2 types:
              Bike &amp; Car
            </p>
            <p className={s.textLv1}>
              <span className={s.strong}>&bull; Rate / Km</span>: the average charge for each km
              distance
            </p>
            <p className={s.textLv1}>
              <span className={s.strong}>&bull; From &amp; To</span>: inputting departure address
              and destination address
            </p>
            <p className={s.textLv1}>
              <span className={s.strong}>&bull; Add Stop</span>: Support adding multiple stops
              between From &amp; To position
            </p>
            <p className={s.textLv1}>
              <span className={s.strong}>&bull; Distance &amp; Amount &amp; Google Map</span>: these
              fields will be automatically calculated basing on previous field values
            </p>
            <p className={s.textLv1}>
              <span className={s.strong}>&bull; Reimbursable</span>: to mark the expense is
              Reimbursable or non-reimbursable
            </p>
            <p className={s.textLv1}>
              <span className={s.strong}>&bull; “Save” or “Save And New”</span>: there are 2 options
              to complete “Adding a new expense”
            </p>
            <p className={s.textLv2}>
              + <span className={s.strong}>Save</span>: click and be navigated to My Expenses view,
              the new created expense will be displayed on top of expense list
            </p>
            <p className={s.textLv2}>
              + <span className={s.strong}>Save And New</span>: click to save current expense, then
              stay at the current view to add a next one.
            </p>
            <img
              onClick={() => this.showModal('/assets/images/053.png')}
              className={s.img}
              src="/assets/images/053.png"
              alt="expense"
            />

            <ZoomImage
              handleCancel={this._handleCancel}
              visible={visible}
              src={src}
              widthStyle="35%"
            />
          </div>
        </Col>
      </Row>
    );
  }
}

export default NewMileage;
