SELECT *
FROM (
	SELECT * FROM dwh.revenue_current_week
	UNION
	SELECT * FROM dwh.revenue_last_week
)
WHERE yyyymmdd = 20170501
