import os

# Die Liste aller Codedateien, die wir bündeln wollen.
# 'data.js' ist auskommentiert, da diese Datei sehr groß ist und sich fast nie ändert.
# Wenn Sie dort doch einmal etwas anpassen, entfernen Sie einfach das '#' vor "data.js".
files_to_bundle = [
    "index.html", 
    "styles.css", 
    # "data.js",  
    "state.js", 
    "utils.js", 
    "audio.js", 
    "timer.js", 
    "adhd.js", 
    "app.js"
]

output_file = "flow_code_bundle.txt"

try:
    # Erstellt oder überschreibt die zusammengefasste Textdatei
    with open(output_file, "w", encoding="utf-8") as outfile:
        for filename in files_to_bundle:
            if os.path.exists(filename):
                outfile.write(f"--- START OF FILE {filename} ---\n\n")
                with open(filename, "r", encoding="utf-8") as infile:
                    outfile.write(infile.read())
                outfile.write("\n\n--- END OF FILE ---\n\n")
            else:
                print(f"Hinweis: '{filename}' wurde im Ordner nicht gefunden.")
                
    print(f"\nErfolgreich! Die Datei '{output_file}' wurde erstellt.")
    print("Sie können jetzt einfach den Inhalt dieser Datei kopieren und hochladen.")
except Exception as e:
    print(f"Fehler beim Bündeln der Dateien: {e}")