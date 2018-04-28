SELECT
	campaignid,
	campaignname,
	SUM(click) AS click
FROM dwh.insertion_order
WHERE yyyymmdd BETWEEN 20170301 AND 20170521
GROUP BY
	campaignid,
	campaignname
