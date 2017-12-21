---
title: Add resultset limit
permalink: /recipes/resultset-limit/
---

# Resultset limit

[test source](https://github.com/fibo/SQL92-JSON/blob/master/test/recipes/resultset-limit.js)

In a SQL editor webapp you want to show a preview of the query, but prevent
user to create a resultset too big to be displayed in a browser. Given the
query, it is enough to add a `LIMIT` clause server side.

Start from this simple query

```sql
SELECT *
FROM revenue
```

Given it as a JSON in a `queryJSON` variable, the following snippet is a
first working implementation

```javascript
var defaultLimit = 10000

if (queryJSON.LIMIT) {
  if (queryJSON.LIMIT > defaultLimit) {
    queryJSON.LIMIT = defaultLimit
  }
} else {
  queryJSON.LIMIT = defaultLimit
}
```

So far so good, what about a query with one or more `UNION`?

```sql
SELECT *
FROM revenue_2017
UNION
SELECT *
FROM revenue_2018
```

In my opinion the desired query to get a resultset limited to, for
instance, *1000 rows* is

```sql
(
  SELECT *
  FROM revenue_2017
  LIMIT 500
)
UNION
(
  SELECT *
  FROM revenue_2018
  LIMIT 500
)
```

We need a function that can do this!
