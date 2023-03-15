import { gql } from '@apollo/client';
import { cookies } from 'next/headers';
import { notFound, redirect } from 'next/navigation';
import { initializeApollo } from '../../util/graphql';
import ApolloClientProvider from '../ApolloClientProvider';
import { listNotFoundMetadata } from './not-found';
import SingleViewList from './SingleViewList';

export const dynamic = 'force-dynamic';

type Props = {
  params: { listsId: string };
};

export async function generateMetadata(props: Props) {
  const client = initializeApollo(null);
  const { data } = await client.query({
    query: gql`
    query SingleListWithTasks($singleListWithTasksId: ID! = "${props.params.listsId}") {
      singleListWithTasks(id: $singleListWithTasksId) {
        title
      }
    }
    `,
  });

  if (!data || !data.singleListWithTasks || !data.singleListWithTasks.title) {
    return listNotFoundMetadata;
  }

  return {
    title: data.singleListWithTasks.title,
    description: `Showing list ${data.singleListWithTasks.title}`,
  };
}

export default async function ListsPage(props: Props) {
  const client = initializeApollo(null);
  const sessionToken = cookies().get('sessionToken');

  if (!props.params.listsId) {
    notFound();
  }

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
      <SingleViewList
        listsId={props.params.listsId}
        currentUser={data.userBySessionToken.username}
      />
    </ApolloClientProvider>
  );
}
