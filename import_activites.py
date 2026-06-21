"""Import data from MySQL duss_activites into SQLite."""
import pymysql
import sqlite3
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent
DB_PATH = BASE_DIR / "place.db"

MYSQL_CONFIG = {
    "host": "localhost",
    "user": "montest",
    "password": "systest",
    "database": "duss_activites",
    "charset": "utf8mb4",
}

# Tables to import in dependency order (parents first)
TABLES = {
    "Type": ("No_Type", "Name_Type"),
    "Chap": ("No_chap", "Name_Chap"),
    "Niveau": ("No_Niv", "Name_Niv"),
    "Img": ("No_Img", "N_Img"),
    "Reponses": ("No_Rep", "Reponse"),
    "Attrib_Niv": ("No_Niv_Attrib", "No_dChap", "No_dNiv"),
    "Liens": ("No_Lien", "No_dAct", "Link"),
    "Activite": ("No_Act", "Type_Act", "Name_Act", "No_dImg"),
    "Attrib_Chap": ("No_Attrib", "No_dChap", "No_dAct"),
    "Act_Attrib": ("No-Act_Attrib", "No_Niv_Attrib", "No_Act_Attrib"),
    "Listes": ("No_Liste", "Act_liste", "Num_Liste_Base", "Num_Liste_Act", "Num_Rep"),
    "Etiquettes": ("No_Etiqu", "x", "y", "No_liste"),
}


def main():
    print("Connecting to MySQL...")
    mysql = pymysql.connect(**MYSQL_CONFIG)
    mysql_cursor = mysql.cursor()

    print(f"Connecting to SQLite: {DB_PATH}")
    sqlite = sqlite3.connect(str(DB_PATH))
    sqlite_cursor = sqlite.cursor()

    for table_name, columns in TABLES.items():
        cols_str = ", ".join(f"`{c}`" for c in columns)
        placeholders = ", ".join(["?"] * len(columns))

        # Read from MySQL
        mysql_cursor.execute(f'SELECT {cols_str} FROM `{table_name}`')
        rows = mysql_cursor.fetchall()

        if not rows:
            print(f"  {table_name}: 0 rows")
            continue

        # Delete existing and insert into SQLite
        sqlite_cursor.execute(f'DELETE FROM "{table_name}"')

        # Build column names with proper quoting for SQLite
        quoted_cols = ", ".join(f'"{c}"' for c in columns)

        for row in rows:
            sqlite_cursor.execute(
                f'INSERT OR REPLACE INTO "{table_name}" ({quoted_cols}) VALUES ({placeholders})',
                row,
            )
        sqlite.commit()
        print(f"  {table_name}: {len(rows)} rows imported")

    mysql.close()
    sqlite.commit()
    sqlite.close()
    print("Import complete.")


if __name__ == "__main__":
    main()
