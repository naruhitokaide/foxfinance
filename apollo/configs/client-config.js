import { ApolloLink, split } from 'apollo-link'
import { createHttpLink } from 'apollo-link-http'
// import { onError } from 'apollo-link-error'
import { InMemoryCache } from 'apollo-cache-inmemory'
// import { WebSocketLink } from 'apollo-link-ws'
import { getMainDefinition } from 'apollo-utilities'
import 'subscriptions-transport-ws' // this is the default of apollo-link-ws
// popup
// import { MessageBox, Notification } from 'element-ui'

export default (ctx) => {
  const uri = 'https://api.thegraph.com/subgraphs/name/digitalax/digitalax'
  // const uri = `${process.env.URI_QUERY}`
  const authMiddleware = new ApolloLink((operation, forward) => {
    operation.setContext(({ headers = {} }) => ({
      headers: {
        ...headers
      }
    }))
    return forward(operation)
  })

  const httpLink = createHttpLink({ uri, credentials: 'same-origin' })

  // const errorLink = onError(({ graphQLErrors, networkError }) => {
  //   if (graphQLErrors)
  //     graphQLErrors.forEach(({ message, locations, path, extensions }) => {
  //       // console.log(
  //       //   `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
  //       // )

  //       switch (extensions.code) {
  //         case 'UNAUTHENTICATED':
  //           // if (!window.$nuxt || !window.$nuxt.$auth.loggedIn) {
  //           //   window.$nuxt.$router.push({ name: 'login' })
  //           //   return
  //           // }
  //           MessageBox.alert(
  //             'The session has expired or you have logged out, you can log in again',
  //             'Session expired.',
  //             {
  //               confirmButtonText: 'Re-Login',
  //               type: 'warning',
  //               center: true
  //             }
  //           ).then(() => {
  //             window.$nuxt.$auth.logout()
  //             window.$nuxt.$router.push({ name: 'login' })
  //           })
  //           break

  //         // handle other errors
  //         case 'ANOTHER_ERROR_CODE':
  //           // ...
  //           break
  //         default:
  //           // eslint-disable-next-line
  //           console.log(message)
  //       }
  //     })
  //   if (networkError) {
  //     Notification.error(
  //       {
  //         title: 'Error',
  //         message: networkError
  //       }
  //     )
  //   }
  // })

  const link = split(
    ({ query }) => {
      const { kind, operation } = getMainDefinition(query)
      return kind === 'OperationDefinition' && operation === 'subscription'
    },
    authMiddleware,
    httpLink
  )

  return {
    link,
    cache: new InMemoryCache(),
    connectToDevTools: true,
    defaultHttpLink: false
  }
}
