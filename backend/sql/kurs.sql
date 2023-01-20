CREATE TABLE IF NOT EXISTS "kurs" (
	"id"	INTEGER,
	"name"	TEXT,
	"semester"	TEXT,
	"kuerzel"	TEXT,
	"fwpm"	TEXT NOT NULL,
	"studiengang_id"	INTEGER,
	"dozenten_id"	INTEGER,
	FOREIGN KEY("dozenten_id") REFERENCES "dozent"("id"),
	FOREIGN KEY("studiengang_id") REFERENCES "studiengang"("id"),
	PRIMARY KEY("id" AUTOINCREMENT)
)