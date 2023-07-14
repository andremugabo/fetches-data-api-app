import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  View,
  FlatList,
  Text,
  RefreshControl,
  ActivityIndicator,
  StyleSheet,
} from "react-native";

const API_URL = "https://reactnative.dev/movies.json";
const PAGE_SIZE = 10;

const App = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const fetchData = async (pageNumber) => {
    try {
      const response = await fetch(
        `${API_URL}?page=${pageNumber}&limit=${PAGE_SIZE}`
      );
      const json = await response.json();
      setData((prevData) => [...prevData, ...json.results]);
      setTotalPages(json.totalPages);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    setPage(1);
    setData([]);
    fetchData(1);
  };

  const handleLoadMore = () => {
    if (page < totalPages) {
      setPage(page + 1);
      fetchData(page + 1);
    }
  };

  useEffect(() => {
    fetchData(page);
  }, []);

  const renderFooter = () => {
    if (!loading) return null;
    return (
      <View style={styles.footer}>
        <ActivityIndicator size="large" />
      </View>
    );
  };

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.body}>{item.releaseYear}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        ListFooterComponent={renderFooter}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.1}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  item: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  body: {
    fontSize: 14,
  },
  footer: {
    paddingVertical: 20,
  },
});

export default App;
