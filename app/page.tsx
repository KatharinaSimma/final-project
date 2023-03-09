import { gql } from '@apollo/client';
// import { cookies } from 'next/headers';
// import { redirect } from 'next/navigation';
import { initializeApollo } from '../util/graphql';
import ApolloClientProvider from './ApolloClientProvider';
import ListContainer from './ListContainer';

export default async function Home() {
  const client = initializeApollo(null);

  // const nextCookies = cookies();

  // const fakeSessionToken = nextCookies.get('fakeSessionToken');
  // const { data } = await client.query({
  //   query: gql`
  //     query GetLoggedInAnimalByFirstName($firstName: String! = ${fakeSessionToken?.value}) {
  //       getLoggedInAnimalByFirstName(firstName: $firstName) {
  //         accessory
  //         firstName
  //       }
  //     }
  //   `,
  // });

  // if (!data.getLoggedInAnimalByFirstName) {
  //   redirect('/login');
  // }

  // await client.query({
  //   query: gql`
  //     query ListWithTasks {
  //       listWithTasks {
  //         id
  //         title
  //         description
  //         tasks {
  //           id
  //           title
  //           description
  //           done
  //         }
  //       }
  //     }
  //   `,
  // });

  await client.query({
    query: gql`
      query User {
        listWithTasks {
          id
          title
          description
          tasks {
            id
            title
            description
            done
          }
        }
      }
    `,
  });
  return (
    <main className="min-h-[calc(100vh-7rem)] mb-12 p-2">
      <h1 className="py-5 text-3xl text-center">Your Lists</h1>
      <div className="max-w-5xl m-auto">
        <ApolloClientProvider
          initialApolloState={JSON.stringify(client.cache.extract())}
        >
          <ListContainer />
        </ApolloClientProvider>
      </div>
    </main>
  );
}
