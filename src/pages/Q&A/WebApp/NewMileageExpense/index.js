import React, { PureComponent } from 'react';
import { Row, Col, BackTop } from 'antd';
import s from './index.less';
import ZoomImage from '@/components/ZoomImage';

class NewMileageExpense extends PureComponent {
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
              From My Expenses, the user can click on “ADD NEW EXPENSE” button
            </p>
            <img
              onClick={() => this.showModal('/assets/images/004.png')}
              className={s.img}
              src="/assets/images/004.png"
              alt="new mileage expense"
            />
            <p className={s.textContent}>
              Choosing tab “Mileage”, the mileage form will appear with required fields:
            </p>
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
              onClick={() => this.showModal('/assets/images/013.png')}
              className={s.img}
              src="/assets/images/013.png"
              alt="new mileage expense"
            />
            <ZoomImage handleCancel={this._handleCancel} visible={visible} src={src} />
          </div>
        </Col>
      </Row>
    );
  }
}

export default NewMileageExpense;
