SELECT t.day, co.isocode, ca.name, t.num
FROM dwh.revenue t
	JOIN dim.campaign ca ON ca.id = t.campaignid
	JOIN dim.country co ON co.id = t.countryid
