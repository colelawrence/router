import * as React from 'react'
import type {
  DehydratedLoaderClient,
  LoaderClient,
} from '@tanstack/react-loaders'
import type { DehydratedRouter, Router } from '@tanstack/router'
import jsesc from 'jsesc'

declare global {
  interface Window {
    __DEHYDRATED__?: {
      dehydratedRouter: DehydratedRouter
      dehydratedLoaderClient: DehydratedLoaderClient
    }
  }
}

const hydrationContext = React.createContext<{
  dehydratedRouter?: DehydratedRouter
  dehydratedLoaderClient?: DehydratedLoaderClient
}>({})

export function ServerContext(props: {
  dehydratedRouter: DehydratedRouter
  dehydratedLoaderClient: DehydratedLoaderClient
  children: any
}) {
  return (
    <hydrationContext.Provider
      value={{
        dehydratedRouter: props.dehydratedRouter,
        dehydratedLoaderClient: props.dehydratedLoaderClient,
      }}
    >
      {props.children}
    </hydrationContext.Provider>
  )
}

export function RouterScripts() {
  const { dehydratedRouter, dehydratedLoaderClient } =
    React.useContext(hydrationContext)

  return (
    <>
      <script
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: `
          window.__DEHYDRATED__ = JSON.parse(
            ${jsesc(
              JSON.stringify({
                dehydratedRouter,
                dehydratedLoaderClient,
              }),
              {
                isScriptContext: true,
                quotes: 'single',
                json: true,
              },
            )}
          )
        `,
        }}
      />
      <script type="module" src="/src/app/entry-client.tsx" />
    </>
  )
}

export function Hydrate(props: {
  loaderClient: LoaderClient<any>
  router: Router<any>
  children: any
}) {
  // Server hydrates from context
  let ctx = React.useContext(hydrationContext)

  React.useState(() => {
    // Client hydrates from window
    if (typeof document !== 'undefined') {
      ctx = window.__DEHYDRATED__ || {}
    }

    const { dehydratedRouter, dehydratedLoaderClient } = ctx

    if (dehydratedRouter && dehydratedLoaderClient) {
      props.loaderClient.hydrate(dehydratedLoaderClient)
      props.router.hydrate(dehydratedRouter)
    }
  })

  return props.children
}