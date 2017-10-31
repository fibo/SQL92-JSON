---
title: Table list
permalink: /recipes/table-list/
---

# Table list

[test source](https://github.com/fibo/SQL92-JSON/blob/master/test/recipes/table-list.js)

Suppose you have a complicated query, or a set of queries and you want to
know which tables are involved. For example you could create a copy of
those tables in a test environment.

The following function will extract table names recursively.

```javascript
/// TODO this function should consider also JOINs and UNIONs.

function getTableList (json) {
  var tableList = []

  if (json.FROM) {
    json.FROM.forEach((resultSet) => {
      // It could ne a table name or a sub query.
      if (resultSet.SELECT) {
        tableList.concat(getTableList(resultSet))
      } else {
        tableList.push(resultSet)
      }
    })
  }

  // Return unique values: it could be a table joined with itself,
  // a UNION statement, or for some other reason contains a table name
  // more than once.
  return tableList.filter((val, i, arr) => (i <= arr.indexOf(val)))
}
```

If you convert the following SQL into JSON ...

```sql
SELECT 'revenue', r.id, c.name, r.quantity
FROM dwh.revenue r
  JOIN dim.customer c ON c.id = r.customerid
UNION
SELECT 'cost', c.id, p.name, p.quantity
FROM dwh.cost c
  JOIN dim.provider p ON p.id = c.providerid
```

and pass it to `getTableList` you get the following table list

```json
[ "dwh.revenue", "dwh.cost", "dim.customer", "dim.provider" ]
```

For example you could use the list to create an empty copy of each table,
prepending a `test_` string to get them in a test environment.

```javascript
function createTableAs (tableName) {
  return {
    'CREATE TABLE': {
      name: 'test_' + tableName,
      AS: {
        SELECT: ['*'],
        FROM: [tableName]
        WHERE: [0, { '=', 1 }]
      }
    }
  }
}
```
