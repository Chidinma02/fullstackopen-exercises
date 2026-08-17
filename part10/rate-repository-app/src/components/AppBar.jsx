import { View, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Link } from 'react-router-native';
import { useQuery, useApolloClient } from '@apollo/client';
import Constants from 'expo-constants';

import theme from '../theme';
import Text from './Text';
import useAuthStorage from '../hooks/useAuthStorage';
import { ME } from '../graphql/queries';

const styles = StyleSheet.create({
  container: {
    paddingTop: Constants.statusBarHeight + 15,
    paddingBottom: 15,
    paddingHorizontal: 15,
    backgroundColor: theme.colors.appBarBackground,
    flexDirection: 'row',
  },
  tab: {
    marginRight: 20,
  },
});

const AppBar = () => {
  const { data } = useQuery(ME);
  const apolloClient = useApolloClient();
  const authStorage = useAuthStorage();

  const isLoggedIn = data && data.me;

  const signOut = async () => {
    await authStorage.removeAccessToken();
    await apolloClient.resetStore();
  };

  return (
    <View style={styles.container}>
      <ScrollView horizontal>
        <Link to="/" style={styles.tab}>
          <Text color="appBarText" fontSize="subheading" fontWeight="bold">
            Repositories
          </Text>
        </Link>
        {isLoggedIn && (
          <>
            <Link to="/create-review" style={styles.tab}>
              <Text color="appBarText" fontSize="subheading" fontWeight="bold">
                Create a review
              </Text>
            </Link>
            <Link to="/my-reviews" style={styles.tab}>
              <Text color="appBarText" fontSize="subheading" fontWeight="bold">
                My reviews
              </Text>
            </Link>
          </>
        )}

        {isLoggedIn ? (
          <Pressable onPress={signOut} style={styles.tab}>
            <Text color="appBarText" fontSize="subheading" fontWeight="bold">
              Sign out
            </Text>
          </Pressable>
        ) : (
          <>
            <Link to="/signin" style={styles.tab}>
              <Text color="appBarText" fontSize="subheading" fontWeight="bold">
                Sign in
              </Text>
            </Link>
            <Link to="/signup" style={styles.tab}>
              <Text color="appBarText" fontSize="subheading" fontWeight="bold">
                Sign up
              </Text>
            </Link>
          </>
        )}


      </ScrollView>
    </View>
  );
};

export default AppBar;
