import React, { createContext, PropsWithChildren, useContext } from 'react'

export type LOADING_CONTEXT_DEPENDENCIES =
  | 'KEYCLOAK'

export interface ILoadingContext {
  dependencies: Record<LOADING_CONTEXT_DEPENDENCIES, Promise<unknown>>;
  register: (loads: Promise<any>, dependsOn: LOADING_CONTEXT_DEPENDENCIES) => void
}

export type ILoadingContextProviderProps = PropsWithChildren<{

}>;

export interface ILoadingGuardDependency {
  key: LOADING_CONTEXT_DEPENDENCIES;
  value: Promise<any>
}

export interface IHardLoadingGuardProps<T = void> {
  dependencies: LOADING_CONTEXT_DEPENDENCIES[];
  loads: Promise<T>
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

export const LoadingGuard = (props: IHardLoadingGuardProps) => {
  const loadingContext = useContext(LoadingContext);


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
export const HardLoadingGuard = (props: IHardLoadingGuardProps) => {
  const [hasLoaded, setHasLoaded] = React.useState(false);

  props.loads.then(() => setHasLoaded(true));

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
export const SoftLoadingGuard = (props: ISoftLoadingGuardProps) => {

}


const Demo = () => {
  <AppRouter>
    <KeycloakProvider>
      <ProjectPage>
        <ProjectTitle />
        <ProjectDescription />
      </ProjectPage>
    </KeycloakProvider>
  </AppRouter>
}