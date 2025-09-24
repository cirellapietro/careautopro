#!/usr/bin/env python3
import os
import re
import subprocess

def run_command(cmd):
    """Esegue un comando shell e restituisce l'output"""
    try:
        result = subprocess.run(cmd, shell=True, capture_output=True, text=True)
        return result.stdout, result.stderr, result.returncode
    except Exception as e:
        return "", str(e), 1

def fix_table_references():
    print("🔍 Correggo i riferimenti alle tabelle...")
    
    # Lista delle correzioni
    corrections = [
        ('Veicoli', 'veicoli'),
        ('Interventi', 'interventi'),
        ('TrackingGPS', 'trackinggps'),
        ('Utenti', 'utenti'),
        ('Manutenzioni', 'manutenzioni'),
        ('InterventiStato', 'interventistato'),
        ('UtentiProfilo', 'utentiprofilo'),
        ('UtentiStato', 'utentistato'),
        ('TipoVeicoli', 'tipoveicoli')
    ]
    
    total_fixes = 0
    files_modified = []
    
    # Cerca in tutti i file .tsx, .ts, .js, .jsx
    for root, dirs, files in os.walk('src'):
        for file in files:
            if file.endswith(('.tsx', '.ts', '.js', '.jsx')):
                file_path = os.path.join(root, file)
                fixes = fix_file(file_path, corrections)
                if fixes > 0:
                    total_fixes += fixes
                    files_modified.append(file_path)
    
    print(f"✅ Fatte {total_fixes} correzioni in {len(files_modified)} file")
    return files_modified, total_fixes

def fix_file(file_path, corrections):
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original_content = content
        fixes = 0
        
        for old_name, new_name in corrections:
            # Cerca .from('Nome') e .from("Nome")
            patterns = [
                (f"\\.from\\(['\"]{old_name}['\"]\\)", f".from('{new_name}')"),
                (f'\\.from\\(["\']{old_name}["\']\\)', f'.from("{new_name}")')
            ]
            
            for pattern, replacement in patterns:
                content, count = re.subn(pattern, content, replacement)
                fixes += count
        
        if fixes > 0:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"✅ {file_path} - {fixes} correzioni")
        
        return fixes
        
    except Exception as e:
        print(f"❌ Errore in {file_path}: {e}")
        return 0

def git_commit_and_push(files_modified, total_fixes):
    """Esegue commit e push automatici"""
    print("🚀 Eseguo commit e push...")
    
    # Aggiungi tutti i file modificati
    stdout, stderr, code = run_command("git add .")
    if code != 0:
        print(f"❌ Errore git add: {stderr}")
        return False
    
    # Commit
    commit_message = f"fix: correct {total_fixes} table references to lowercase"
    stdout, stderr, code = run_command(f'git commit -m "{commit_message}"')
    if code != 0:
        print(f"❌ Errore git commit: {stderr}")
        return False
    
    # Push
    stdout, stderr, code = run_command("git push")
    if code != 0:
        print(f"❌ Errore git push: {stderr}")
        return False
    
    print("✅ Commit e push completati con successo!")
    return True

def main():
    print("🚀 Avvio correzione automatica tabelle...")
    
    # 1. Correggi i file
    files_modified, total_fixes = fix_table_references()
    
    if total_fixes == 0:
        print("ℹ️  Nessuna correzione necessaria")
        return
    
    # 2. Commit e push
    success = git_commit_and_push(files_modified, total_fixes)
    
    if success:
        print(f"🎉 Operazione completata!")
        print(f"📊 File modificati: {len(files_modified)}")
        print(f"📊 Correzioni totali: {total_fixes}")
        print("🌐 Vercel avvierà automaticamente il deploy")
    else:
        print("❌ Errore nel commit/push. Esegui manualmente:")
        print("git add .")
        print('git commit -m "fix: table names"')
        print("git push")

if __name__ == "__main__":
    main()
