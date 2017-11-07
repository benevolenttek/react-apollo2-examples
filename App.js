import React from 'react';
import { StyleSheet, Text, View, Button, Linking } from 'react-native';
import { Constants } from 'expo';

import { ApolloClient } from 'apollo-client';
import { createHttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import gql from 'graphql-tag';
import { ApolloProvider, graphql } from 'react-apollo';

export default class App extends React.Component {
  createClient() {
    return new ApolloClient({
      link: createHttpLink({
        uri: 'http://api.githunt.com/graphql',
      }),
      cache: new InMemoryCache(),
    });
  }

  render() {
    return (
      <ApolloProvider client={this.createClient()}>
        <View style={styles.container}>
          <FeedWithData />
        </View>
      </ApolloProvider>
    );
  }
}


// This is a simple query that just gets some of the top
// posted repositories.
//
// You can use the GraphiQL query IDE to try writing new
// queries! Go to the link below:
//
// http://api.githunt.com/graphiql
//
// Once you've written a new query, write some React Native
// components in the Feed component below to display the data!
const FeedWithData = graphql(gql`
  {
    feed (type: TOP, limit: 5) {
      repository {
        owner { login }
        name
      }
  
      postedBy { login }
    }
  }
`)(Feed)

function Feed({ data }) {
  if (data.loading) {
    return <Text style={styles.loading}>Loading...</Text>;
  }

  if (data.error) {
    return <Text>Error! {data.error.message}</Text>;
  }

  return (
    <View>
      <Text style={styles.title}>GitHunt</Text>
      {data.feed.map((item,i) => <FeedItem key={i} item={item} />)}
      <Button
        style={styles.learnMore}
        onPress={goToApolloWebsite}
        title="Learn more about Apollo!"
      />
    </View>
  );
}

function FeedItem({ item }) {
  return (
    <View style={styles.feedItem}>
      <Text style={styles.entry}>
        {item.repository.owner.login}/{item.repository.name}
      </Text>
      <Text>Posted by {item.postedBy.login}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  entry: {
    fontWeight: 'bold',
  },
  title: {
    fontSize: 24,
    margin: 20,
  },
  container: {
    flex: 1,
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#ecf0f1',
  },
  feedItem: {
    margin: 20,
  },
  learnMore: {
    margin: 20,
  },
  loading: {
    margin: 20,
  },
});

function goToApolloWebsite() {
  Linking.openURL('http://dev.apollodata.com').catch(e => console.log(e));
}