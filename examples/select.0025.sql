SELECT foo, COUNT(*)
FROM mytable
GROUP BY foo, bar
HAVING bar = 'ok'
