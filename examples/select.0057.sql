SELECT eventname
FROM dwh.event
WHERE product='media'
  AND channel in ('proads','freeads')
