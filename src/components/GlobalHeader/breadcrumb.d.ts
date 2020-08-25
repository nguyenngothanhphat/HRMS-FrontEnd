import * as React from 'react';
import GlobalHeader from './index';

export default class BreadcrumbView extends React.Component<GlobalHeader, any> {}

export function getBreadcrumb(breadcrumbNameMap: object, url: string): object;
