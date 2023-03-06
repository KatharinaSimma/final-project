// import lists from '../../database/lists.json';
// import { gql } from '@apollo/client';
// import { cookies } from 'next/headers';
// import { redirect } from 'next/navigation';
// import { initializeApollo } from '../../util/graphql';
import ApolloClientProvider from '../ApolloClientProvider';
// import { listNotFoundMetadata } from './not-found';
import SingleViewList from './SingleViewList';

export const dynamic = 'force-dynamic';

type Props = {
  params: { listsId: string };
};

// export function generateMetadata(props: Props) {
//   const singleList = lists.find((list) => {
//     return list.id === parseInt(props.params.listsId);
//   });

//   if (!singleList) {
//     return listNotFoundMetadata;
//   }

//   return {
//     title: singleList.title,
//     description: `Page to edit: ${singleList.title}`,
//   };
// }

export default function ListsPage(props: Props) {
  // const client = initializeApollo(null);
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
  return (
    <ApolloClientProvider initialApolloState={JSON.stringify([])}>
      <SingleViewList listsId={props.params.listsId} />
    </ApolloClientProvider>
  );
}
