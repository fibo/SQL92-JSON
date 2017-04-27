SELECT t.day, c.name AS campaignname, t.num
FROM dwh.revenue t
	JOIN dim.campaign c ON c.id = t.campaignid
