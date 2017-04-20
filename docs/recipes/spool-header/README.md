---
title: Spool header
permalink: /recipes/spool-header/
---

# Spool header

When downloading data of a result set into a file (action known also as *spool*)
for example into a CSV file, it is useful to add an *header*, i.e. write
in the first row the field names.

Suppose that our statement is

```sql
SELECT name, color, quantity, when_eat
FROM fruit
```

If the database you are using does not support this feature out of the box,
the common trick is to prepend a statement that adds a single row with the
header, something like

```sql
SELECT 'name', 'color', 'quantity', 'when_eat'
UNION
SELECT name, color, quantity, when_eat
FROM fruit
```

TODO: case when it is a `select * from` do a limit 1 to get the header.

