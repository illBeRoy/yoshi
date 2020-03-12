import React, { Suspense } from 'react';
import { IHostProps } from '@wix/native-components-infra/dist/src/types/types';
import { IWixStatic } from '@wix/native-components-infra/dist/es/src/types/wix-sdk';
import { createInstances } from './createInstances';
import { ControllerProvider } from './react/ControllerProvider';
import { PublicDataProviderEditor } from './react/PublicDataProviderEditor';
import { PublicDataProviderViewer } from './react/PublicDataProviderViewer';
import { ErrorBoundary } from './react/ErrorBoundary';
import { IControllerContext } from './react/ControllerContext';

declare global {
  interface Window {
    Wix: IWixStatic;
    __STATICS_BASE_URL__: string;
  }
}
// TODO - improve this type or bring from controller wrapper
interface IFrameworkProps {
  __publicData__: any;
  experiments: any;
  cssBaseUrl?: string;
}

const PublicDataProvider: typeof React.Component =
  typeof window.Wix === 'undefined'
    ? PublicDataProviderViewer
    : PublicDataProviderEditor;

const WidgetWrapper = (UserComponent: typeof React.Component, name: string) => (
  props: IHostProps & IFrameworkProps & IControllerContext,
) => {
  const { cssBaseUrl = window.__STATICS_BASE_URL__ } = props;

  return (
    <div>
      <link
        href={`${cssBaseUrl}${name}ViewerWidget.css`}
        rel="stylesheet"
        type="text/css"
      />

      <ErrorBoundary handleException={error => console.log(error)}>
        <Suspense fallback={<div>Loading...</div>}>
          <PublicDataProvider data={props.__publicData__} Wix={window.Wix}>
            <ControllerProvider data={props}>
              <UserComponent
                {...createInstances({ experiments: props.experiments })}
                {...props}
              />
            </ControllerProvider>
          </PublicDataProvider>
        </Suspense>
      </ErrorBoundary>
    </div>
  );
};

export default WidgetWrapper;
