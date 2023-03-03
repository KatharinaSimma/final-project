import lists from '../../database/lists.json';
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

export default function ListsPage(props: Props) {
  return (
    <ApolloClientProvider initialApolloState={JSON.stringify([])}>
      <SingleViewList listsId={props.params.listsId} />
    </ApolloClientProvider>
  );
}
