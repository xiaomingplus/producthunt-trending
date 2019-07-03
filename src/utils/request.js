import { GraphQLClient } from "graphql-request";
import moment from "moment";

export function getProducts(params) {
  const client = new GraphQLClient(
    "https://api.producthunt.com/v2/api/graphql",
    {
      headers: {
        authorization: `Bearer ${params.token}`
      },
      mode: "cors"
    }
  );
  const options = Object.assign(
    {
      since: moment()
        .subtract(30, "days")
        .toDate()
    },
    params
  );
  const postedAfter = options.since.toISOString();
  let after = "";
  let before = "";
  if (options.after) {
    after = options.after;
  }
  if (options.before) {
    before = options.before;
  }
  let query = `{
    posts(order:VOTES,postedAfter:"${postedAfter}"`;
  if (after) {
    query += `,after:"${after}",first:20`;
  } else if (before) {
    query += `,before:"${before}",last:20`;
  }
  query += `){
      pageInfo {
        endCursor
        startCursor
      }
      totalCount
      edges {
        node {
          id
          createdAt
          name
          description
          votesCount
          url
          website
          thumbnail {
            type
            url
            videoUrl
          }
        }
      }
    }
  }`;

  return client.request(query);
}
