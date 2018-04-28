SELECT
	t.country,
	t.hair_color,
	(
		SELECT COUNT(DISTINCT hair_color)
		FROM people u
		WHERE u.country = t.country
	) AS num
FROM (
	SELECT DISTINCT country, hair_color
	FROM people
) t
