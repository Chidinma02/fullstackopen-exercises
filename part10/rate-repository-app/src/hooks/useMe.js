import { useQuery } from '@apollo/client';
import { ME } from '../graphql/queries';

const useMe = (variables) => {
  const { data, loading, refetch } = useQuery(ME, {
    variables,
    fetchPolicy: 'cache-and-network',
  });

  return {
    me: data ? data.me : undefined,
    loading,
    refetch,
  };
};

export default useMe;
