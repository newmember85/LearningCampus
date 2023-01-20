CREATE TABLE IF NOT EXISTS "kurs_einschreibung" (
	"matrikel_nr"	INTEGER,
	"kurs_id"	INTEGER,
	FOREIGN KEY("kurs_id") REFERENCES "kurs"("id"),
	FOREIGN KEY("matrikel_nr") REFERENCES "student"("matrikel_nr")
)