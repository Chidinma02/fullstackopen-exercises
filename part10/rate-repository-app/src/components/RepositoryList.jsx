import { useState } from 'react';
import { FlatList, View, StyleSheet, Pressable, TextInput } from 'react-native';
import { useNavigate } from 'react-router-native';
import { Picker } from '@react-native-picker/picker';
import { useDebounce } from 'use-debounce';
import RepositoryItem from './RepositoryItem';
import useRepositories from '../hooks/useRepositories';

const styles = StyleSheet.create({
  separator: {
    height: 10,
    backgroundColor: '#e1e4e8',
  },
  headerContainer: {
    padding: 15,
    backgroundColor: '#e1e4e8',
  },
  picker: {
    backgroundColor: '#f1f1f1',
    padding: 10,
    borderRadius: 5,
  },
  searchInput: {
    backgroundColor: '#ffffff',
    padding: 12,
    borderRadius: 5,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#cccccc',
    fontSize: 16,
  },
});

const ItemSeparator = () => <View style={styles.separator} />;

const HeaderComponent = ({ selectedSort, setSelectedSort, searchQuery, setSearchQuery }) => {
  return (
    <View style={styles.headerContainer}>
      <TextInput
        placeholder="Filter repositories..."
        value={searchQuery}
        onChangeText={setSearchQuery}
        style={styles.searchInput}
      />
      <Picker
        selectedValue={selectedSort}
        onValueChange={(itemValue) => setSelectedSort(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Latest repositories" value="latest" />
        <Picker.Item label="Highest rated repositories" value="highest" />
        <Picker.Item label="Lowest rated repositories" value="lowest" />
      </Picker>
    </View>
  );
};

export const RepositoryListContainer = ({
  repositories,
  onRepositoryPress,
  selectedSort,
  setSelectedSort,
  searchQuery,
  setSearchQuery,
}) => {
  const repositoryNodes = repositories
    ? repositories.edges.map((edge) => edge.node)
    : [];

  return (
    <FlatList
      data={repositoryNodes}
      ItemSeparatorComponent={ItemSeparator}
      renderItem={({ item }) => (
        <Pressable onPress={() => onRepositoryPress && onRepositoryPress(item.id)}>
          <RepositoryItem item={item} />
        </Pressable>
      )}
      keyExtractor={(item) => item.id}
      ListHeaderComponent={
        setSelectedSort ? (
          <HeaderComponent
            selectedSort={selectedSort}
            setSelectedSort={setSelectedSort}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
        ) : null
      }
    />
  );
};

const RepositoryList = () => {
  const [selectedSort, setSelectedSort] = useState('latest');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery] = useDebounce(searchQuery, 500);

  let variables = {
    orderBy: 'CREATED_AT',
    orderDirection: 'DESC',
    searchKeyword: debouncedSearchQuery,
  };

  if (selectedSort === 'highest') {
    variables = {
      orderBy: 'RATING_AVERAGE',
      orderDirection: 'DESC',
      searchKeyword: debouncedSearchQuery,
    };
  } else if (selectedSort === 'lowest') {
    variables = {
      orderBy: 'RATING_AVERAGE',
      orderDirection: 'ASC',
      searchKeyword: debouncedSearchQuery,
    };
  }

  const { repositories } = useRepositories(variables);
  const navigate = useNavigate();

  const onRepositoryPress = (id) => {
    navigate(`/repository/${id}`);
  };

  return (
    <RepositoryListContainer
      repositories={repositories}
      onRepositoryPress={onRepositoryPress}
      selectedSort={selectedSort}
      setSelectedSort={setSelectedSort}
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
    />
  );
};

export default RepositoryList;


