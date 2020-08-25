import React, { PureComponent, Fragment } from 'react';
import { Row, Col, Divider, Button, Card, Form } from 'antd';
import { connect } from 'dva';
import { FormattedMessage } from 'umi-plugin-react/locale';
import ImagesUpload from './components/ImagesUpload';
import styles from './index.less';

@Form.create()
@connect(({ setting: { item }, loading }) => ({
  item,
  fetching: loading.effects['setting/fetch'],
  saving: loading.effects['setting/save'],
}))
class Appearance extends PureComponent {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'setting/fetch' });
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({ type: 'setting/save', payload: { item: false } });
  }

  handleSubmit = event => {
    event.preventDefault();
    const { dispatch, form } = this.props;
    // temporarily hide navLogo, mainLogo, favicon
    const { item } = this.props;
    const { appearance: { logo = '', navLogo = '', favicon = '' } = {} } = item || {};
    // ---
    form.validateFieldsAndScroll((err, values) => {
      if (err) return;
      dispatch({
        type: 'setting/update',
        payload: {
          method: 'setting',
          id: 'expense-app',
          appearance: {
            ...values,
            // ---
            logo,
            navLogo,
            favicon,
            // ---
          },
        },
      });
    });
  };

  render() {
    const {
      form: { getFieldDecorator },
      item,
      fetching,
      saving,
    } = this.props;
    const { appearance: { logo = '', docLogo = '', navLogo = '', favicon = '' } = {} } = item || {};
    return (
      <Form className={styles.content} onSubmit={this.handleSubmit}>
        <Card
          loading={fetching}
          extra={
            <Button loading={saving} type="primary" htmlType="submit">
              <FormattedMessage id="setting.submit.button" defaultMessage="Save" />
            </Button>
          }
        >
          {item && (
            <Fragment>
              {false && (
                <Row gutter={16}>
                  <Col xs={6} lg={4}>
                    <strong className={styles.title}>
                      <FormattedMessage id="setting.logo" defaultMessage="Main Logo" />
                    </strong>
                  </Col>
                  <Col xs={18} lg={20}>
                    <Form.Item>
                      {getFieldDecorator('logo', {
                        initialValue: logo,
                      })(<ImagesUpload type="logo" />)}
                    </Form.Item>
                  </Col>
                </Row>
                // <Divider />
              )}
              {false && (
                <Row gutter={16}>
                  <Col xs={6} lg={4}>
                    <strong className={styles.title}>
                      <FormattedMessage id="setting.nav.logo" defaultMessage="Navigation logo" />
                    </strong>
                  </Col>
                  <Col xs={18} lg={20}>
                    <Form.Item>
                      {getFieldDecorator('navLogo', {
                        initialValue: navLogo,
                      })(<ImagesUpload type="navLogo" />)}
                    </Form.Item>
                  </Col>
                </Row>
                // <Divider />
              )}
              <Row gutter={16}>
                <Col xs={6} lg={4}>
                  <strong className={styles.title}>
                    <FormattedMessage id="setting.pdf.logo" defaultMessage="PDF logo" />
                  </strong>
                </Col>
                <Col xs={18} lg={20}>
                  <Form.Item>
                    {getFieldDecorator('docLogo', {
                      initialValue: docLogo,
                    })(<ImagesUpload type="docLogo" />)}
                  </Form.Item>
                </Col>
              </Row>
              <Divider />
              {false && (
                <Row gutter={16}>
                  <Col xs={6} lg={4}>
                    <strong className={styles.title}>
                      <FormattedMessage id="setting.favicon" defaultMessage="Favicon" />
                    </strong>
                  </Col>
                  <Col xs={18} lg={20}>
                    <Form.Item>
                      {getFieldDecorator('favicon', {
                        initialValue: favicon,
                      })(<ImagesUpload type="favicon" />)}
                    </Form.Item>
                  </Col>
                </Row>
              )}
            </Fragment>
          )}
        </Card>
      </Form>
    );
  }
}

export default Appearance;
