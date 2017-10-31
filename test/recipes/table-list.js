var test = require('tape')

var sql2json = require('sql92-json').parse

function getTableList (json) {
  var tableList = []

  if (json.FROM) {
    json.FROM.forEach((resultSet) => {
      if (resultSet.SELECT) {
        tableList.concat(getTableList(resultSet))
      } else {
        tableList.push(resultSet)
      }
    })
  }

  // Return unique values.
  return tableList.filter((val, i, arr) => (i <= arr.indexOf(val)))
}

var sql = `
SELECT * FROM foo
`

// TODO
// var sql = `
// SELECT 'revenue', r.id, c.name, r.quantity
// FROM dwh.revenue r
//   JOIN dim.customer c ON c.id = r.customerid
// UNION
// SELECT 'cost', c.id, p.name, p.quantity
// FROM dwh.cost c
//  JOIN dim.provider p ON p.id = c.providerid
// `

test('recipe table-list', (t) => {
  var query = sql2json(sql)

  var expectedTableList = ['foo']

  // TODO var expectedTableList = [ "dwh.revenue", "dwh.cost", "dim.customer", "dim.provider" ]
  t.deepEqual(getTableList(query), expectedTableList, 'table list')

  t.end()
})
