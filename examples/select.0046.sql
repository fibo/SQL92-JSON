SELECT
	yyyymmdd,
	campaignid,
	NVL(click, 0),
	NVL(conversion, 0) AS conversion
FROM dwh.campaign_dd
WHERE yyyymmdd = 20170610
