// import lists from '../../database/lists.json';
import { gql } from '@apollo/client';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { initializeApollo } from '../../util/graphql';
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

export default async function ListsPage(props: Props) {
  const client = initializeApollo(null);
  const sessionToken = cookies().get('sessionToken');

  const { data } = await client.query({
    query: gql`
    query userBySessionToken($token: String! = "${sessionToken?.value}") {
      userBySessionToken(token: $token) {
        id
        username
      }
    }
  `,
  });

  if (!data.userBySessionToken) {
    redirect('/login');
  }
  return (
    <ApolloClientProvider initialApolloState={JSON.stringify([])}>
      <SingleViewList listsId={props.params.listsId} />
    </ApolloClientProvider>
  );
}
