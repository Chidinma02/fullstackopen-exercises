import { View, Image, StyleSheet, Pressable, Linking } from 'react-native';
import theme from '../theme';
import Text from './Text';

const styles = StyleSheet.create({
  container: {
    padding: 15,
    backgroundColor: theme.colors.itemBackground,
  },
  headerRow: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 5,
    marginRight: 15,
  },
  infoContainer: {
    flex: 1,
    alignItems: 'flex-start',
  },
  fullName: {
    marginBottom: 5,
  },
  description: {
    marginBottom: 8,
  },
  languageBadge: {
    backgroundColor: theme.colors.primary,
    borderRadius: 5,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 10,
  },
  statCol: {
    alignItems: 'center',
  },
  statValue: {
    marginBottom: 3,
  },
  button: {
    backgroundColor: theme.colors.primary,
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 15,
  },
});

const formatCount = (count) => {
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}k`;
  }
  return count.toString();
};

const RepositoryItem = ({ item, showGithubButton = false }) => {
  if (!item) return null;

  const handleOpenGithub = () => {
    Linking.openURL(item.url);
  };

  return (
    <View testID="repositoryItem" style={styles.container}>
      <View style={styles.headerRow}>
        <Image source={{ uri: item.ownerAvatarUrl }} style={styles.avatar} />
        <View style={styles.infoContainer}>
          <Text fontWeight="bold" fontSize="subheading" style={styles.fullName}>
            {item.fullName}
          </Text>
          <Text color="textSecondary" style={styles.description}>
            {item.description}
          </Text>
          <View style={styles.languageBadge}>
            <Text color="appBarText">{item.language}</Text>
          </View>
        </View>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statCol}>
          <Text fontWeight="bold" style={styles.statValue}>
            {formatCount(item.stargazersCount)}
          </Text>
          <Text color="textSecondary">Stars</Text>
        </View>
        <View style={styles.statCol}>
          <Text fontWeight="bold" style={styles.statValue}>
            {formatCount(item.forksCount)}
          </Text>
          <Text color="textSecondary">Forks</Text>
        </View>
        <View style={styles.statCol}>
          <Text fontWeight="bold" style={styles.statValue}>
            {item.reviewCount}
          </Text>
          <Text color="textSecondary">Reviews</Text>
        </View>
        <View style={styles.statCol}>
          <Text fontWeight="bold" style={styles.statValue}>
            {item.ratingAverage}
          </Text>
          <Text color="textSecondary">Rating</Text>
        </View>
      </View>

      {showGithubButton && (
        <Pressable onPress={handleOpenGithub} style={styles.button}>
          <Text color="appBarText" fontWeight="bold">
            Open in GitHub
          </Text>
        </Pressable>
      )}
    </View>
  );
};

export default RepositoryItem;
