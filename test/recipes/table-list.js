var test = require('tape')

var sql2json = require('sql92-json').parse

var getJoinKeyword = require('stringify/getJoinKeyword')
var getTableNameWithAlias = require('stringify/getTableNameWithAlias')
var getTableNameAlias = require('stringify/getTableNameAlias')
var isSetOperator = require('util/isSetOperator')
var isTableName = require('util/isTableName')

function getTableList (json) {
  var joinKeyword
  var joinObj
  var tableList = []
  var tableAlias
  var tableName
  var tableNameWithAlias

  if (json.FROM) {
    json.FROM.forEach((resultSet) => {
      // It could be a table name or a sub query.
      if (resultSet.SELECT) {
        tableList.concat(getTableList(resultSet))
      } else {
        if (isTableName(resultSet)) {
          tableList.push(tableName)
        } else {
          // Tables with aliases.
          tableNameWithAlias = getTableNameWithAlias(resultSet)
          tableAlias = getTableNameAlias(tableNameWithAlias)
          tableName = resultSet[tableAlias]
          tableList.push(tableName)

          // JOIN, LEFT JOIN, FULL OUTER JOIN, ecc.
          joinKeyword = getJoinKeyword(resultSet)

          if (joinKeyword) {
            joinObj = resultSet[joinKeyword]
            tableNameWithAlias = getTableNameWithAlias(joinObj)
            tableAlias = getTableNameAlias(tableNameWithAlias)
            tableName = joinObj[tableAlias]
            tableList.push(tableName)
          }
        }
      }
    })
  }

  // EXCEPT INTERSECT, UNION, UNION ALL
  Object.keys(json).forEach((token) => {
    if (isSetOperator(token)) {
      tableList.concat(getTableList(json[token]))
    }
  })

  // Return unique values: it could be a table joined with itself,
  // a UNION statement, or for some other reason contains a table name
  // more than once. Values are also sorted.
  return tableList.filter((val, i, arr) => (i <= arr.indexOf(val))).sort()
}

var sql = `
SELECT 'revenue', r.id, c.name, r.quantity
FROM dwh.revenue r
  JOIN dim.customer c ON c.id = r.customerid
UNION
SELECT 'cost', c.id, p.name, p.quantity
FROM dwh.cost c
 JOIN dim.provider p ON p.id = c.providerid
`

test('recipe table-list', (t) => {
  var query = sql2json(sql)

  var expectedTableList = ['dwh.revenue', 'dwh.cost', 'dim.customer', 'dim.provider']

  t.deepEqual(getTableList(query), expectedTableList.sort(), 'table list')

  t.end()
})
