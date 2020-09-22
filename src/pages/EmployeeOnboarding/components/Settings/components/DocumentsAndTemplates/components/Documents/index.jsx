import React, { PureComponent } from 'react';
import { Row, Col } from 'antd';

import consecteturMorbi from './assets/consecteturMorbi.png';
import fringillaPulvinar from './assets/fringillaPulvinar.png';
import lectusTinciduntEros from './assets/lectusTinciduntEros.png';
import lectusTinciduntEros2 from './assets/lectusTinciduntEros2.png';
import lectusTinciduntEros3 from './assets/lectusTinciduntEros3.png';
import recent1 from './assets/recent1.png';
import recent2 from './assets/recent2.png';
import recent3 from './assets/recent3.png';
import menuIcon from './assets/menuIcon.svg';

import styles from './index.less';

class Documents extends PureComponent {
  _renderTemplates = () => {
    const templates = [
      {
        templateId: 1,
        templateThumbnail: { consecteturMorbi },
        templateName: 'Consectetur morbi ',
      },
      {
        templateId: 2,
        templateThumbnail: { fringillaPulvinar },
        templateName: 'Fringilla pulvinar ',
      },
      {
        templateId: 3,
        templateThumbnail: { lectusTinciduntEros },
        templateName: 'Lectus tincidunt eros ',
      },
      {
        templateId: 4,
        templateThumbnail: { lectusTinciduntEros2 },
        templateName: 'Lectus tincidunt eros ',
      },
      {
        templateId: 5,
        templateThumbnail: { lectusTinciduntEros3 },
        templateName: 'Lectus tincidunt eros ',
      },
      {
        templateId: 6,
        templateThumbnail: { lectusTinciduntEros3 },
        templateName: 'Lectus tincidunt eros ',
      },
      {
        templateId: 7,
        templateThumbnail: { lectusTinciduntEros3 },
        templateName: 'Lectus tincidunt eros ',
      },
    ];
    return templates.map((template) => {
      return (
        <Col span={4} className={template}>
          <img src={Object.values(template.templateThumbnail)} alt="thumbnails" />
          <div className={styles.template_info}>
            <p>{template.templateName}</p>
            <img src={menuIcon} alt="menu" />
          </div>
        </Col>
      );
    });
  };

  render() {
    return (
      <div className={styles.Documents}>
        <p className={styles.Documents_title}>System default templates</p>
        <Row gutter={[4, 12]}>{this._renderTemplates()}</Row>
        <p className={styles.Documents_title}>System default templates</p>
        <Row gutter={[4, 12]}>{this._renderTemplates()}</Row>
      </div>
    );
  }
}

export default Documents;
