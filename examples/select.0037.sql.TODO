SELECT t.day, ca.name, co.name AS country, t.num
FROM dwh.revenue t
	JOIN dim.campaign ca ON ca.id = t.campaignid
	LEFT JOIN dim.country co ON co.id = t.countryid
