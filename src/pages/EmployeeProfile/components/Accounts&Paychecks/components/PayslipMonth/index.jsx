import React, { PureComponent } from 'react';
import { connect } from 'umi';
import Payslips from './Payslip';
import ViewFile from './View';

@connect(({ employeeProfile: { paySlip = [] } }) => ({
  paySlip,
}))
class PaySlipMonth extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      url: '',
      isView: false,
    };
  }

  handleViewFile = (urlFile) => {
    this.setState({ isView: true, url: urlFile });
  };

  onBackClick = () => {
    this.setState({
      isView: false,
    });
  };

  render() {
    const { isView, url } = this.state;
    return (
      <>
        {isView ? (
          <ViewFile url={url} onBackClick={this.onBackClick} />
        ) : (
          <Payslips getViewFile={this.handleViewFile} />
        )}
      </>
    );
  }
}

export default PaySlipMonth;
