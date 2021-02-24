import React, { PureComponent } from 'react';
import { Menu, Dropdown } from 'antd';
import { formatMessage, connect, Link } from 'umi';
import menuIcon from './assets/menuIcon.svg';
import deleteIcon from './assets/deleteIcon.svg';
import downloadIcon from './assets/downloadIcon.svg';
import lectusTinciduntEros from './assets/lectusTinciduntEros.png';

import styles from './index.less';

@connect(
  ({
    employeeSetting: { defaultTemplateListOnboarding = [], customTemplateListOnboarding = [] },
  }) => ({
    defaultTemplateListOnboarding,
    customTemplateListOnboarding,
  }),
)
class Template extends PureComponent {
  onRemoveTemplate = async (id) => {
    const { dispatch } = this.props;
    const statusCode = await dispatch({
      type: 'employeeSetting/removeTemplateById',
      payload: {
        id,
      },
    });
    if (statusCode === 200) {
      dispatch({
        type: 'employeeSetting/fetchDefaultTemplateListOnboarding',
      });
      dispatch({
        type: 'employeeSetting/fetchCustomTemplateListOnboarding',
      });
    }
  };

  _renderMenu = () => {
    const { template } = this.props;
    const id = template._id;
    return (
      <Menu>
        <Menu.Item>
          <a
            className={styles.menuItem}
            rel="noopener noreferrer"
            target="_blank"
            href={template.attachment.url}
          >
            <img src={downloadIcon} alt="menu" />{' '}
            {formatMessage({ id: 'component.documentAndTemplates.download' })}
          </a>
        </Menu.Item>
        <Menu.Item onClick={() => this.onRemoveTemplate(id)}>
          <span className={styles.menuItem}>
            <img src={deleteIcon} alt="menu" />{' '}
            {formatMessage({ id: 'component.documentAndTemplates.delete' })}
          </span>
        </Menu.Item>
      </Menu>
    );
  };

  render() {
    const { template } = this.props;
    return (
      <div className={styles.Template}>
        <Link to={`/template-details/${template._id}`}>
          {template.thumbnail === '' ? (
            <img className={styles.thumbnail} src={lectusTinciduntEros} alt="thumbnails" />
          ) : (
            <img className={styles.thumbnail} src={template.thumbnail} alt="thumbnails" />
          )}
        </Link>
        <div className={styles.template_info}>
          <Link to={`/template-details/${template._id}`}>
            <p>{template.title}</p>
          </Link>
          <Dropdown
            className={styles.icon}
            trigger={['click']}
            overlay={this._renderMenu()}
            placement="topRight"
          >
            <img src={menuIcon} alt="menu" />
          </Dropdown>
        </div>
      </div>
    );
  }
}

export default Template;
