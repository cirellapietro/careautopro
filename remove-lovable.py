import os
import re

def remove_lovable_references(root_dir):
    """Rimuove tutti i riferimenti a Lovable dal progetto"""
    
    # Pattern per trovare riferimenti Lovable
    patterns = [
        r'lovable', 
        r'Lovable',
        r'LOVABLE'
    ]
    
    files_modified = 0
    
    for root, dirs, files in os.walk(root_dir):
        # Esclude node_modules e altre cartelle non necessarie
        dirs[:] = [d for d in dirs if d not in ['node_modules', '.git', 'dist']]
        
        for file in files:
            if file.endswith(('.js', '.jsx', '.ts', '.tsx', '.json', '.html', '.md')):
                file_path = os.path.join(root, file)
                
                try:
                    with open(file_path, 'r', encoding='utf-8') as f:
                        content = f.read()
                    
                    original_content = content
                    
                    # Sostituisce tutti i riferimenti Lovable
                    for pattern in patterns:
                        content = re.sub(pattern, 'CareAutoPro', content)
                    
                    # Sostituisce descrizioni specifiche
                    content = re.sub(
                        r'Gestione veicoli e manutenzioni', 
                        'CareAutoPro - Gestione completa della tua flotta veicoli', 
                        content
                    )
                    
                    if content != original_content:
                        with open(file_path, 'w', encoding='utf-8') as f:
                            f.write(content)
                        print(f"✅ Modificato: {file_path}")
                        files_modified += 1
                        
                except Exception as e:
                    print(f"❌ Errore in {file_path}: {e}")
    
    print(f"\n🎉 Completato! File modificati: {files_modified}")

def update_package_json(root_dir):
    """Aggiorna package.json con informazioni CareAutoPro"""
    package_path = os.path.join(root_dir, 'package.json')
    
    if os.path.exists(package_path):
        try:
            with open(package_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Aggiorna le informazioni del progetto
            content = re.sub(
                r'"name": "[^"]*"',
                '"name": "careautopro"', 
                content
            )
            content = re.sub(
                r'"description": "[^"]*"',
                '"description": "CareAutoPro - Gestione completa della tua flotta veicoli"', 
                content
            )
            
            with open(package_path, 'w', encoding='utf-8') as f:
                f.write(content)
            
            print("✅ package.json aggiornato!")
            
        except Exception as e:
            print(f"❌ Errore aggiornamento package.json: {e}")

if __name__ == "__main__":
    project_root = input("Inserisci il percorso del progetto: ").strip()
    
    if not os.path.exists(project_root):
        print("❌ Percorso non valido!")
        exit(1)
    
    print("🔄 Rimozione riferimenti Lovable...")
    remove_lovable_references(project_root)
    
    print("\n🔄 Aggiornamento package.json...")
    update_package_json(project_root)
    
    print("\n🎉 Tutti i riferimenti Lovable sono stati rimossi!")
    print("📝 Ricorda di:")
    print("   - Verificare manualmente i file modificati")
    print("   - Sostituire eventuali immagini/logo Lovable")
    print("   - Testare il build del progetto")
