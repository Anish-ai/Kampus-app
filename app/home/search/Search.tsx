import React, { useState } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useAuth } from '../../context/auth';
import { getUserByUsername } from '../../../types/profiles'; // Assuming you have a function to fetch user by username
import { useRouter } from 'expo-router'; // Import useRouter from expo-router

const Search = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
  
    setLoading(true);
    try {
      const userProfile = await getUserByUsername(searchQuery);
      if (userProfile) {
        console.log('Search result:', userProfile); // Debugging
        setSearchResults([userProfile]);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error('Error searching for user:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderSearchResult = ({ item }: { item: { id: string; username: string; email: string } }) => (
    <TouchableOpacity
      style={styles.resultItem}
      onPress={() => {
        console.log('Navigating to profile with id:', item.id); // Debugging
        console.log('Navigating to profile with username:', item.username); // Debugging
        router.push({
          pathname: '/home/search/id',
          params: { id: item.id, username: item.username }, // Pass both id and username
        });
      }}
    >
      <Text style={styles.resultName}>{item.username}</Text>
      <Text style={styles.resultEmail}>{item.email}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchBar}
        placeholder="Search by username..."
        placeholderTextColor="#888"
        value={searchQuery}
        onChangeText={setSearchQuery}
        onSubmitEditing={handleSearch}
      />

      {loading && <ActivityIndicator size="large" color="#007AFF" />}

      {searchResults.length > 0 ? (
        <FlatList
          data={searchResults}
          renderItem={renderSearchResult}
          keyExtractor={(item) => item.id} // Ensure `item.id` is unique
          contentContainerStyle={styles.resultsContainer}
        />
      ) : (
        <Text style={styles.noResultsText}>
          {searchQuery.trim() ? 'No results found' : 'Search for a user by username'}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#181818',
  },
  searchBar: {
    height: 40,
    borderColor: '#444',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 16,
    color: '#fff',
    marginBottom: 16,
  },
  resultsContainer: {
    flexGrow: 1,
  },
  resultItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#444',
  },
  resultName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  resultEmail: {
    fontSize: 14,
    color: '#888',
  },
  noResultsText: {
    textAlign: 'center',
    color: '#888',
    marginTop: 20,
  },
});

export default Search;