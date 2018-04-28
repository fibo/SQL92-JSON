SELECT
	t.time,
	t.time::date AS yyyymmdd,
	t.tid,
	t.device_idfa,
	t.appid,
	t.campaignid,
	c.name AS campaign_name,
	t.postbackid,
	c.name AS postback_name,
	COUNT(*) AS num_conversions
FROM trk.postback t
	LEFT JOIN dim.campaign c ON c.id = t.campaignid
	LEFT JOIN dim.postback p ON p.id = t.postbackid
GROUP BY t.time, t.tid, t.device_idfa, t.appid, t.campaignid, c.name, t.postbackid, c.name
ORDER BY 1
