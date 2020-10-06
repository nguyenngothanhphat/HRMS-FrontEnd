import React, { Component } from 'react';
import { PageContainer } from '@/layouts/layout/src';

export default class Setting extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <PageContainer>
        <div style={{ padding: '25px' }}>Setting Page</div>
      </PageContainer>
    );
  }
}
