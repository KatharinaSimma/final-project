import { gql } from '@apollo/client';
import lists from '../../database/lists.json';
import { initializeApollo } from '../../util/graphql';
import ApolloClientProvider from '../ApolloClientProvider';
import { listNotFoundMetadata } from './not-found';
import SingleViewList from './SingleViewList';

export const dynamic = 'force-dynamic';

type Props = {
  params: { listsId: string };
};

export function generateMetadata(props: Props) {
  const singleList = lists.find((list) => {
    return list.id === parseInt(props.params.listsId);
  });

  if (!singleList) {
    return listNotFoundMetadata;
  }

  return {
    title: singleList.title,
    description: `Page to edit: ${singleList.title}`,
  };
}

export default async function ListsPage(props: Props) {
  const client = initializeApollo(null);
  const listsId = props.params.listsId;

  const { data } = await client.query({
    query: gql`
      query list($id: ID! = ${listsId}) {
        list(id: $id) {
          id
          title
          description
        }
      }
    `,
  });

  return (
    <ApolloClientProvider initialApolloState={JSON.stringify([])}>
      <SingleViewList singleList={data.list} />
    </ApolloClientProvider>
  );
}
