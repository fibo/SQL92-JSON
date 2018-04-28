SELECT
	t.time::date AS day,
	t.id,
	t.name,
	COUNT(1) AS num
FROM my.table t
WHERE t.time::date > SYSDATE - 2
AND id IN ('id1', 'id2')
GROUP BY
	t.time::date,
	t.id,
	t.name
ORDER BY 4 DESC
