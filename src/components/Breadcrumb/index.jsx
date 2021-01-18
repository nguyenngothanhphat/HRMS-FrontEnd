import React from 'react';
import { Breadcrumb } from 'antd';
import { Link } from 'umi';
import s from './index.less';

class BreadcrumbAccountSetup extends React.PureComponent {
  render() {
    const { routes = [] } = this.props;
    return (
      <div className={s.root}>
        {routes.length !== 0 && (
          <Breadcrumb separator={false}>
            {routes.map((item) => {
              const { name = '', path = '' } = item;
              return (
                <Breadcrumb.Item key={name}>
                  <Link to={path}>{name}</Link>
                </Breadcrumb.Item>
              );
            })}
          </Breadcrumb>
        )}
      </div>
    );
  }
}

export default BreadcrumbAccountSetup;
