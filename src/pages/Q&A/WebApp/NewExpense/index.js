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
            <p className={s.textContent}>There are 2 way to access “Add New Expense” feature:</p>
            <p className={s.textLv1}>1. From Dashboard, the user can click on “ADD NEW” button</p>
            <img
              onClick={() => this.showModal('/assets/images/003.png')}
              className={s.img}
              src="/assets/images/003.png"
              alt="new expense"
            />
            <p className={s.textLv1}>
              2. Or, From My Expenses, the user can click on “ADD NEW EXPENSE” button
            </p>
            <img
              onClick={() => this.showModal('/assets/images/004.png')}
              className={s.img}
              src="/assets/images/004.png"
              alt="new expense"
            />
            <p className={s.textContent}>
              The expense form will appear with required fields for inputting expense data
            </p>
            <img
              onClick={() => this.showModal('/assets/images/011.png')}
              className={s.img}
              src="/assets/images/011.png"
              alt="new expense"
            />
            <p className={s.textLv1}>
              <span className={s.strong}>&bull; Amount</span>: is expense amount number.
            </p>
            <p className={s.textLv1}>
              <span className={s.strong}>&bull; Currency</span>: is the default currency of the
              office that the user is from. For example:
            </p>
            <p className={s.textLv2}>
              + If the user is from US office (location), the default currency would be USD ($).
            </p>
            <p className={s.textLv2}>
              + If the user tries to choose non-default currency, the exchange rate will be
              displayed together with original amount and exchanged amount. (see the example photo
              below)
            </p>
            <img
              onClick={() => this.showModal('/assets/images/005.png')}
              className={s.img}
              src="/assets/images/005.png"
              alt="new expense"
            />
            <p className={s.textLv1}>
              <span className={s.strong}>&bull; Project</span>: the field is to specify which
              project that the expense belongs to and whether the expense is billable to the project
              or not.
            </p>
            <img
              onClick={() => this.showModal('/assets/images/006.png')}
              className={s.img}
              src="/assets/images/006.png"
              alt="new expense"
            />
            <p className={s.textLv1}>
              <span className={s.strong}>&bull; Type</span>: is expense type or expense category;
            </p>
            <p className={s.textLv2}>
              + Supporting expense sub type, for example: “Food / Business Lunch” is sub-type of
              Food
            </p>
            <img
              onClick={() => this.showModal('/assets/images/007.png')}
              className={s.img}
              src="/assets/images/007.png"
              alt="new expense"
            />
            <p className={s.textLv2}>
              + 3 latest used expense type will be kept in “Recently” used section
            </p>
            <img
              onClick={() => this.showModal('/assets/images/008.png')}
              className={s.img}
              src="/assets/images/008.png"
              alt="new expense"
            />
            <p className={s.textLv2}>
              + Basing on each company (location) configuration, there are some special expense
              types that when the user selects it, some additional fields will appear on the form
              and require some more input data.
            </p>
            <img
              onClick={() => this.showModal('/assets/images/014.png')}
              className={s.img}
              src="/assets/images/014.png"
              alt="new expense"
            />
            <p className={s.textLv1}>
              <span className={s.strong}>&bull; Tag</span>: the user can use tag to group expenses
              by his own purpose; it’s could helpful for expense searching and classification.
            </p>
            <img
              onClick={() => this.showModal('/assets/images/009.png')}
              className={s.img}
              src="/assets/images/009.png"
              alt="new expense"
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
              + <span className={s.strong}>Company CC (Credit Card)</span>: the user paied for the
              expense by using assigned company card, by this option, the expense will be
              non-reimbursable.
            </p>
            <img
              onClick={() => this.showModal('/assets/images/015.png')}
              className={s.img}
              src="/assets/images/015.png"
              alt="new expense"
            />
            <p className={s.textLv1}>
              <span className={s.strong}>&bull; Receipt Photo</span>: Drag and drop receipt files or
              browse files from your computer to upload. Support maximum 3 files (Images or PDF
              files only).
            </p>
            <img
              onClick={() => this.showModal('/assets/images/012.png')}
              className={s.img}
              src="/assets/images/012.png"
              alt="new expense"
            />
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
            <ZoomImage handleCancel={this._handleCancel} visible={visible} src={src} />
          </div>
        </Col>
      </Row>
    );
  }
}

export default NewExpense;
