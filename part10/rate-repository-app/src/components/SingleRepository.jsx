import { FlatList, View, StyleSheet } from 'react-native';
import { useParams } from 'react-router-native';
import { format } from 'date-fns';
import useRepository from '../hooks/useRepository';
import RepositoryItem from './RepositoryItem';
import Text from './Text';
import theme from '../theme';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e1e4e8',
  },
  loadingContainer: {
    padding: 15,
    alignItems: 'center',
  },
  separator: {
    height: 10,
    backgroundColor: '#e1e4e8',
  },
  reviewContainer: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: 'white',
  },
  ratingContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
    flexShrink: 0,
  },
  infoContainer: {
    flex: 1,
  },
  username: {
    marginBottom: 2,
  },
  date: {
    marginBottom: 8,
  },
  text: {
    lineHeight: 20,
  },
});

const ItemSeparator = () => <View style={styles.separator} />;

const ReviewItem = ({ review }) => {
  return (
    <View style={styles.reviewContainer}>
      <View style={styles.ratingContainer}>
        <Text color="primary" fontWeight="bold" fontSize="subheading">
          {review.rating}
        </Text>
      </View>
      <View style={styles.infoContainer}>
        <Text fontWeight="bold" style={styles.username}>
          {review.user.username}
        </Text>
        <Text color="textSecondary" style={styles.date}>
          {format(new Date(review.createdAt), 'dd.MM.yyyy')}
        </Text>
        <Text style={styles.text}>{review.text}</Text>
      </View>
    </View>
  );
};

const SingleRepository = () => {
  const { id } = useParams();
  const { repository, loading, fetchMore } = useRepository({ id, first: 4 });

  if (loading && !repository) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!repository) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Repository not found</Text>
      </View>
    );
  }

  const reviews = repository.reviews
    ? repository.reviews.edges.map((edge) => edge.node)
    : [];

  const onEndReach = () => {
    fetchMore();
  };

  return (
    <FlatList
      data={reviews}
      renderItem={({ item }) => <ReviewItem review={item} />}
      keyExtractor={({ id }) => id}
      ItemSeparatorComponent={ItemSeparator}
      ListHeaderComponent={() => (
        <View>
          <RepositoryItem item={repository} showGithubButton />
          <ItemSeparator />
        </View>
      )}
      onEndReached={onEndReach}
      onEndReachedThreshold={0.5}
      style={styles.container}
    />
  );
};


export default SingleRepository;

