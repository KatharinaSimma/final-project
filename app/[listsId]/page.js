import { notFound } from 'next/navigation';
import lists from '../../database/lists.json';
import { listNotFoundMetadata } from './not-found';
import SingleViewList from './SingleViewList';

export const dynamic = 'force-dynamic';

// type Props = {
//   params: { listsId: string };
// };

export function generateMetadata(props /* : Props */) {
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

export default function ListsPage(props /* : Props */) {
  const singleList = lists.find((list) => {
    return list.id === parseInt(props.params.listsId);
  });

  if (singleList === undefined) {
    notFound();
  }

  console.log('singleList', singleList);

  return <SingleViewList singleList={singleList} />;
}
