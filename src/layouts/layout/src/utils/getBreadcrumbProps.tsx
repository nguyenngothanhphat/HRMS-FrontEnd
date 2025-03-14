import H from 'history';
import { BreadcrumbProps as AntdBreadcrumbProps } from 'antd/lib/breadcrumb';
import React from 'react';
import pathToRegexp from 'path-to-regexp';
import { isBrowser } from '@ant-design/pro-utils';
import { Link } from 'umi';
import { ProSettings } from '../defaultSettings';
import { MenuDataItem, MessageDescriptor } from '../typings';
import { urlToList } from './pathTools';

export interface BreadcrumbProps {
  breadcrumbList?: { title: string; href: string }[];
  home?: string;
  location?:
    | H.Location
    | {
        pathname?: string;
      };
  menu?: ProSettings['menu'];
  breadcrumbMap?: Map<string, MenuDataItem>;
  formatMessage?: (message: MessageDescriptor) => string;
  breadcrumbLayoutRender?: (
    routers: AntdBreadcrumbProps['routes'],
  ) => AntdBreadcrumbProps['routes'];
  itemRender?: AntdBreadcrumbProps['itemRender'];
}

// 渲染Breadcrumb 子节点
// Render the Breadcrumb child node
const defaultItemRender: AntdBreadcrumbProps['itemRender'] = ({ breadcrumbName, path }) => {
  let name = '';
  switch (breadcrumbName) {
    case 'Ticket Id':
      name = `${breadcrumbName}: ${path.split('/').pop()}`;
      break;
    // case 'Review team member':
    //   name = `${breadcrumbName} [${path.split('/').pop()}]`;
    //   break;
    case 'Add a team member':
      name = `[${path.split('/').pop()}] ${breadcrumbName}`;
      break;
    default:
      name = breadcrumbName;
  }
  return <Link to={path}>{name}</Link>;
};

const renderItemLocal = (item: MenuDataItem, props: BreadcrumbProps): string => {
  const {
    formatMessage,
    menu = {
      locale: false,
    },
  } = props;
  if (item.locale && formatMessage && menu.locale !== false) {
    return formatMessage({ id: item.locale, defaultMessage: item.name });
  }
  return item.name as string;
};

export const getBreadcrumb = (
  breadcrumbMap: Map<string, MenuDataItem>,
  url: string,
): MenuDataItem => {
  if (!breadcrumbMap) {
    return {
      path: '',
    };
  }
  let breadcrumbItem = breadcrumbMap.get(url);
  if (!breadcrumbItem) {
    // Find the first matching path in the order defined by route config
    // 按照 route config 定义的顺序找到第一个匹配的路径
    const targetPath = [...breadcrumbMap.keys()].find((path) =>
      // remove ? ,不然会重复
      pathToRegexp(path.replace('?', '')).test(url),
    );

    if (targetPath) {
      breadcrumbItem = breadcrumbMap.get(targetPath);
    }
  }
  return breadcrumbItem || { path: '' };
};

export const getBreadcrumbFromProps = (
  props: BreadcrumbProps,
): {
  location: BreadcrumbProps['location'];
  breadcrumbMap: BreadcrumbProps['breadcrumbMap'];
} => {
  const { location, breadcrumbMap } = props;
  return {
    location,
    breadcrumbMap,
  };
};

// Generated according to props
const conversionFromProps = (props: BreadcrumbProps): AntdBreadcrumbProps['routes'] => {
  const { breadcrumbList = [] } = props;
  return breadcrumbList
    .map((item) => {
      const { title, href } = item;
      // For application that has configured router base
      // @ts-ignore
      const { routerBase = '/' } = isBrowser() ? window : {};
      const realPath = routerBase === '/' ? href : `${routerBase}${href}`;
      return {
        path: realPath,
        breadcrumbName: title,
      };
    })
    .filter((item) => item.path);
};

const conversionFromLocation = (
  routerLocation: BreadcrumbProps['location'] = { pathname: '/' },
  breadcrumbMap: Map<string, MenuDataItem>,
  props: BreadcrumbProps,
): AntdBreadcrumbProps['routes'] => {
  if (!routerLocation) {
    return [];
  }
  // Convertor the url to an array
  const pathSnippets = urlToList(routerLocation.pathname);
  // Loop data mosaic routing
  const extraBreadcrumbItems: AntdBreadcrumbProps['routes'] = pathSnippets
    .map((url) => {
      // For application that has configured router base
      // @ts-ignore
      const { routerBase = '/' } = isBrowser() ? window : {};
      const realPath = routerBase === '/' ? url : `${routerBase}${url}`;
      const currentBreadcrumb = getBreadcrumb(breadcrumbMap, url);
      if (currentBreadcrumb.inherited) {
        return { path: '', breadcrumbName: '' };
      }
      const name = renderItemLocal(currentBreadcrumb, props);
      const { hideInBreadcrumb } = currentBreadcrumb;
      return name && !hideInBreadcrumb
        ? {
            path: realPath,
            breadcrumbName: name,
            component: currentBreadcrumb.component,
          }
        : { path: '', breadcrumbName: '' };
    })
    .filter((item) => item && item.path);

  return extraBreadcrumbItems;
};

export type BreadcrumbListReturn = Pick<
  AntdBreadcrumbProps,
  Extract<keyof AntdBreadcrumbProps, 'routes' | 'itemRender' | 'separator'>
>;

/**
 * 将参数转化为面包屑
 * Convert parameters into breadcrumbs
 */
export const genBreadcrumbProps = (props: BreadcrumbProps): AntdBreadcrumbProps['routes'] => {
  const { breadcrumbList } = props;
  const { location, breadcrumbMap } = getBreadcrumbFromProps(props);
  if (breadcrumbList && breadcrumbList.length) {
    return conversionFromProps(props);
  }

  // 根据 location 生成 面包屑
  // Generate breadcrumbs based on location
  if (location && location.pathname && breadcrumbMap) {
    return conversionFromLocation(location, breadcrumbMap, props);
  }
  return [];
};

// use breadcrumbLayoutRender to change routes
export const getBreadcrumbProps = (props: BreadcrumbProps): BreadcrumbListReturn => {
  const { breadcrumbLayoutRender, itemRender: propsItemRender } = props;
  const routesArray = genBreadcrumbProps(props);
  const itemRender = propsItemRender || defaultItemRender;
  let routes = routesArray;
  if (breadcrumbLayoutRender) {
    routes = breadcrumbLayoutRender(routes) || [];
  }
  return {
    separator: '|',
    routes,
    itemRender,
  };
};
