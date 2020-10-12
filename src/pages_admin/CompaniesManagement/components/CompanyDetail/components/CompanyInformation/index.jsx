import React, { PureComponent } from 'react';
// import { Card, Row, Col } from 'antd';
import { connect } from 'umi';
import Information from './components/Information';
import HeadquaterAddress from './components/HeadquaterAddress';
import LegalAddress from './components/LegalAddress';

@connect(() => ({}))
class CompanyInformation extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div>
        <Information />
        <HeadquaterAddress />
        <LegalAddress />
      </div>
    );
  }
}

export default CompanyInformation;
