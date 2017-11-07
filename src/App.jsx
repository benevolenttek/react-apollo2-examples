import React from 'react';

import { ApolloClient } from 'apollo-client';
import { createHttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import gql from 'graphql-tag';
import { ApolloProvider, graphql } from 'react-apollo';

export default class App extends React.Component {
  createClient() {
    return new ApolloClient({
      link: createHttpLink({
        uri: 'http://api.githunt.com/graphql'
      }),
      cache: new InMemoryCache(),
    });
  }

  render() {
    return (
      <ApolloProvider client={this.createClient()}>
        <div>
          <FeedWithData />
        </div>
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
    return <div style={styles.loading}>Loading...</div>;
  }

  if (data.error) {
    return <div>Error! {data.error.message}</div>;
  }

  return (
    <div>
      <div style={styles.title}>GitHunt</div>
      {data.feed.map((item,i) => <FeedItem key={i} item={item} />)}
      <div>End Feed</div>
    </div>
  );
}

function FeedItem({ item }) {
  return (
    <div style={styles.feedItem}>
      <div style={styles.entry}>
        {item.repository.owner.login}/{item.repository.name}
      </div>
      <div>Posted by {item.postedBy.login}</div>
    </div>
  );
}

const styles = {
  entry: {
    fontWeight: 'bold',
  },
  title: {
    fontSize: 24,
    margin: 20,
  },
  container: {
    flex: 1,
    paddingTop: 20,
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
};
