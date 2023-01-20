CREATE TABLE IF NOT EXISTS "studiengang" (
	"id"	INTEGER,
	"name"	TEXT NOT NULL,
	"kuerzel"	TEXT,
	"semester_anzahl"	INTEGER,
	"fakultäts_id"	INTEGER,
    FOREIGN KEY("fakultäts_Id") REFERENCES "fakultät"("id"),
	PRIMARY KEY("id" AUTOINCREMENT)
)