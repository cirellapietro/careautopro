#!/usr/bin/env python3
"""
Script per sostituire automaticamente i nomi delle tabelle in minuscolo
in tutti i file .tsx, .ts, .js, .jsx del progetto
"""

import os
import re
from pathlib import Path

# Lista delle tabelle da sostituire (vecchio -> nuovo)
TABLE_REPLACEMENTS = {
    # Tabelle principali
    'Veicoli': 'veicoli',
    'Interventi': 'interventi',
    'InterventiStato': 'interventistato',
    'TrackingGPS': 'trackinggps',
    'Utenti': 'utenti',
    'UtentiProfilo': 'utentiprofilo',
    'UtentiStato': 'utentistato',
    'TipoVeicoli': 'tipoveicoli',
    'Manutenzioni': 'manutenzioni',
    'AvvisiGruppo': 'avvisigruppo',
    'Config': 'config',
    'Logs': 'logs',
    'Operazioni': 'operazioni',
    
    # Viste (iniziano con v_)
    'v_Veicoli': 'v_veicoli',
    'v_Interventi': 'v_interventi',
    'v_Utenti': 'v_utenti',
    'v_TipoVeicoli': 'v_tipoveicoli'
}

def replace_in_file(file_path):
    """Sostituisce i nomi delle tabelle in un singolo file"""
    try:
        with open(file_path, 'r', encoding='utf-8') as file:
            content = file.read()
        
        original_content = content
        replacements_count = 0
        
        # Sostituisce tutte le occorrenze
        for old_name, new_name in TABLE_REPLACEMENTS.items():
            # Cerca .from('NomeTabella') e .from("NomeTabella")
            pattern1 = f"\\.from\\(['\"]{old_name}['\"]\\)"
            replacement1 = f".from('{new_name}')"
            
            pattern2 = f"\\.from\\(['\"]{old_name}['\"]\\)"
            replacement2 = f'.from("{new_name}")'
            
            # Sostituisce
            content, count1 = re.subn(pattern1, replacement1, content)
            content, count2 = re.subn(pattern2, replacement2, content)
            replacements_count += count1 + count2
        
        if replacements_count > 0:
            with open(file_path, 'w', encoding='utf-8') as file:
                file.write(content)
            print(f"✅ Sostituite {replacements_count} occorrenze in {file_path}")
            return replacements_count
        
        return 0
        
    except Exception as e:
        print(f"❌ Errore in {file_path}: {e}")
        return 0

def main():
    """Funzione principale"""
    print("🔍 Cerco e sostituisco i nomi delle tabelle...")
    
    # Cartelle da scansionare
    folders_to_scan = ['src', 'components', 'pages', 'hooks', 'services', 'utils']
    
    total_replacements = 0
    files_processed = 0
    
    for folder in folders_to_scan:
        if not os.path.exists(folder):
            continue
            
        for root, dirs, files in os.walk(folder):
            for file in files:
                if file.endswith(('.tsx', '.ts', '.js', '.jsx')):
                    file_path = os.path.join(root, file)
                    replacements = replace_in_file(file_path)
                    total_replacements += replacements
                    if replacements > 0:
                        files_processed += 1
    
    print(f"\n🎉 Operazione completata!")
    print(f"📊 File modificati: {files_processed}")
    print(f"📊 Totale sostituzioni: {total_replacements}")
    print(f"📋 Tabelle sostituite: {list(TABLE_REPLACEMENTS.keys())}")

if __name__ == "__main__":
    main()
