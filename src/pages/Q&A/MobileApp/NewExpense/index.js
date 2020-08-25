import React, { PureComponent } from 'react';
import { Row, Col, BackTop } from 'antd';
import s from './index.less';
import ZoomImage from '@/components/ZoomImage';

class NewExpense extends PureComponent {
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
            <p className={s.textContent}>Choosing “ADD EXPENSE” (Input details manually)</p>
            <img
              onClick={() => this.showModal('/assets/images/040.png')}
              className={s.img}
              src="/assets/images/040.png"
              alt="expense"
            />
            <p className={s.textContent}>
              The expense form will appear with required fields for inputting expense data
            </p>
            <img
              onClick={() => this.showModal('/assets/images/041.png')}
              className={s.img}
              src="/assets/images/041.png"
              alt="expense"
            />
            <p className={s.textLv1}>
              <span className={s.strong}>&bull; Amount</span>: is expense amount number.
            </p>
            <p className={s.textLv1}>
              <span className={s.strong}>&bull; Currency (on left side of the Amount)</span> : is
              the default currency of the office that the user is from. For example:
            </p>
            <p className={s.textLv2}>
              + If the user is from US office (location), the default currency would be USD ($).
            </p>
            <p className={s.textLv2}>
              + If the user taps to choose a non-default currency, the exchange rate will be
              displayed beside the original amount and exchanged amount. (see the example photo
              below)
            </p>
            <img
              onClick={() => this.showModal('/assets/images/042.png')}
              className={s.img}
              src="/assets/images/042.png"
              alt="expense"
            />
            <p className={s.textLv1}>
              <span className={s.strong}>&bull; Project</span>: the field is to specify which
              project that the expense belongs to and whether the expense is billable to the project
              or not.
            </p>
            <img
              onClick={() => this.showModal('/assets/images/043.png')}
              className={s.img}
              src="/assets/images/043.png"
              alt="expense"
            />
            <p className={s.textLv1}>
              <span className={s.strong}>&bull; Type</span>: is expense type or expense category;
            </p>
            <p className={s.textLv2}>
              + Supporting expense sub type, for example: “Food / Business Coffee” is a sub-type of
              Food
            </p>
            <img
              onClick={() => this.showModal('/assets/images/044.png')}
              className={s.img}
              src="/assets/images/044.png"
              alt="expense"
            />
            <p className={s.textLv2}>
              + 3 latest used expense type will be kept in “Recently” used section
            </p>
            <img
              onClick={() => this.showModal('/assets/images/045.png')}
              className={s.img}
              src="/assets/images/045.png"
              alt="expense"
            />
            <p className={s.textLv2}>
              + Basing on each company (location) configuration, there are some special expense
              types that when the user selects it, some additional fields will appear on the form
              and require some more input data.
            </p>
            <img
              onClick={() => this.showModal('/assets/images/046.png')}
              className={s.img}
              src="/assets/images/046.png"
              alt="expense"
            />
            <p className={s.textLv1}>
              <span className={s.strong}>&bull; Tag</span>: the user can use tag to group expenses
              by his own purpose; it’s could helpful for expense searching &amp; classification.
            </p>
            <img
              onClick={() => this.showModal('/assets/images/047.png')}
              className={s.img}
              src="/assets/images/047.png"
              alt="expense"
            />
            <p className={s.textLv1}>
              <span className={s.strong}>&bull; Payment Option</span>: specifying the payment method
              used to complete the expense
            </p>
            <p className={s.textLv2}>
              + <span className={s.strong}>Cash</span>: the user used his personal cash to pay for
              the expense, the expense will be marked as “Reimburseable” by default.
            </p>
            <p className={s.textLv2}>
              + <span className={s.strong}>Credit Card</span>: the user used his personal credit
              card to pay for the expense, the expense will be marked as “Reimburseable” by default.
            </p>
            <p className={s.textLv2}>
              + <span className={s.strong}>Company Cash</span>: can be called as “Cash In-Advance”,
              the user used the cash that provided by Company, the expense will be non-reimbursable.
            </p>
            <p className={s.textLv2}>
              + <span className={s.strong}>Company CC (Credit Card)</span>: the user paid for the
              expense by using assigned company card, by this option, the expense will be
              non-reimbursable.
            </p>
            <img
              onClick={() => this.showModal('/assets/images/048.png')}
              className={s.img}
              src="/assets/images/048.png"
              alt="expense"
            />
            <p className={s.textContent}>
              <span className={s.strong}>&bull; Add Receipt</span>: Tap to add receipt files.
              Support maximum 3 files (images or PDF).
            </p>
            <img
              onClick={() => this.showModal('/assets/images/049.png')}
              className={s.img}
              src="/assets/images/049.png"
              alt="expense"
            />
            <img
              onClick={() => this.showModal('/assets/images/050.png')}
              className={s.img}
              src="/assets/images/050.png"
              alt="expense"
            />
            <p className={s.textContent}>
              Support taking photo from camera, choosing image from Photo Gallery and Browsing file
              on devices.
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
              onClick={() => this.showModal('/assets/images/051.png')}
              className={s.img}
              src="/assets/images/051.png"
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

export default NewExpense;
