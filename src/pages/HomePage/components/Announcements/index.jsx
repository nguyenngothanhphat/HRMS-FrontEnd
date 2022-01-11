import React from 'react';
import { Col, Row } from 'antd';
import EmployeeTag from './components/EmployeeTag';
import PostContent from './components/PostContent';
import styles from './index.less';
import Post1 from '@/assets/homePage/post1.png';
import Post2 from '@/assets/homePage/post2.png';

const posts = [
  {
    id: 1,
    employee: {
      generalInfo: {
        legalName: 'Leslie Alexander',
      },
      title: {
        name: 'Head of Design',
      },
    },
    content: (
      <p>
        We&apos;re #hiring at Lollypop Design Studio <br />
        If you&apos;ve got 5+ years of delivering awesome user experiences and have what it takes to
        work with a 24x7 motivated and passionate team - we&apos;re looking for you!
      </p>
    ),
    type: 1, // 1: link, 2: image
    link: 'https://google.com',
  },
  {
    id: 2,
    employee: {
      generalInfo: {
        legalName: 'Ronald Richards',
      },
      title: {
        name: 'Head of Design',
      },
    },
    content: (
      <p>
        Lollypop Design studio is now a Global Leader! 🌍 <br />
        We are super proud to announce that we&apos;ve been......
      </p>
    ),
    type: 2, // 1: link, 2: image
    image: Post2,
  },
  {
    id: 3,
    employee: {
      generalInfo: {
        legalName: 'Bessie Cooper',
      },
      title: {
        name: 'Head of Design',
      },
    },
    content: (
      <p>
        Calling all the talented designers to meet our team in Hyderabad!
        <br />
        Let&apos;s meet & discuss design, career, portfolio & biryani! <br />
        Don&apos;t miss this opportunity! <br />
        Register here : <a href="https://lnkd.in/dts9jM6X">https://lnkd.in/dts9jM6X</a>
      </p>
    ),
    type: 2, // 1: link, 2: image
    image: Post1,
  },
];

const Announcements = () => {
  return (
    <div className={styles.Announcements}>
      <p className={styles.title}>Announcements</p>
      <Row gutter={[24, 24]}>
        {posts.map((x) => (
          <Col span={24}>
            <div className={styles.card}>
              <EmployeeTag employee={x.employee} />
              <PostContent post={x} />
            </div>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default Announcements;
