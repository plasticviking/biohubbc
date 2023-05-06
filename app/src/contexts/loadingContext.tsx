import useDataLoader from 'hooks/useDataLoader';
import useKeycloakWrapper from 'hooks/useKeycloakWrapper';
import React, { createContext, PropsWithChildren, ReactNode, useContext, useEffect } from 'react'

export type LOADING_CONTEXT_DEPENDENCIES =
  | 'KEYCLOAK'

export interface ILoadingContext {
  dependencies: Record<LOADING_CONTEXT_DEPENDENCIES, Promise<unknown>>;
  register: (name: string, loads: Promise<any>, dependsOn: string[]) => void
}

export type ILoadingContextProviderProps = PropsWithChildren<{

}>;

export interface ILoadingGuardDependency {
  key: LOADING_CONTEXT_DEPENDENCIES;
  value: Promise<any>
}

export type ILoadingGuardProps = PropsWithChildren<{
  hasLoaded: boolean;
  fallback?: ReactNode;
}>

export interface IHardLoadingGuardProps<T = void> {
  key: string;
  dependencies: string[];
}

export interface ISoftLoadingGuardProps {
  dependencies?: any
}

const LoadingContext = createContext<ILoadingContext>({
  dependencies: {
    KEYCLOAK: Promise.resolve()
  },
  register: () => {}
});

const assert = () => {

  const failedLoadGuard = true;

  if (failedLoadGuard) {
    return <SomeKindOfProvider></SomeKindOfProvider>
  }
}

/**
 * Renders an app-wide spinner that does not exit the dom until all the hard loading guards
 * beneath it have been resolved
 * @param props 
 */
export const LoadingContextProvider = (props: ILoadingContextProviderProps) => {


  // Render the loading spinner


  const loadingContext: ILoadingContext = {
    //
  }

  return <LoadingContext.Provider value={loadingContext}>{props.children}</LoadingContext.Provider>

}


export const LoadingGuard = (props: ILoadingGuardProps) => {
  const loadingContext = useContext(LoadingContext);

  useEffect(() => {

  }, []);

  if (props.hasLoaded) {
    return <>{props.children}</>;
  }

  if (props.fallback) {
    return <>{props.fallback}</>;
  }

  return <></>;
}

/**
 * Hard loading guards ensure that the top level provider renders the app-wide spinner
 * until all hard loading guards are finished. They're used when the app should not show
 * any interactable elements until all the given hard loading guard dependencies are
 * resolved. Hard loading guards will render their children as soon as their respective
 * dependencies are met.
 *
 * @param props 
 * @returns 
 */
export const HardLoadingGuard = (props: ILoadingGuardProps) => {
  

  return (
    <LoadingGuard depenencies={props.dependencies} hasLoaded={hasLoaded}>

    </LoadingGuard>
  )
}

/**
 * Soft loading guards will render a fallback component if they have not loaded, and will
 * render their children when their dependencies are met.
 * @param props 
 */
export const SoftLoadingGuard = (props: ILoadingGuardProps) => {

  return (
    <LoadingGuard depenencies={props.dependencies} hasLoaded={hasLoaded}>

    </LoadingGuard>
  )
}












const KeycloakTest = (props: any) => {
  const keycloak = useKeycloakWrapper();

  return (
    <HardLoadingGuard hasLoaded={keycloak.hasLoadedAllUserInfo}>
      {props.children}
    </HardLoadingGuard>
  )
}

const ProfileTest = (props: any) => {
  const keycloak = useKeycloakWrapper();
  const preferencesDataLoader = useDataLoader(() => Promise.resolve({ preferences: [] }));

  return (
    <div>
      <div>{keycloak.displayName}</div>
        <SoftLoadingGuard hasLoaded={preferencesDataLoader.isLoading}>
          {JSON.stringify(preferencesDataLoader.data)}
        </SoftLoadingGuard>
        {props.children}
    </div>
  )
}

const MapTest = (props: any) => {
  const mapDataLoader = useDataLoader(() => Promise.resolve({ mapDetails: {} }));

  return (
    <HardLoadingGuard hasLoaded={mapDataLoader.isLoading}>
      {JSON.stringify(mapDataLoader.data)}
    </HardLoadingGuard>
  )
}

const Demo = () => {
  return (
    <KeycloakTest>
      <ProfileTest>
        <MapTest />
      </ProfileTest>
    </KeycloakTest>
  )
}