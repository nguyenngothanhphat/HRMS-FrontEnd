import React, { useState, useEffect } from 'react';
import Parser from 'html-react-parser';
import styles from './index.less';
import { POST_TYPE_TEXT } from '@/utils/homePage';
import EmployeeTag from '@/pages/HomePage/components/Announcements/components/EmployeeTag';
import PostContent from '@/pages/HomePage/components/Announcements/components/PostContent';
import PreviewImage from '@/assets/homePage/previewImage.png';
import Card from '@/pages/HomePage/components/Celebrating/components/Card';

const Preview = (props) => {
  const {
    mode = '',
    dataA: { uploadFilesA = [], descriptionA = '' } = {},
    dataB: { uploadFilesB = [], descriptionB = '' } = {},
  } = props;

  const [announcementContent, setAnnouncementContent] = useState({
    imageUrls: [],
  });
  const [birthdayContent, setBirthdayContent] = useState({
    imageUrls: [],
  });

  const getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  };

  useEffect(() => {
    if (uploadFilesA.length > 0) {
      uploadFilesA.forEach((x, i) => {
        getBase64(x, (imageUrl) => {
          const tempArr = i === 0 ? [] : [...announcementContent.imageUrls];
          setAnnouncementContent({ imageUrls: [...tempArr, imageUrl] });
        });
      });
    } else {
      setAnnouncementContent({
        imageUrls: [],
      });
    }
  }, [JSON.stringify(uploadFilesA)]);

  useEffect(() => {
    if (uploadFilesB.length > 0) {
      uploadFilesB.forEach((x, i) => {
        getBase64(x, (imageUrl) => {
          const tempArr = i === 0 ? [] : [...birthdayContent.imageUrls];
          setBirthdayContent({ imageUrls: [...tempArr, imageUrl] });
        });
      });
    } else {
      setBirthdayContent({
        imageUrls: [],
      });
    }
  }, [JSON.stringify(uploadFilesB)]);

  const renderPreview = () => {
    const post = {
      id: 1,
      employee: {
        generalInfo: {
          legalName: 'Ronald Richards.',
          // avatar: TerralogicIcon,
        },
        title: {
          name: 'Head of Design',
        },
      },
      content: (
        <p>
          {Parser(descriptionA) ||
            `We are extremely joyful to announce that we have won DNA Paris Design Awards 2021 & that
          marks a hat trick of us winning this award from 2019 to 2021! 🎊`}
        </p>
      ),
      type: 2, // 1: link, 2: image
      image:
        announcementContent.imageUrls.length > 0 ? announcementContent.imageUrls[0] : PreviewImage,
    };

    switch (mode) {
      case POST_TYPE_TEXT.ANNOUNCEMENT:
        return (
          <>
            <EmployeeTag employee={post.employee} />
            <PostContent post={post} />
          </>
        );
      case POST_TYPE_TEXT.BIRTHDAY_ANNIVERSARY:
        return (
          <div style={{ padding: '24px' }}>
            <Card
              previewing
              contentPreview={{
                previewImage:
                  birthdayContent.imageUrls.length > 0 ? birthdayContent.imageUrls[0] : '',
                previewDescription: Parser(descriptionB),
              }}
            />
          </div>
        );

      default:
        return '';
    }
  };

  return <div className={styles.Preview}>{renderPreview()}</div>;
};

export default Preview;
