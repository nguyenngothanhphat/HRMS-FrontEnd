import React, { PureComponent } from 'react';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';
import { connect } from 'dva';
import moment from 'moment';
import { Row, Col, Input, Button, Drawer, Select, Skeleton } from 'antd';
import ListProject from './components/ListProject';
import ProjectBox from './components/ProjectBox';
import styles from './index.less';

const { Search } = Input;
const { Option } = Select;

@connect(({ loading, project, locations }) => ({
  loading: loading.effects['project/saveProject'],
  listProject: project.listProject,
  listLocation: locations.list,
  defaultLocation: locations.defaultLocation,
}))
class Project extends PureComponent {
  state = { visible: false, action: 'add', projectItem: '', location: 0 };

  componentDidMount() {
    const { dispatch, defaultLocation } = this.props;
    this.setState({ location: defaultLocation });
    dispatch({ type: 'locations/fetch', payload: { status: 'ACTIVE' }, defaultLocation });
    dispatch({ type: 'project/fetch' });
  }

  static getDerivedStateFromProps(props, state) {
    if (props.defaultLocation !== state.location) {
      return {
        location: props.defaultLocation,
      };
    }
    return null;
  }

  componentDidUpdate(_preProps, { q: prevQ, date: prevDate = {} }) {
    const { date = {}, q } = this.state;
    const { dispatch } = this.props;
    if (prevQ !== q || JSON.stringify(date) !== JSON.stringify(prevDate)) {
      dispatch({ type: 'project/fetch', payload: { q, date } });
    }
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({ type: 'project/save', payload: { listProject: [], item: {} } });
  }

  showDrawer = () => {
    this.setState({
      visible: true,
      action: 'add',
    });
  };

  onClose = () => {
    this.setState({
      visible: false,
      projectItem: '',
      action: '',
    });
  };

  onClickItem = item => {
    this.setState({ visible: true, action: 'update', projectItem: item });
  };

  render() {
    const { listProject, listLocation, defaultLocation } = this.props;
    const { visible, action, projectItem, location, q } = this.state;

    const titleAdd = (
      <div className={styles.titleAdd}>
        {action === 'update'
          ? formatMessage({ id: 'customer.project.title.edit-project' })
          : formatMessage({ id: 'customer.project.title.add-new-project' })}
      </div>
    );

    const customListProject = listProject
      ? listProject.filter(item => item.location._id === location)
      : [];

    return (
      <Skeleton loading={!defaultLocation}>
        <div className={styles.content}>
          <Row type="flex" align="middle" justify="space-between" style={{ paddingBottom: '30px' }}>
            <Col span={24} style={{ paddingBottom: '20px' }}>
              <span style={{ color: '#e67225', fontSize: '24px' }}>
                {formatMessage({ id: 'project.all-project' })} ({customListProject.length})
              </span>
            </Col>
            <Col span={8}>
              <Search
                placeholder={formatMessage({ id: 'common.search' })}
                allowClear
                onChange={e => this.setState({ q: e.target.value })}
                value={q}
              />
            </Col>
            <Col span={8}>
              <Select
                style={{ width: '50%' }}
                value={location}
                defaultValue={location}
                onChange={value => {
                  this.setState({ q: '' });
                  const { dispatch } = this.props;
                  dispatch({ type: 'locations/changeSelectedLocation', payload: value });
                }}
              >
                {listLocation.map(item => (
                  <Option key={item._id} value={item._id}>
                    {item.name}
                  </Option>
                ))}
              </Select>
            </Col>
            <Col>
              <Button type="primary" icon="plus" onClick={() => this.showDrawer()}>
                <FormattedMessage id="project.add-project" />
              </Button>
            </Col>
          </Row>
          <ListProject
            list={customListProject.sort((a, b) => moment(b.updatedAt) - moment(a.updatedAt))}
            onClickItem={i => this.onClickItem(i)}
          />
          <Drawer
            title={titleAdd}
            placement="right"
            onClose={this.onClose}
            visible={visible}
            width={600}
            bodyStyle={{ height: '100%' }}
            destroyOnClose
          >
            <ProjectBox
              onCancel={() => this.onClose()}
              projectItem={projectItem}
              action={action}
              location={location}
            />
          </Drawer>
        </div>
      </Skeleton>
    );
  }
}

export default Project;
