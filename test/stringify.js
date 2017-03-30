var fs = require('fs')
var path = require('path')
var test = require('tape')

var json2sql = require('sql92-json').stringify

var normalizeSQL = require('src/util/normalizeSQL')

var examplesDir = path.join(__dirname, '..', 'examples')

test('examples', function (t) {
  fs.readdir(examplesDir, function (err, files) {
    if (err) throw err

    files.forEach(function (file) {
      var extension = path.extname(file)
      var filename = path.parse(file).name

      if (extension === '.json') {
        var jsonFile = path.join(examplesDir, `${filename}${extension}`)
        var sqlFile = path.join(examplesDir, `${filename}.sql`)

        fs.readFile(sqlFile, 'utf8', function (err, expected) {
          if (err) throw err

          var result = json2sql(require(jsonFile))

          expected = normalizeSQL(expected)

          t.equal(result, expected, filename)
        })
      }
    })
  })

  t.end()
})

/*

}

select * from paperino where yyyymmdd > 20161801

{
  SELECT: ['*'], FROM: ['paperino'],
  WHERE: [yyyymmdd, {'>': 20161801} ]
}

select
  pippo,
  pluto
from (select * from paperino where yyyymmdd > 20161801)
where pippo = 'ok'

{
SELECT: [
'pippo', 'pluto'
],
FROM: [
{
  SELECT: ['*'], FROM: ['paperino'],
  WHERE: [yyyymmdd, {'>': 20161801}]
}

],
WHERE: [pippo, {'=': 'ok'} ]
}

select *
from foo f join bar b on f.id = b.id
join quz q on b.id = q.id

{
SELECT: ['*'],
FROM: [
  {'f' : 'foo'},
  {JOIN: {'b': 'bar'}, ON: [{{'f':'id'}: {'=':{'b':'id'}}}]}
  {JOIN: {'q': 'quz'}, ON: [{{'b':'id'}: {'=':{'q':'id'}}}]}
  ]
}

select a.foo,b.bar
from table t join (select * from quz) a on (a.id = b.id)

{
SELECT: [
{'a': 'foo'},
{'b': 'bar'}
],
FROM: [
{
't': 'table'
},
{ join: {
  a: {SELECT:['*'],FROM:['quz']}
}, on [{a: 'id'},{'=':{b:id}}]
}
]
}

select *
from foo
where a = 1
and b = 2

{
select: ['*'],
from: ['foo'],
where: [ 'a',{'=':1}, {and: ['b',{'=':2}]}
]
}

select *
from foo
where a = 1
and (b = 2 or c = 0)

{
select: ['*'],
from: ['foo'],
where: [ 'a',{'=':1}, {and: ['b',{'=':2}, {or: ['c',{'=':0}]}]}
]
}

select *
from foo
where c is true

{
select: ['*'],
from: ['foo'],
where: [ 'c',{'IS':true} ]
}

select count(*) from foo

{select: [{count:'*'}],
from: ['foo']}

select count(*) as num from foo

{select: [{count:'*', as: num}],
from: ['foo']}

select max(a.time),num from foo a group by num

{select: [{max:{a: 'time'}},'num'],
from: [{a: 'foo'}]
'group by': ['num']}

select
  a.pippo as miao,
  pluto as ciao
from paperino
where pippo = 'ok'

{
select: [
{'a': 'pippo', 'as': 'miao'},
{'as': {'ciao': 'pluto'}}
],
from: [
'paperino'
],
where:[
'pippo', {'=': 'ok'}
]
}

var sql2json = require('sql-json').parse
var json2sql = require('sql-json').stringify

insert into mytable values ('ok')

{insert into: {mytable: []}, values: [['ok']]}
 */
