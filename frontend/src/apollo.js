import { ApolloClient, createHttpLink, InMemoryCache } from "@apollo/client/core";
import { setContext } from "apollo-link-context";

import Cookie from "js-cookie";

const COOKIE_TOKEN_NAME = "jwt-token";
// HTTP connection to the API
const httpLink = createHttpLink({
	uri: "/graphql"
});

// Cache implementation
const cache = new InMemoryCache();

const authLink = setContext((_, { headers }) => {
	const token = Cookie.get(COOKIE_TOKEN_NAME);

	return {
		headers: {
			...headers,
			authorization: token ? `Bearer ${token}` : null
		}
	};
});

export async function apolloAuth() {
	try {
		await apolloClient.resetStore();
	} catch (e) {
		console.log("%cError on cache reset (login)", "color: orange;", e.message);
	}
}

export const apolloClient = new ApolloClient({
	link: authLink.concat(httpLink),
	//link: httpLink,
	cache
});
