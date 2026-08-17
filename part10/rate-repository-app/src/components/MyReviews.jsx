import { FlatList, View, StyleSheet, Pressable, Alert } from 'react-native';
import { useNavigate } from 'react-router-native';
import { useMutation } from '@apollo/client';
import { format } from 'date-fns';
import useMe from '../hooks/useMe';
import Text from './Text';
import theme from '../theme';
import { DELETE_REVIEW } from '../graphql/mutations';

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
  cardContainer: {
    backgroundColor: 'white',
    padding: 15,
  },
  reviewContainer: {
    flexDirection: 'row',
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
  title: {
    marginBottom: 2,
  },
  date: {
    marginBottom: 8,
  },
  text: {
    lineHeight: 20,
  },
  buttonsContainer: {
    flexDirection: 'row',
    marginTop: 15,
    justifyContent: 'space-between',
  },
  viewButton: {
    flex: 1,
    backgroundColor: theme.colors.primary,
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginRight: 15,
  },
  deleteButton: {
    flex: 1,
    backgroundColor: '#d73a4a',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
});

const ItemSeparator = () => <View style={styles.separator} />;

const UserReviewItem = ({ review, onViewRepository, onDeleteReview }) => {
  return (
    <View style={styles.cardContainer}>
      <View style={styles.reviewContainer}>
        <View style={styles.ratingContainer}>
          <Text color="primary" fontWeight="bold" fontSize="subheading">
            {review.rating}
          </Text>
        </View>
        <View style={styles.infoContainer}>
          <Text fontWeight="bold" style={styles.title}>
            {review.repository.fullName}
          </Text>
          <Text color="textSecondary" style={styles.date}>
            {format(new Date(review.createdAt), 'dd.MM.yyyy')}
          </Text>
          <Text style={styles.text}>{review.text}</Text>
        </View>
      </View>
      <View style={styles.buttonsContainer}>
        <Pressable onPress={() => onViewRepository(review.repository.id)} style={styles.viewButton}>
          <Text color="appBarText" fontWeight="bold">
            View repository
          </Text>
        </Pressable>
        <Pressable onPress={() => onDeleteReview(review.id)} style={styles.deleteButton}>
          <Text color="appBarText" fontWeight="bold">
            Delete review
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

const MyReviews = () => {
  const { me, loading, refetch } = useMe({ includeReviews: true });
  const navigate = useNavigate();
  const [deleteReview] = useMutation(DELETE_REVIEW);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  const onViewRepository = (repositoryId) => {
    navigate(`/repository/${repositoryId}`);
  };

  const onDeleteReview = (reviewId) => {
    Alert.alert(
      'Delete review',
      'Are you sure you want to delete this review?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: async () => {
            try {
              await deleteReview({ variables: { id: reviewId } });
              refetch();
            } catch (e) {
              console.log(e);
            }
          },
        },
      ]
    );
  };

  const reviews = me && me.reviews
    ? me.reviews.edges.map((edge) => edge.node)
    : [];

  return (
    <FlatList
      data={reviews}
      renderItem={({ item }) => (
        <UserReviewItem
          review={item}
          onViewRepository={onViewRepository}
          onDeleteReview={onDeleteReview}
        />
      )}
      keyExtractor={({ id }) => id}
      ItemSeparatorComponent={ItemSeparator}
      style={styles.container}
    />
  );
};

export default MyReviews;
