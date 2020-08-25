import React, { PureComponent } from 'react';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';
import { Input, Icon, Modal, List, Form, Row, Col, Button } from 'antd';
import { connect } from 'dva';
import styles from './index.less';

@Form.create()
@connect(({ group: { listGroup }, loading }) => ({
  listGroup,
  loading: loading.models.group,
}))
class GroupInput extends PureComponent {
  static getDerivedStateFromProps(nextProps) {
    return nextProps.value || null;
  }

  constructor(props) {
    super(props);
    const { value = {} } = props;
    this.state = {
      ...value,
      visible: false,
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'group/fetchGroup' });
  }

  showModal = () => {
    this.setState({
      visible: true,
    });
    this.trigger();
  };

  handleCancel = () => {
    this.setState({
      visible: false,
    });
  };

  handleChooseGr = group => {
    this.setState({
      visible: false,
    });
    this.trigger(group);
  };

  handleSaveGroup = event => {
    event.preventDefault();
    const { dispatch, form, listGroup = [] } = this.props;

    form.validateFieldsAndScroll((err, { groupName }) => {
      if (err || !groupName) return;
      const list = groupName
        ? listGroup.filter(
            gr => gr.groupName && gr.groupName.toLowerCase().indexOf(groupName.toLowerCase()) > -1
          )
        : listGroup;
      if (list.length === 0)
        dispatch({
          type: 'group/createGroup',
          payload: {
            groupName,
          },
        }).then(this.trigger);
      this.handleCancel();
    });
  };

  searchOnChange = ({ target: { value = '' } }) => {
    this.setState({
      value,
    });
    const { listGroup } = this.props;
    const group = listGroup.find(
      gr => gr.groupName.toLowerCase().indexOf(value.toLowerCase()) > -1
    );
    this.trigger(group || { groupName: value });
  };

  trigger = value => {
    const { onChange } = this.props;
    if (typeof onChange === 'function') onChange(value);
  };

  render() {
    const {
      form: { getFieldDecorator },
      listGroup = [],
      loading,
      disabled,
    } = this.props;
    const { visible, groupName, value } = this.state;
    const list = value
      ? listGroup.filter(
          gr => gr.groupName && gr.groupName.toLowerCase().indexOf(groupName.toLowerCase()) > -1
        )
      : listGroup;
    const titleModal = (
      <span className={styles.titleModal}>
        <FormattedMessage id="common.add-tag" />
      </span>
    );
    const contentModal = (
      <Form layout="horizontal">
        <Form.Item>
          {getFieldDecorator('groupName', {
            initialValue: '',
            rules: [{ required: true, message: formatMessage({ id: 'common.required.tag-name' }) }],
          })(
            <Input
              onChange={this.searchOnChange}
              className={styles.txtSearch}
              placeholder={formatMessage({ id: 'common.enter-tag' })}
            />
          )}
        </Form.Item>
        <List
          loading={loading}
          header={
            <div className={styles.titleList}>
              <FormattedMessage id="common.recently" />
            </div>
          }
          dataSource={list}
          className={styles.contentList}
          renderItem={item => (
            <List.Item
              key={item._id}
              onClick={() => this.handleChooseGr(item)}
              style={{ cursor: 'pointer' }}
            >
              {item.groupName}
            </List.Item>
          )}
        />
      </Form>
    );
    const footerModal = (
      <Row style={{ borderTop: '1px solid #B7B7B7' }}>
        <Col span={12}>
          <Button onClick={this.handleSaveGroup} className={`${styles.btnFooter} ${styles.save}`}>
            <FormattedMessage id="common.save" />
          </Button>
        </Col>
        <Col span={12}>
          <Button onClick={this.handleCancel} className={styles.btnFooter}>
            <FormattedMessage id="common.cancel" />
          </Button>
        </Col>
      </Row>
    );
    return (
      <div>
        <Modal
          title={titleModal}
          className={styles.modalGr}
          visible={visible}
          width={440}
          onCancel={this.handleCancel}
          footer={footerModal}
        >
          {contentModal}
        </Modal>
        {disabled ? (
          <Input
            value={groupName || formatMessage({ id: 'common.non-tag' })}
            className={styles.input}
            readOnly
            disabled
            suffix={<Icon type="right" style={{ fontSize: 12, color: 'darkgray' }} />}
          />
        ) : (
          <div onClick={() => this.showModal()}>
            <Input
              value={groupName || formatMessage({ id: 'common.non-tag' })}
              className={styles.input}
              readOnly
              suffix={<Icon type="right" style={{ fontSize: 12, color: 'darkgray' }} />}
            />
          </div>
        )}
      </div>
    );
  }
}

export default GroupInput;
