export const getLinkedInUrl = (text) => {
  if (!text.includes('www') && !text.includes('http')) {
    return `https://www.linkedin.com/in/${text}`;
  }
  const expression = /(https?:\/\/(?:www\.|(?!www))[^\s.]+\.[^\s]{2,}|www\.[^\s]+\.[^\s]{2,})/gi;
  let url = text.match(expression) || [];
  if (url.length > 0) {
    if (!/^https?:\/\//i.test(url)) {
      url = `https://${url}`;
      return url;
    }
    return url[0];
  }
  return null;
};

export const test = '';
