export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      AvvisiGruppo: {
        Row: {
          avviso_id: string
          dataora: string | null
          dataoraelimina: string | null
          dataorapubblicazione: string | null
          esito: string | null
          inviato: boolean | null
          messaggio: string | null
          tipoveicolo_id: string | null
          titolo: string | null
        }
        Insert: {
          avviso_id?: string
          dataora?: string | null
          dataoraelimina?: string | null
          dataorapubblicazione?: string | null
          esito?: string | null
          inviato?: boolean | null
          messaggio?: string | null
          tipoveicolo_id?: string | null
          titolo?: string | null
        }
        Update: {
          avviso_id?: string
          dataora?: string | null
          dataoraelimina?: string | null
          dataorapubblicazione?: string | null
          esito?: string | null
          inviato?: boolean | null
          messaggio?: string | null
          tipoveicolo_id?: string | null
          titolo?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "AvvisiGruppo_tipoveicolo_id_fkey"
            columns: ["tipoveicolo_id"]
            isOneToOne: false
            referencedRelation: "TipoVeicoli"
            referencedColumns: ["tipoveicolo_id"]
          },
          {
            foreignKeyName: "AvvisiGruppo_tipoveicolo_id_fkey"
            columns: ["tipoveicolo_id"]
            isOneToOne: false
            referencedRelation: "v_TipoVeicoli"
            referencedColumns: ["tipoveicolo_id"]
          },
        ]
      }
      CoincidenzaDi: {
        Row: {
          dataoraelimina: string | null
          descrizione: string
          inconcidenzadi_id: string
        }
        Insert: {
          dataoraelimina?: string | null
          descrizione: string
          inconcidenzadi_id?: string
        }
        Update: {
          dataoraelimina?: string | null
          descrizione?: string
          inconcidenzadi_id?: string
        }
        Relationships: []
      }
      Config: {
        Row: {
          adMobAdUnitId: string | null
          adMobAppId: string | null
          adMobEnabled: boolean | null
          admobidapp: string | null
          admobidpublisher: string | null
          adSenseAdSlot: string | null
          adSenseClientId: string | null
          adSenseEnabled: boolean | null
          batchsize: number | null
          batchthreshold: number | null
          clientsecret: string | null
          dataora: string | null
          dataoraelimina: string | null
          debug: boolean | null
          emailtest: string | null
          foglioconfig: string | null
          fogliomessaggi: string | null
          foglioutenti: string | null
          foglioveicoli: string | null
          frequenzaesecuzione: string | null
          googlechatwebhookurl: string | null
          intervallo: number | null
          interventistatoid: string | null
          inviamessaggireali: boolean | null
          loglevel: string | null
          numeroorefrequenzasincronizzazionepwa: number | null
          numerowhatsapptest: string | null
          orainvio: string | null
          soggettoemail: string | null
          telegrambottoken: string | null
          telegramchatid: string | null
          telegramchatidtest: string | null
          templateemail: string | null
          twilioaccountsid: string | null
          twilioauthtoken: string | null
          twiliophonenumber: string | null
          unit: string | null
          usanuovaversione: boolean | null
          valore: string | null
        }
        Insert: {
          adMobAdUnitId?: string | null
          adMobAppId?: string | null
          adMobEnabled?: boolean | null
          admobidapp?: string | null
          admobidpublisher?: string | null
          adSenseAdSlot?: string | null
          adSenseClientId?: string | null
          adSenseEnabled?: boolean | null
          batchsize?: number | null
          batchthreshold?: number | null
          clientsecret?: string | null
          dataora?: string | null
          dataoraelimina?: string | null
          debug?: boolean | null
          emailtest?: string | null
          foglioconfig?: string | null
          fogliomessaggi?: string | null
          foglioutenti?: string | null
          foglioveicoli?: string | null
          frequenzaesecuzione?: string | null
          googlechatwebhookurl?: string | null
          intervallo?: number | null
          interventistatoid?: string | null
          inviamessaggireali?: boolean | null
          loglevel?: string | null
          numeroorefrequenzasincronizzazionepwa?: number | null
          numerowhatsapptest?: string | null
          orainvio?: string | null
          soggettoemail?: string | null
          telegrambottoken?: string | null
          telegramchatid?: string | null
          telegramchatidtest?: string | null
          templateemail?: string | null
          twilioaccountsid?: string | null
          twilioauthtoken?: string | null
          twiliophonenumber?: string | null
          unit?: string | null
          usanuovaversione?: boolean | null
          valore?: string | null
        }
        Update: {
          adMobAdUnitId?: string | null
          adMobAppId?: string | null
          adMobEnabled?: boolean | null
          admobidapp?: string | null
          admobidpublisher?: string | null
          adSenseAdSlot?: string | null
          adSenseClientId?: string | null
          adSenseEnabled?: boolean | null
          batchsize?: number | null
          batchthreshold?: number | null
          clientsecret?: string | null
          dataora?: string | null
          dataoraelimina?: string | null
          debug?: boolean | null
          emailtest?: string | null
          foglioconfig?: string | null
          fogliomessaggi?: string | null
          foglioutenti?: string | null
          foglioveicoli?: string | null
          frequenzaesecuzione?: string | null
          googlechatwebhookurl?: string | null
          intervallo?: number | null
          interventistatoid?: string | null
          inviamessaggireali?: boolean | null
          loglevel?: string | null
          numeroorefrequenzasincronizzazionepwa?: number | null
          numerowhatsapptest?: string | null
          orainvio?: string | null
          soggettoemail?: string | null
          telegrambottoken?: string | null
          telegramchatid?: string | null
          telegramchatidtest?: string | null
          templateemail?: string | null
          twilioaccountsid?: string | null
          twilioauthtoken?: string | null
          twiliophonenumber?: string | null
          unit?: string | null
          usanuovaversione?: boolean | null
          valore?: string | null
        }
        Relationships: []
      }
      ControlliPeriodici: {
        Row: {
          akm: number | null
          amesi: number | null
          avvisogiorniprima: number | null
          avvisokmprima: number | null
          controlloperiodico_id: string
          dakm: number | null
          damesi: number | null
          dataora: string | null
          dataoraelimina: string | null
          descrizione: string | null
          frequenzakm: number | null
          frequenzamesi: number | null
          incoincidenzadi: string | null
          nomecontrollo: string | null
          operazione_id: string | null
          tipoveicolo_id: string | null
        }
        Insert: {
          akm?: number | null
          amesi?: number | null
          avvisogiorniprima?: number | null
          avvisokmprima?: number | null
          controlloperiodico_id?: string
          dakm?: number | null
          damesi?: number | null
          dataora?: string | null
          dataoraelimina?: string | null
          descrizione?: string | null
          frequenzakm?: number | null
          frequenzamesi?: number | null
          incoincidenzadi?: string | null
          nomecontrollo?: string | null
          operazione_id?: string | null
          tipoveicolo_id?: string | null
        }
        Update: {
          akm?: number | null
          amesi?: number | null
          avvisogiorniprima?: number | null
          avvisokmprima?: number | null
          controlloperiodico_id?: string
          dakm?: number | null
          damesi?: number | null
          dataora?: string | null
          dataoraelimina?: string | null
          descrizione?: string | null
          frequenzakm?: number | null
          frequenzamesi?: number | null
          incoincidenzadi?: string | null
          nomecontrollo?: string | null
          operazione_id?: string | null
          tipoveicolo_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ControlliPeriodici_incoincidenzadi_fkey"
            columns: ["incoincidenzadi"]
            isOneToOne: false
            referencedRelation: "CoincidenzaDi"
            referencedColumns: ["inconcidenzadi_id"]
          },
          {
            foreignKeyName: "ControlliPeriodici_incoincidenzadi_fkey"
            columns: ["incoincidenzadi"]
            isOneToOne: false
            referencedRelation: "v_CoincidenzaDi"
            referencedColumns: ["inconcidenzadi_id"]
          },
          {
            foreignKeyName: "ControlliPeriodici_operazione_id_fkey"
            columns: ["operazione_id"]
            isOneToOne: false
            referencedRelation: "Operazioni"
            referencedColumns: ["operazione_id"]
          },
          {
            foreignKeyName: "ControlliPeriodici_operazione_id_fkey"
            columns: ["operazione_id"]
            isOneToOne: false
            referencedRelation: "v_Operazioni"
            referencedColumns: ["operazione_id"]
          },
          {
            foreignKeyName: "ControlliPeriodici_tipoveicolo_id_fkey"
            columns: ["tipoveicolo_id"]
            isOneToOne: false
            referencedRelation: "TipoVeicoli"
            referencedColumns: ["tipoveicolo_id"]
          },
          {
            foreignKeyName: "ControlliPeriodici_tipoveicolo_id_fkey"
            columns: ["tipoveicolo_id"]
            isOneToOne: false
            referencedRelation: "v_TipoVeicoli"
            referencedColumns: ["tipoveicolo_id"]
          },
        ]
      }
      ImpostazioniTracking: {
        Row: {
          dataora: string | null
          dataoraelimina: string | null
          impostazione_id: string
          intervallo_aggiornamento_secondi: number | null
          notifica_fine_viaggio: boolean | null
          notifica_inizio_viaggio: boolean | null
          salva_percorso_gps: boolean | null
          tracking_automatico: boolean | null
          utente_id: string
          veicolo_id: string | null
        }
        Insert: {
          dataora?: string | null
          dataoraelimina?: string | null
          impostazione_id?: string
          intervallo_aggiornamento_secondi?: number | null
          notifica_fine_viaggio?: boolean | null
          notifica_inizio_viaggio?: boolean | null
          salva_percorso_gps?: boolean | null
          tracking_automatico?: boolean | null
          utente_id: string
          veicolo_id?: string | null
        }
        Update: {
          dataora?: string | null
          dataoraelimina?: string | null
          impostazione_id?: string
          intervallo_aggiornamento_secondi?: number | null
          notifica_fine_viaggio?: boolean | null
          notifica_inizio_viaggio?: boolean | null
          salva_percorso_gps?: boolean | null
          tracking_automatico?: boolean | null
          utente_id?: string
          veicolo_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ImpostazioniTracking_utente_id_fkey"
            columns: ["utente_id"]
            isOneToOne: false
            referencedRelation: "Utenti"
            referencedColumns: ["utente_id"]
          },
          {
            foreignKeyName: "ImpostazioniTracking_utente_id_fkey"
            columns: ["utente_id"]
            isOneToOne: false
            referencedRelation: "v_Utenti"
            referencedColumns: ["utente_id"]
          },
          {
            foreignKeyName: "ImpostazioniTracking_veicolo_id_fkey"
            columns: ["veicolo_id"]
            isOneToOne: false
            referencedRelation: "StatisticheVeicolo"
            referencedColumns: ["veicolo_id"]
          },
          {
            foreignKeyName: "ImpostazioniTracking_veicolo_id_fkey"
            columns: ["veicolo_id"]
            isOneToOne: false
            referencedRelation: "v_Veicoli"
            referencedColumns: ["veicolo_id"]
          },
          {
            foreignKeyName: "ImpostazioniTracking_veicolo_id_fkey"
            columns: ["veicolo_id"]
            isOneToOne: false
            referencedRelation: "Veicoli"
            referencedColumns: ["veicolo_id"]
          },
        ]
      }
      Interventi: {
        Row: {
          batchid: string | null
          controlloperiodico_id: string | null
          dataora: string | null
          dataoraelimina: string | null
          dataoraintervento: string | null
          descrizioneaggiuntiva: string | null
          interventistato_id: string | null
          intervento_id: string
          kmintervento: number | null
          mesi: number | null
          veicolo_id: string | null
        }
        Insert: {
          batchid?: string | null
          controlloperiodico_id?: string | null
          dataora?: string | null
          dataoraelimina?: string | null
          dataoraintervento?: string | null
          descrizioneaggiuntiva?: string | null
          interventistato_id?: string | null
          intervento_id?: string
          kmintervento?: number | null
          mesi?: number | null
          veicolo_id?: string | null
        }
        Update: {
          batchid?: string | null
          controlloperiodico_id?: string | null
          dataora?: string | null
          dataoraelimina?: string | null
          dataoraintervento?: string | null
          descrizioneaggiuntiva?: string | null
          interventistato_id?: string | null
          intervento_id?: string
          kmintervento?: number | null
          mesi?: number | null
          veicolo_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "Interventi_controlloperiodico_id_fkey"
            columns: ["controlloperiodico_id"]
            isOneToOne: false
            referencedRelation: "ControlliPeriodici"
            referencedColumns: ["controlloperiodico_id"]
          },
          {
            foreignKeyName: "Interventi_controlloperiodico_id_fkey"
            columns: ["controlloperiodico_id"]
            isOneToOne: false
            referencedRelation: "v_ControlliPeriodici"
            referencedColumns: ["controlloperiodico_id"]
          },
          {
            foreignKeyName: "Interventi_interventistato_id_fkey"
            columns: ["interventistato_id"]
            isOneToOne: false
            referencedRelation: "InterventiStato"
            referencedColumns: ["interventistato_id"]
          },
          {
            foreignKeyName: "Interventi_interventistato_id_fkey"
            columns: ["interventistato_id"]
            isOneToOne: false
            referencedRelation: "v_InterventiStato"
            referencedColumns: ["interventistato_id"]
          },
          {
            foreignKeyName: "Interventi_veicolo_id_fkey"
            columns: ["veicolo_id"]
            isOneToOne: false
            referencedRelation: "StatisticheVeicolo"
            referencedColumns: ["veicolo_id"]
          },
          {
            foreignKeyName: "Interventi_veicolo_id_fkey"
            columns: ["veicolo_id"]
            isOneToOne: false
            referencedRelation: "v_Veicoli"
            referencedColumns: ["veicolo_id"]
          },
          {
            foreignKeyName: "Interventi_veicolo_id_fkey"
            columns: ["veicolo_id"]
            isOneToOne: false
            referencedRelation: "Veicoli"
            referencedColumns: ["veicolo_id"]
          },
        ]
      }
      InterventiStato: {
        Row: {
          dataoraelimina: string | null
          descrizione: string
          interventistato_id: string
          inversione: boolean | null
          ispezione: boolean | null
          rabbocco: boolean | null
          sostituzione: boolean | null
        }
        Insert: {
          dataoraelimina?: string | null
          descrizione: string
          interventistato_id?: string
          inversione?: boolean | null
          ispezione?: boolean | null
          rabbocco?: boolean | null
          sostituzione?: boolean | null
        }
        Update: {
          dataoraelimina?: string | null
          descrizione?: string
          interventistato_id?: string
          inversione?: boolean | null
          ispezione?: boolean | null
          rabbocco?: boolean | null
          sostituzione?: boolean | null
        }
        Relationships: []
      }
      Logs: {
        Row: {
          batchid: string | null
          dataora: string | null
          dataoraelimina: string | null
          descrizione: string | null
          destinatario: string | null
          messaggio: string | null
          statoinvio: string | null
          tiponotifica: string | null
        }
        Insert: {
          batchid?: string | null
          dataora?: string | null
          dataoraelimina?: string | null
          descrizione?: string | null
          destinatario?: string | null
          messaggio?: string | null
          statoinvio?: string | null
          tiponotifica?: string | null
        }
        Update: {
          batchid?: string | null
          dataora?: string | null
          dataoraelimina?: string | null
          descrizione?: string | null
          destinatario?: string | null
          messaggio?: string | null
          statoinvio?: string | null
          tiponotifica?: string | null
        }
        Relationships: []
      }
      MessaggiAvviso: {
        Row: {
          batchid: string | null
          dataora: string | null
          dataoraelimina: string | null
          intervento_id: string | null
          inviato: boolean | null
          messaggio_id: string
          messaggiocomposto: string | null
          statoinvio: string | null
          testo: string | null
          utente_id: string | null
          veicolo_id: string | null
        }
        Insert: {
          batchid?: string | null
          dataora?: string | null
          dataoraelimina?: string | null
          intervento_id?: string | null
          inviato?: boolean | null
          messaggio_id?: string
          messaggiocomposto?: string | null
          statoinvio?: string | null
          testo?: string | null
          utente_id?: string | null
          veicolo_id?: string | null
        }
        Update: {
          batchid?: string | null
          dataora?: string | null
          dataoraelimina?: string | null
          intervento_id?: string | null
          inviato?: boolean | null
          messaggio_id?: string
          messaggiocomposto?: string | null
          statoinvio?: string | null
          testo?: string | null
          utente_id?: string | null
          veicolo_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "MessaggiAvviso_intervento_id_fkey"
            columns: ["intervento_id"]
            isOneToOne: false
            referencedRelation: "Interventi"
            referencedColumns: ["intervento_id"]
          },
          {
            foreignKeyName: "MessaggiAvviso_intervento_id_fkey"
            columns: ["intervento_id"]
            isOneToOne: false
            referencedRelation: "v_Interventi"
            referencedColumns: ["intervento_id"]
          },
          {
            foreignKeyName: "MessaggiAvviso_utente_id_fkey"
            columns: ["utente_id"]
            isOneToOne: false
            referencedRelation: "Utenti"
            referencedColumns: ["utente_id"]
          },
          {
            foreignKeyName: "MessaggiAvviso_utente_id_fkey"
            columns: ["utente_id"]
            isOneToOne: false
            referencedRelation: "v_Utenti"
            referencedColumns: ["utente_id"]
          },
          {
            foreignKeyName: "MessaggiAvviso_veicolo_id_fkey"
            columns: ["veicolo_id"]
            isOneToOne: false
            referencedRelation: "StatisticheVeicolo"
            referencedColumns: ["veicolo_id"]
          },
          {
            foreignKeyName: "MessaggiAvviso_veicolo_id_fkey"
            columns: ["veicolo_id"]
            isOneToOne: false
            referencedRelation: "v_Veicoli"
            referencedColumns: ["veicolo_id"]
          },
          {
            foreignKeyName: "MessaggiAvviso_veicolo_id_fkey"
            columns: ["veicolo_id"]
            isOneToOne: false
            referencedRelation: "Veicoli"
            referencedColumns: ["veicolo_id"]
          },
        ]
      }
      Operazioni: {
        Row: {
          dataoraelimina: string | null
          descrizione: string
          inversione: boolean | null
          ispezione: boolean | null
          operazione_id: string
          rabbocco: boolean | null
          sostituzione: boolean | null
        }
        Insert: {
          dataoraelimina?: string | null
          descrizione: string
          inversione?: boolean | null
          ispezione?: boolean | null
          operazione_id?: string
          rabbocco?: boolean | null
          sostituzione?: boolean | null
        }
        Update: {
          dataoraelimina?: string | null
          descrizione?: string
          inversione?: boolean | null
          ispezione?: boolean | null
          operazione_id?: string
          rabbocco?: boolean | null
          sostituzione?: boolean | null
        }
        Relationships: []
      }
      SessioniUtilizzo: {
        Row: {
          dataora: string | null
          dataora_fine: string | null
          dataora_inizio: string
          dataoraelimina: string | null
          durata_minuti: number | null
          km_finali: number | null
          km_iniziali: number | null
          km_percorsi: number | null
          note: string | null
          posizione_fine_lat: number | null
          posizione_fine_lng: number | null
          posizione_inizio_lat: number | null
          posizione_inizio_lng: number | null
          sessione_attiva: boolean | null
          sessione_id: string
          utente_id: string
          veicolo_id: string
        }
        Insert: {
          dataora?: string | null
          dataora_fine?: string | null
          dataora_inizio: string
          dataoraelimina?: string | null
          durata_minuti?: number | null
          km_finali?: number | null
          km_iniziali?: number | null
          km_percorsi?: number | null
          note?: string | null
          posizione_fine_lat?: number | null
          posizione_fine_lng?: number | null
          posizione_inizio_lat?: number | null
          posizione_inizio_lng?: number | null
          sessione_attiva?: boolean | null
          sessione_id?: string
          utente_id: string
          veicolo_id: string
        }
        Update: {
          dataora?: string | null
          dataora_fine?: string | null
          dataora_inizio?: string
          dataoraelimina?: string | null
          durata_minuti?: number | null
          km_finali?: number | null
          km_iniziali?: number | null
          km_percorsi?: number | null
          note?: string | null
          posizione_fine_lat?: number | null
          posizione_fine_lng?: number | null
          posizione_inizio_lat?: number | null
          posizione_inizio_lng?: number | null
          sessione_attiva?: boolean | null
          sessione_id?: string
          utente_id?: string
          veicolo_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "SessioniUtilizzo_utente_id_fkey"
            columns: ["utente_id"]
            isOneToOne: false
            referencedRelation: "Utenti"
            referencedColumns: ["utente_id"]
          },
          {
            foreignKeyName: "SessioniUtilizzo_utente_id_fkey"
            columns: ["utente_id"]
            isOneToOne: false
            referencedRelation: "v_Utenti"
            referencedColumns: ["utente_id"]
          },
          {
            foreignKeyName: "SessioniUtilizzo_veicolo_id_fkey"
            columns: ["veicolo_id"]
            isOneToOne: false
            referencedRelation: "StatisticheVeicolo"
            referencedColumns: ["veicolo_id"]
          },
          {
            foreignKeyName: "SessioniUtilizzo_veicolo_id_fkey"
            columns: ["veicolo_id"]
            isOneToOne: false
            referencedRelation: "v_Veicoli"
            referencedColumns: ["veicolo_id"]
          },
          {
            foreignKeyName: "SessioniUtilizzo_veicolo_id_fkey"
            columns: ["veicolo_id"]
            isOneToOne: false
            referencedRelation: "Veicoli"
            referencedColumns: ["veicolo_id"]
          },
        ]
      }
      TipoNotificaAvviso: {
        Row: {
          dataoraelimina: string | null
          descrizione: string
          tiponotificaavviso_id: string
        }
        Insert: {
          dataoraelimina?: string | null
          descrizione: string
          tiponotificaavviso_id?: string
        }
        Update: {
          dataoraelimina?: string | null
          descrizione?: string
          tiponotificaavviso_id?: string
        }
        Relationships: []
      }
      TipoVeicoli: {
        Row: {
          dataoraelimina: string | null
          descrizione: string
          tipoveicolo_id: string
        }
        Insert: {
          dataoraelimina?: string | null
          descrizione: string
          tipoveicolo_id?: string
        }
        Update: {
          dataoraelimina?: string | null
          descrizione?: string
          tipoveicolo_id?: string
        }
        Relationships: []
      }
      TrackingGPS: {
        Row: {
          dataora: string | null
          direzione: number | null
          latitude: number
          longitude: number
          precisione: number | null
          sessione_id: string
          tracking_id: string
          velocita: number | null
        }
        Insert: {
          dataora?: string | null
          direzione?: number | null
          latitude: number
          longitude: number
          precisione?: number | null
          sessione_id: string
          tracking_id?: string
          velocita?: number | null
        }
        Update: {
          dataora?: string | null
          direzione?: number | null
          latitude?: number
          longitude?: number
          precisione?: number | null
          sessione_id?: string
          tracking_id?: string
          velocita?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "TrackingGPS_sessione_id_fkey"
            columns: ["sessione_id"]
            isOneToOne: false
            referencedRelation: "SessioniUtilizzo"
            referencedColumns: ["sessione_id"]
          },
        ]
      }
      Utenti: {
        Row: {
          abilitagps: boolean | null
          dataora: string | null
          dataoradisabilita: string | null
          dataoraelimina: string | null
          email: string | null
          frequenzaoregps: number | null
          nomeutente: string
          phone: string | null
          profiloutente_id: string | null
          pwd: string | null
          statoutente_id: string | null
          telegramchatid: string | null
          tiponotificaavviso_id: string | null
          utente_id: string
        }
        Insert: {
          abilitagps?: boolean | null
          dataora?: string | null
          dataoradisabilita?: string | null
          dataoraelimina?: string | null
          email?: string | null
          frequenzaoregps?: number | null
          nomeutente: string
          phone?: string | null
          profiloutente_id?: string | null
          pwd?: string | null
          statoutente_id?: string | null
          telegramchatid?: string | null
          tiponotificaavviso_id?: string | null
          utente_id?: string
        }
        Update: {
          abilitagps?: boolean | null
          dataora?: string | null
          dataoradisabilita?: string | null
          dataoraelimina?: string | null
          email?: string | null
          frequenzaoregps?: number | null
          nomeutente?: string
          phone?: string | null
          profiloutente_id?: string | null
          pwd?: string | null
          statoutente_id?: string | null
          telegramchatid?: string | null
          tiponotificaavviso_id?: string | null
          utente_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "Utenti_profiloutente_id_fkey"
            columns: ["profiloutente_id"]
            isOneToOne: false
            referencedRelation: "UtentiProfilo"
            referencedColumns: ["profiloutente_id"]
          },
          {
            foreignKeyName: "Utenti_profiloutente_id_fkey"
            columns: ["profiloutente_id"]
            isOneToOne: false
            referencedRelation: "v_UtentiProfilo"
            referencedColumns: ["profiloutente_id"]
          },
          {
            foreignKeyName: "Utenti_statoutente_id_fkey"
            columns: ["statoutente_id"]
            isOneToOne: false
            referencedRelation: "UtentiStato"
            referencedColumns: ["utentestato_id"]
          },
          {
            foreignKeyName: "Utenti_statoutente_id_fkey"
            columns: ["statoutente_id"]
            isOneToOne: false
            referencedRelation: "v_UtentiStato"
            referencedColumns: ["utentestato_id"]
          },
          {
            foreignKeyName: "Utenti_tiponotificaavviso_id_fkey"
            columns: ["tiponotificaavviso_id"]
            isOneToOne: false
            referencedRelation: "TipoNotificaAvviso"
            referencedColumns: ["tiponotificaavviso_id"]
          },
          {
            foreignKeyName: "Utenti_tiponotificaavviso_id_fkey"
            columns: ["tiponotificaavviso_id"]
            isOneToOne: false
            referencedRelation: "v_TipoNotificaAvviso"
            referencedColumns: ["tiponotificaavviso_id"]
          },
        ]
      }
      UtentiProfilo: {
        Row: {
          dataora: string | null
          dataoraelimina: string | null
          profiloutente: string
          profiloutente_id: string
        }
        Insert: {
          dataora?: string | null
          dataoraelimina?: string | null
          profiloutente: string
          profiloutente_id?: string
        }
        Update: {
          dataora?: string | null
          dataoraelimina?: string | null
          profiloutente?: string
          profiloutente_id?: string
        }
        Relationships: []
      }
      UtentiStato: {
        Row: {
          dataora: string | null
          dataoraelimina: string | null
          statoutente: string
          utentestato_id: string
        }
        Insert: {
          dataora?: string | null
          dataoraelimina?: string | null
          statoutente: string
          utentestato_id?: string
        }
        Update: {
          dataora?: string | null
          dataoraelimina?: string | null
          statoutente?: string
          utentestato_id?: string
        }
        Relationships: []
      }
      Veicoli: {
        Row: {
          cilindrata: number | null
          dataimmatricolazione: string | null
          dataora: string | null
          dataoraelimina: string | null
          kmanno: number | null
          kmannodataorainserimento: string | null
          kmattuali: number | null
          kmattualidataorainserimento: string | null
          kmdagps: number | null
          kmdagpsdataorainserimento: string | null
          kmeffettivi: number | null
          kmeffettividataorainserimento: string | null
          kmpresunti: number | null
          kmpresuntidataorainserimento: string | null
          kw: number | null
          nomeveicolo: string | null
          sessione_attiva_id: string | null
          targa: string | null
          tipoveicolo_id: string | null
          ultimo_aggiornamento_tracking: string | null
          utente_id: string | null
          veicolo_id: string
        }
        Insert: {
          cilindrata?: number | null
          dataimmatricolazione?: string | null
          dataora?: string | null
          dataoraelimina?: string | null
          kmanno?: number | null
          kmannodataorainserimento?: string | null
          kmattuali?: number | null
          kmattualidataorainserimento?: string | null
          kmdagps?: number | null
          kmdagpsdataorainserimento?: string | null
          kmeffettivi?: number | null
          kmeffettividataorainserimento?: string | null
          kmpresunti?: number | null
          kmpresuntidataorainserimento?: string | null
          kw?: number | null
          nomeveicolo?: string | null
          sessione_attiva_id?: string | null
          targa?: string | null
          tipoveicolo_id?: string | null
          ultimo_aggiornamento_tracking?: string | null
          utente_id?: string | null
          veicolo_id?: string
        }
        Update: {
          cilindrata?: number | null
          dataimmatricolazione?: string | null
          dataora?: string | null
          dataoraelimina?: string | null
          kmanno?: number | null
          kmannodataorainserimento?: string | null
          kmattuali?: number | null
          kmattualidataorainserimento?: string | null
          kmdagps?: number | null
          kmdagpsdataorainserimento?: string | null
          kmeffettivi?: number | null
          kmeffettividataorainserimento?: string | null
          kmpresunti?: number | null
          kmpresuntidataorainserimento?: string | null
          kw?: number | null
          nomeveicolo?: string | null
          sessione_attiva_id?: string | null
          targa?: string | null
          tipoveicolo_id?: string | null
          ultimo_aggiornamento_tracking?: string | null
          utente_id?: string | null
          veicolo_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "Veicoli_sessione_attiva_fkey"
            columns: ["sessione_attiva_id"]
            isOneToOne: false
            referencedRelation: "SessioniUtilizzo"
            referencedColumns: ["sessione_id"]
          },
          {
            foreignKeyName: "Veicoli_tipoveicolo_id_fkey"
            columns: ["tipoveicolo_id"]
            isOneToOne: false
            referencedRelation: "TipoVeicoli"
            referencedColumns: ["tipoveicolo_id"]
          },
          {
            foreignKeyName: "Veicoli_tipoveicolo_id_fkey"
            columns: ["tipoveicolo_id"]
            isOneToOne: false
            referencedRelation: "v_TipoVeicoli"
            referencedColumns: ["tipoveicolo_id"]
          },
          {
            foreignKeyName: "Veicoli_utente_id_fkey"
            columns: ["utente_id"]
            isOneToOne: false
            referencedRelation: "Utenti"
            referencedColumns: ["utente_id"]
          },
          {
            foreignKeyName: "Veicoli_utente_id_fkey"
            columns: ["utente_id"]
            isOneToOne: false
            referencedRelation: "v_Utenti"
            referencedColumns: ["utente_id"]
          },
        ]
      }
    }
    Views: {
      StatisticheVeicolo: {
        Row: {
          km_totali_tracciati: number | null
          kmattuali: number | null
          media_km_per_viaggio: number | null
          media_minuti_per_viaggio: number | null
          minuti_totali_utilizzo: number | null
          nomeveicolo: string | null
          numero_viaggi: number | null
          targa: string | null
          ultimo_utilizzo: string | null
          veicolo_id: string | null
        }
        Relationships: []
      }
      v_AvvisiGruppo: {
        Row: {
          avviso_id: string | null
          dataora: string | null
          dataoraelimina: string | null
          dataorapubblicazione: string | null
          esito: string | null
          inviato: boolean | null
          messaggio: string | null
          tipoveicolo_id: string | null
          titolo: string | null
        }
        Insert: {
          avviso_id?: string | null
          dataora?: string | null
          dataoraelimina?: string | null
          dataorapubblicazione?: string | null
          esito?: string | null
          inviato?: boolean | null
          messaggio?: string | null
          tipoveicolo_id?: string | null
          titolo?: string | null
        }
        Update: {
          avviso_id?: string | null
          dataora?: string | null
          dataoraelimina?: string | null
          dataorapubblicazione?: string | null
          esito?: string | null
          inviato?: boolean | null
          messaggio?: string | null
          tipoveicolo_id?: string | null
          titolo?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "AvvisiGruppo_tipoveicolo_id_fkey"
            columns: ["tipoveicolo_id"]
            isOneToOne: false
            referencedRelation: "TipoVeicoli"
            referencedColumns: ["tipoveicolo_id"]
          },
          {
            foreignKeyName: "AvvisiGruppo_tipoveicolo_id_fkey"
            columns: ["tipoveicolo_id"]
            isOneToOne: false
            referencedRelation: "v_TipoVeicoli"
            referencedColumns: ["tipoveicolo_id"]
          },
        ]
      }
      v_CoincidenzaDi: {
        Row: {
          dataoraelimina: string | null
          descrizione: string | null
          inconcidenzadi_id: string | null
        }
        Insert: {
          dataoraelimina?: string | null
          descrizione?: string | null
          inconcidenzadi_id?: string | null
        }
        Update: {
          dataoraelimina?: string | null
          descrizione?: string | null
          inconcidenzadi_id?: string | null
        }
        Relationships: []
      }
      v_Config: {
        Row: {
          admobidapp: string | null
          admobidpublisher: string | null
          batchsize: number | null
          batchthreshold: number | null
          clientsecret: string | null
          dataora: string | null
          dataoraelimina: string | null
          debug: boolean | null
          emailtest: string | null
          foglioconfig: string | null
          fogliomessaggi: string | null
          foglioutenti: string | null
          foglioveicoli: string | null
          frequenzaesecuzione: string | null
          googlechatwebhookurl: string | null
          intervallo: number | null
          interventistatoid: string | null
          inviamessaggireali: boolean | null
          loglevel: string | null
          numeroorefrequenzasincronizzazionepwa: number | null
          numerowhatsapptest: string | null
          orainvio: string | null
          soggettoemail: string | null
          telegrambottoken: string | null
          telegramchatid: string | null
          telegramchatidtest: string | null
          templateemail: string | null
          twilioaccountsid: string | null
          twilioauthtoken: string | null
          twiliophonenumber: string | null
          unit: string | null
          usanuovaversione: boolean | null
          valore: string | null
        }
        Insert: {
          admobidapp?: string | null
          admobidpublisher?: string | null
          batchsize?: number | null
          batchthreshold?: number | null
          clientsecret?: string | null
          dataora?: string | null
          dataoraelimina?: string | null
          debug?: boolean | null
          emailtest?: string | null
          foglioconfig?: string | null
          fogliomessaggi?: string | null
          foglioutenti?: string | null
          foglioveicoli?: string | null
          frequenzaesecuzione?: string | null
          googlechatwebhookurl?: string | null
          intervallo?: number | null
          interventistatoid?: string | null
          inviamessaggireali?: boolean | null
          loglevel?: string | null
          numeroorefrequenzasincronizzazionepwa?: number | null
          numerowhatsapptest?: string | null
          orainvio?: string | null
          soggettoemail?: string | null
          telegrambottoken?: string | null
          telegramchatid?: string | null
          telegramchatidtest?: string | null
          templateemail?: string | null
          twilioaccountsid?: string | null
          twilioauthtoken?: string | null
          twiliophonenumber?: string | null
          unit?: string | null
          usanuovaversione?: boolean | null
          valore?: string | null
        }
        Update: {
          admobidapp?: string | null
          admobidpublisher?: string | null
          batchsize?: number | null
          batchthreshold?: number | null
          clientsecret?: string | null
          dataora?: string | null
          dataoraelimina?: string | null
          debug?: boolean | null
          emailtest?: string | null
          foglioconfig?: string | null
          fogliomessaggi?: string | null
          foglioutenti?: string | null
          foglioveicoli?: string | null
          frequenzaesecuzione?: string | null
          googlechatwebhookurl?: string | null
          intervallo?: number | null
          interventistatoid?: string | null
          inviamessaggireali?: boolean | null
          loglevel?: string | null
          numeroorefrequenzasincronizzazionepwa?: number | null
          numerowhatsapptest?: string | null
          orainvio?: string | null
          soggettoemail?: string | null
          telegrambottoken?: string | null
          telegramchatid?: string | null
          telegramchatidtest?: string | null
          templateemail?: string | null
          twilioaccountsid?: string | null
          twilioauthtoken?: string | null
          twiliophonenumber?: string | null
          unit?: string | null
          usanuovaversione?: boolean | null
          valore?: string | null
        }
        Relationships: []
      }
      v_ControlliPeriodici: {
        Row: {
          akm: number | null
          amesi: number | null
          avvisogiorniprima: number | null
          avvisokmprima: number | null
          controlloperiodico_id: string | null
          dakm: number | null
          damesi: number | null
          dataora: string | null
          dataoraelimina: string | null
          descrizione: string | null
          frequenzakm: number | null
          frequenzamesi: number | null
          incoincidenzadi: string | null
          nomecontrollo: string | null
          operazione_id: string | null
          tipoveicolo_id: string | null
        }
        Insert: {
          akm?: number | null
          amesi?: number | null
          avvisogiorniprima?: number | null
          avvisokmprima?: number | null
          controlloperiodico_id?: string | null
          dakm?: number | null
          damesi?: number | null
          dataora?: string | null
          dataoraelimina?: string | null
          descrizione?: string | null
          frequenzakm?: number | null
          frequenzamesi?: number | null
          incoincidenzadi?: string | null
          nomecontrollo?: string | null
          operazione_id?: string | null
          tipoveicolo_id?: string | null
        }
        Update: {
          akm?: number | null
          amesi?: number | null
          avvisogiorniprima?: number | null
          avvisokmprima?: number | null
          controlloperiodico_id?: string | null
          dakm?: number | null
          damesi?: number | null
          dataora?: string | null
          dataoraelimina?: string | null
          descrizione?: string | null
          frequenzakm?: number | null
          frequenzamesi?: number | null
          incoincidenzadi?: string | null
          nomecontrollo?: string | null
          operazione_id?: string | null
          tipoveicolo_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ControlliPeriodici_incoincidenzadi_fkey"
            columns: ["incoincidenzadi"]
            isOneToOne: false
            referencedRelation: "CoincidenzaDi"
            referencedColumns: ["inconcidenzadi_id"]
          },
          {
            foreignKeyName: "ControlliPeriodici_incoincidenzadi_fkey"
            columns: ["incoincidenzadi"]
            isOneToOne: false
            referencedRelation: "v_CoincidenzaDi"
            referencedColumns: ["inconcidenzadi_id"]
          },
          {
            foreignKeyName: "ControlliPeriodici_operazione_id_fkey"
            columns: ["operazione_id"]
            isOneToOne: false
            referencedRelation: "Operazioni"
            referencedColumns: ["operazione_id"]
          },
          {
            foreignKeyName: "ControlliPeriodici_operazione_id_fkey"
            columns: ["operazione_id"]
            isOneToOne: false
            referencedRelation: "v_Operazioni"
            referencedColumns: ["operazione_id"]
          },
          {
            foreignKeyName: "ControlliPeriodici_tipoveicolo_id_fkey"
            columns: ["tipoveicolo_id"]
            isOneToOne: false
            referencedRelation: "TipoVeicoli"
            referencedColumns: ["tipoveicolo_id"]
          },
          {
            foreignKeyName: "ControlliPeriodici_tipoveicolo_id_fkey"
            columns: ["tipoveicolo_id"]
            isOneToOne: false
            referencedRelation: "v_TipoVeicoli"
            referencedColumns: ["tipoveicolo_id"]
          },
        ]
      }
      v_Interventi: {
        Row: {
          batchid: string | null
          controlloperiodico_id: string | null
          dataora: string | null
          dataoraelimina: string | null
          dataoraintervento: string | null
          descrizioneaggiuntiva: string | null
          interventistato_id: string | null
          intervento_id: string | null
          kmintervento: number | null
          mesi: number | null
          veicolo_id: string | null
        }
        Insert: {
          batchid?: string | null
          controlloperiodico_id?: string | null
          dataora?: string | null
          dataoraelimina?: string | null
          dataoraintervento?: string | null
          descrizioneaggiuntiva?: string | null
          interventistato_id?: string | null
          intervento_id?: string | null
          kmintervento?: number | null
          mesi?: number | null
          veicolo_id?: string | null
        }
        Update: {
          batchid?: string | null
          controlloperiodico_id?: string | null
          dataora?: string | null
          dataoraelimina?: string | null
          dataoraintervento?: string | null
          descrizioneaggiuntiva?: string | null
          interventistato_id?: string | null
          intervento_id?: string | null
          kmintervento?: number | null
          mesi?: number | null
          veicolo_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "Interventi_controlloperiodico_id_fkey"
            columns: ["controlloperiodico_id"]
            isOneToOne: false
            referencedRelation: "ControlliPeriodici"
            referencedColumns: ["controlloperiodico_id"]
          },
          {
            foreignKeyName: "Interventi_controlloperiodico_id_fkey"
            columns: ["controlloperiodico_id"]
            isOneToOne: false
            referencedRelation: "v_ControlliPeriodici"
            referencedColumns: ["controlloperiodico_id"]
          },
          {
            foreignKeyName: "Interventi_interventistato_id_fkey"
            columns: ["interventistato_id"]
            isOneToOne: false
            referencedRelation: "InterventiStato"
            referencedColumns: ["interventistato_id"]
          },
          {
            foreignKeyName: "Interventi_interventistato_id_fkey"
            columns: ["interventistato_id"]
            isOneToOne: false
            referencedRelation: "v_InterventiStato"
            referencedColumns: ["interventistato_id"]
          },
          {
            foreignKeyName: "Interventi_veicolo_id_fkey"
            columns: ["veicolo_id"]
            isOneToOne: false
            referencedRelation: "StatisticheVeicolo"
            referencedColumns: ["veicolo_id"]
          },
          {
            foreignKeyName: "Interventi_veicolo_id_fkey"
            columns: ["veicolo_id"]
            isOneToOne: false
            referencedRelation: "v_Veicoli"
            referencedColumns: ["veicolo_id"]
          },
          {
            foreignKeyName: "Interventi_veicolo_id_fkey"
            columns: ["veicolo_id"]
            isOneToOne: false
            referencedRelation: "Veicoli"
            referencedColumns: ["veicolo_id"]
          },
        ]
      }
      v_InterventiStato: {
        Row: {
          dataoraelimina: string | null
          descrizione: string | null
          interventistato_id: string | null
          inversione: boolean | null
          ispezione: boolean | null
          rabbocco: boolean | null
          sostituzione: boolean | null
        }
        Insert: {
          dataoraelimina?: string | null
          descrizione?: string | null
          interventistato_id?: string | null
          inversione?: boolean | null
          ispezione?: boolean | null
          rabbocco?: boolean | null
          sostituzione?: boolean | null
        }
        Update: {
          dataoraelimina?: string | null
          descrizione?: string | null
          interventistato_id?: string | null
          inversione?: boolean | null
          ispezione?: boolean | null
          rabbocco?: boolean | null
          sostituzione?: boolean | null
        }
        Relationships: []
      }
      v_Logs: {
        Row: {
          batchid: string | null
          dataora: string | null
          dataoraelimina: string | null
          descrizione: string | null
          destinatario: string | null
          messaggio: string | null
          statoinvio: string | null
          tiponotifica: string | null
        }
        Insert: {
          batchid?: string | null
          dataora?: string | null
          dataoraelimina?: string | null
          descrizione?: string | null
          destinatario?: string | null
          messaggio?: string | null
          statoinvio?: string | null
          tiponotifica?: string | null
        }
        Update: {
          batchid?: string | null
          dataora?: string | null
          dataoraelimina?: string | null
          descrizione?: string | null
          destinatario?: string | null
          messaggio?: string | null
          statoinvio?: string | null
          tiponotifica?: string | null
        }
        Relationships: []
      }
      v_MessaggiAvviso: {
        Row: {
          batchid: string | null
          dataora: string | null
          dataoraelimina: string | null
          intervento_id: string | null
          inviato: boolean | null
          messaggio_id: string | null
          messaggiocomposto: string | null
          statoinvio: string | null
          testo: string | null
          utente_id: string | null
          veicolo_id: string | null
        }
        Insert: {
          batchid?: string | null
          dataora?: string | null
          dataoraelimina?: string | null
          intervento_id?: string | null
          inviato?: boolean | null
          messaggio_id?: string | null
          messaggiocomposto?: string | null
          statoinvio?: string | null
          testo?: string | null
          utente_id?: string | null
          veicolo_id?: string | null
        }
        Update: {
          batchid?: string | null
          dataora?: string | null
          dataoraelimina?: string | null
          intervento_id?: string | null
          inviato?: boolean | null
          messaggio_id?: string | null
          messaggiocomposto?: string | null
          statoinvio?: string | null
          testo?: string | null
          utente_id?: string | null
          veicolo_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "MessaggiAvviso_intervento_id_fkey"
            columns: ["intervento_id"]
            isOneToOne: false
            referencedRelation: "Interventi"
            referencedColumns: ["intervento_id"]
          },
          {
            foreignKeyName: "MessaggiAvviso_intervento_id_fkey"
            columns: ["intervento_id"]
            isOneToOne: false
            referencedRelation: "v_Interventi"
            referencedColumns: ["intervento_id"]
          },
          {
            foreignKeyName: "MessaggiAvviso_utente_id_fkey"
            columns: ["utente_id"]
            isOneToOne: false
            referencedRelation: "Utenti"
            referencedColumns: ["utente_id"]
          },
          {
            foreignKeyName: "MessaggiAvviso_utente_id_fkey"
            columns: ["utente_id"]
            isOneToOne: false
            referencedRelation: "v_Utenti"
            referencedColumns: ["utente_id"]
          },
          {
            foreignKeyName: "MessaggiAvviso_veicolo_id_fkey"
            columns: ["veicolo_id"]
            isOneToOne: false
            referencedRelation: "StatisticheVeicolo"
            referencedColumns: ["veicolo_id"]
          },
          {
            foreignKeyName: "MessaggiAvviso_veicolo_id_fkey"
            columns: ["veicolo_id"]
            isOneToOne: false
            referencedRelation: "v_Veicoli"
            referencedColumns: ["veicolo_id"]
          },
          {
            foreignKeyName: "MessaggiAvviso_veicolo_id_fkey"
            columns: ["veicolo_id"]
            isOneToOne: false
            referencedRelation: "Veicoli"
            referencedColumns: ["veicolo_id"]
          },
        ]
      }
      v_Operazioni: {
        Row: {
          dataoraelimina: string | null
          descrizione: string | null
          inversione: boolean | null
          ispezione: boolean | null
          operazione_id: string | null
          rabbocco: boolean | null
          sostituzione: boolean | null
        }
        Insert: {
          dataoraelimina?: string | null
          descrizione?: string | null
          inversione?: boolean | null
          ispezione?: boolean | null
          operazione_id?: string | null
          rabbocco?: boolean | null
          sostituzione?: boolean | null
        }
        Update: {
          dataoraelimina?: string | null
          descrizione?: string | null
          inversione?: boolean | null
          ispezione?: boolean | null
          operazione_id?: string | null
          rabbocco?: boolean | null
          sostituzione?: boolean | null
        }
        Relationships: []
      }
      v_TipoNotificaAvviso: {
        Row: {
          dataoraelimina: string | null
          descrizione: string | null
          tiponotificaavviso_id: string | null
        }
        Insert: {
          dataoraelimina?: string | null
          descrizione?: string | null
          tiponotificaavviso_id?: string | null
        }
        Update: {
          dataoraelimina?: string | null
          descrizione?: string | null
          tiponotificaavviso_id?: string | null
        }
        Relationships: []
      }
      v_TipoVeicoli: {
        Row: {
          dataoraelimina: string | null
          descrizione: string | null
          tipoveicolo_id: string | null
        }
        Insert: {
          dataoraelimina?: string | null
          descrizione?: string | null
          tipoveicolo_id?: string | null
        }
        Update: {
          dataoraelimina?: string | null
          descrizione?: string | null
          tipoveicolo_id?: string | null
        }
        Relationships: []
      }
      v_Utenti: {
        Row: {
          abilitagps: boolean | null
          dataora: string | null
          dataoradisabilita: string | null
          dataoraelimina: string | null
          email: string | null
          frequenzaoregps: number | null
          nomeutente: string | null
          phone: string | null
          profiloutente_id: string | null
          pwd: string | null
          statoutente_id: string | null
          telegramchatid: string | null
          tiponotificaavviso_id: string | null
          utente_id: string | null
        }
        Insert: {
          abilitagps?: boolean | null
          dataora?: string | null
          dataoradisabilita?: string | null
          dataoraelimina?: string | null
          email?: string | null
          frequenzaoregps?: number | null
          nomeutente?: string | null
          phone?: string | null
          profiloutente_id?: string | null
          pwd?: string | null
          statoutente_id?: string | null
          telegramchatid?: string | null
          tiponotificaavviso_id?: string | null
          utente_id?: string | null
        }
        Update: {
          abilitagps?: boolean | null
          dataora?: string | null
          dataoradisabilita?: string | null
          dataoraelimina?: string | null
          email?: string | null
          frequenzaoregps?: number | null
          nomeutente?: string | null
          phone?: string | null
          profiloutente_id?: string | null
          pwd?: string | null
          statoutente_id?: string | null
          telegramchatid?: string | null
          tiponotificaavviso_id?: string | null
          utente_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "Utenti_profiloutente_id_fkey"
            columns: ["profiloutente_id"]
            isOneToOne: false
            referencedRelation: "UtentiProfilo"
            referencedColumns: ["profiloutente_id"]
          },
          {
            foreignKeyName: "Utenti_profiloutente_id_fkey"
            columns: ["profiloutente_id"]
            isOneToOne: false
            referencedRelation: "v_UtentiProfilo"
            referencedColumns: ["profiloutente_id"]
          },
          {
            foreignKeyName: "Utenti_statoutente_id_fkey"
            columns: ["statoutente_id"]
            isOneToOne: false
            referencedRelation: "UtentiStato"
            referencedColumns: ["utentestato_id"]
          },
          {
            foreignKeyName: "Utenti_statoutente_id_fkey"
            columns: ["statoutente_id"]
            isOneToOne: false
            referencedRelation: "v_UtentiStato"
            referencedColumns: ["utentestato_id"]
          },
          {
            foreignKeyName: "Utenti_tiponotificaavviso_id_fkey"
            columns: ["tiponotificaavviso_id"]
            isOneToOne: false
            referencedRelation: "TipoNotificaAvviso"
            referencedColumns: ["tiponotificaavviso_id"]
          },
          {
            foreignKeyName: "Utenti_tiponotificaavviso_id_fkey"
            columns: ["tiponotificaavviso_id"]
            isOneToOne: false
            referencedRelation: "v_TipoNotificaAvviso"
            referencedColumns: ["tiponotificaavviso_id"]
          },
        ]
      }
      v_UtentiProfilo: {
        Row: {
          dataora: string | null
          dataoraelimina: string | null
          profiloutente: string | null
          profiloutente_id: string | null
        }
        Insert: {
          dataora?: string | null
          dataoraelimina?: string | null
          profiloutente?: string | null
          profiloutente_id?: string | null
        }
        Update: {
          dataora?: string | null
          dataoraelimina?: string | null
          profiloutente?: string | null
          profiloutente_id?: string | null
        }
        Relationships: []
      }
      v_UtentiStato: {
        Row: {
          dataora: string | null
          dataoraelimina: string | null
          statoutente: string | null
          utentestato_id: string | null
        }
        Insert: {
          dataora?: string | null
          dataoraelimina?: string | null
          statoutente?: string | null
          utentestato_id?: string | null
        }
        Update: {
          dataora?: string | null
          dataoraelimina?: string | null
          statoutente?: string | null
          utentestato_id?: string | null
        }
        Relationships: []
      }
      v_Veicoli: {
        Row: {
          cilindrata: number | null
          dataimmatricolazione: string | null
          dataora: string | null
          dataoraelimina: string | null
          kmanno: number | null
          kmannodataorainserimento: string | null
          kmattuali: number | null
          kmattualidataorainserimento: string | null
          kmdagps: number | null
          kmdagpsdataorainserimento: string | null
          kmeffettivi: number | null
          kmeffettividataorainserimento: string | null
          kmpresunti: number | null
          kmpresuntidataorainserimento: string | null
          kw: number | null
          nomeveicolo: string | null
          targa: string | null
          tipoveicolo_id: string | null
          utente_id: string | null
          veicolo_id: string | null
        }
        Insert: {
          cilindrata?: number | null
          dataimmatricolazione?: string | null
          dataora?: string | null
          dataoraelimina?: string | null
          kmanno?: number | null
          kmannodataorainserimento?: string | null
          kmattuali?: number | null
          kmattualidataorainserimento?: string | null
          kmdagps?: number | null
          kmdagpsdataorainserimento?: string | null
          kmeffettivi?: number | null
          kmeffettividataorainserimento?: string | null
          kmpresunti?: number | null
          kmpresuntidataorainserimento?: string | null
          kw?: number | null
          nomeveicolo?: string | null
          targa?: string | null
          tipoveicolo_id?: string | null
          utente_id?: string | null
          veicolo_id?: string | null
        }
        Update: {
          cilindrata?: number | null
          dataimmatricolazione?: string | null
          dataora?: string | null
          dataoraelimina?: string | null
          kmanno?: number | null
          kmannodataorainserimento?: string | null
          kmattuali?: number | null
          kmattualidataorainserimento?: string | null
          kmdagps?: number | null
          kmdagpsdataorainserimento?: string | null
          kmeffettivi?: number | null
          kmeffettividataorainserimento?: string | null
          kmpresunti?: number | null
          kmpresuntidataorainserimento?: string | null
          kw?: number | null
          nomeveicolo?: string | null
          targa?: string | null
          tipoveicolo_id?: string | null
          utente_id?: string | null
          veicolo_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "Veicoli_tipoveicolo_id_fkey"
            columns: ["tipoveicolo_id"]
            isOneToOne: false
            referencedRelation: "TipoVeicoli"
            referencedColumns: ["tipoveicolo_id"]
          },
          {
            foreignKeyName: "Veicoli_tipoveicolo_id_fkey"
            columns: ["tipoveicolo_id"]
            isOneToOne: false
            referencedRelation: "v_TipoVeicoli"
            referencedColumns: ["tipoveicolo_id"]
          },
          {
            foreignKeyName: "Veicoli_utente_id_fkey"
            columns: ["utente_id"]
            isOneToOne: false
            referencedRelation: "Utenti"
            referencedColumns: ["utente_id"]
          },
          {
            foreignKeyName: "Veicoli_utente_id_fkey"
            columns: ["utente_id"]
            isOneToOne: false
            referencedRelation: "v_Utenti"
            referencedColumns: ["utente_id"]
          },
        ]
      }
    }
    Functions: {
      check_manutenzioni_complete: {
        Args: Record<PropertyKey, never>
        Returns: {
          messaggio: string
          tipo_notifica: string
          utente_id: string
          veicolo_id: string
        }[]
      }
      generate_uuid_text: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      is_admin: {
        Args: { user_id: string }
        Returns: boolean
      }
      uuid_generate_v1: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      uuid_generate_v1mc: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      uuid_generate_v3: {
        Args: { name: string; namespace: string }
        Returns: string
      }
      uuid_generate_v4: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      uuid_generate_v5: {
        Args: { name: string; namespace: string }
        Returns: string
      }
      uuid_nil: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      uuid_ns_dns: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      uuid_ns_oid: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      uuid_ns_url: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      uuid_ns_x500: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
