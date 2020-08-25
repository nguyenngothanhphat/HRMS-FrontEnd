import React, { Component } from 'react';
import { formatMessage, FormattedMessage } from 'umi-plugin-react/locale';
import { Modal, Button, Card } from 'antd';
import { connect } from 'dva';

@connect(({ loading, locations: { item } }) => ({
  item,
  removing: loading.effects['locations/remove'],
  fetching: loading.effects['locations/fetchItem'],
}))
class Advanced extends Component {
  showConfirm = id => {
    const { dispatch } = this.props;

    Modal.confirm({
      title: formatMessage({
        id: 'location.remove.confirm',
        defaultMessage: 'Removed locations cannot restored. Do you want to remove this location?',
      }),
      onOk() {
        dispatch({ type: 'locations/remove', payload: id });
      },
    });
  };

  render() {
    const { removing, item, fetching } = this.props;
    const { _id } = item || {};
    return (
      <Card
        loading={fetching}
        title={formatMessage({ id: 'location.remove', defaultMessage: 'Remove location' })}
      >
        <p>
          <FormattedMessage
            id="location.remove.description"
            defaultMessage="If the location isn't had users, you can remove it."
          />
        </p>
        <Button
          loading={removing}
          onClick={e => {
            e.preventDefault();
            this.showConfirm(_id);
          }}
        >
          <FormattedMessage id="location.remove" defaultMessage="Remove location" />
        </Button>
      </Card>
    );
  }
}

export default Advanced;
