#!/usr/bin/env python3
# -*- coding: utf-8 -*-

from gps_tracker import Config, Client
from datetime import datetime, date, timezone, timedelta
from geopy.distance import geodesic
import json

# --- CONSTANTES À ADAPTER ---
USERNAME      = "julie.d@linkee.co"
PASSWORD      = "Linkee2e"
BATCH_SIZE    = 5000           # points max par appel API
PAUSE_VIT_KMH = 5              # seuil pause en km/h
PAUSE_MIN_SEC = 5 * 60         # pause minimale = 5 minutes

def generer_bilan(veh_index, date_bilan):
    """
    Récupère l'historique GPS pour le traceur numéro veh_index
    sur la date date_bilan, et renvoie un JSON résumé.

    Args:
        veh_index (int)         : index dans cli.get_trackers()
        date_bilan (date|str)   : date ou 'YYYY-MM-DD'

    Returns:
        str : JSON avec :
            - numero_vehicule
            - date
            - km_total
            - temps_total_sec
            - arrets : liste d'objets { position, heure_debut, heure_fin, duree_sec }
            - heure_debut_mouvement
            - heure_fin_mouvement
    """
    # ---- normaliser date ----
    if isinstance(date_bilan, str):
        date_bilan = datetime.strptime(date_bilan, "%Y-%m-%d").date()
    jour  = date_bilan
    debut = datetime(jour.year, jour.month, jour.day, 0, 0, 0, tzinfo=timezone.utc)
    fin   = debut + timedelta(days=1) - timedelta(seconds=1)

    # ---- connexion et traceur ----
    cfg      = Config(username=USERNAME, password=PASSWORD)
    cli      = Client(cfg)
    trackers = cli.get_trackers()
    if not 0 <= veh_index < len(trackers):
        raise IndexError(f"veh_index {veh_index} hors de portée")
    tracker = trackers[veh_index]
    numero  = getattr(tracker, "name", tracker.id)

    # ---- récupération des points ----
    points, curseur = [], debut
    while True:
        batch = cli.get_locations(
            device=tracker,
            not_before=curseur,
            not_after=fin,
            max_count=BATCH_SIZE
        )
        if not batch:
            break
        points.extend(batch)
        nouvelle = batch[-1].datetime - timedelta(seconds=1)
        if nouvelle <= curseur:
            break
        curseur = nouvelle

    if len(points) < 2:
        raise RuntimeError("Pas assez de points pour calculer un trajet.")
    points.sort(key=lambda p: p.datetime)

    # ---- calcul km et durées ----
    distances, durees = [], []
    for p0, p1 in zip(points, points[1:]):
        distances.append(geodesic((p0.lat, p0.lng), (p1.lat, p1.lng)).km)
        durees.append((p1.datetime - p0.datetime).total_seconds())
    km_total  = sum(distances)
    tps_total = sum(durees)

    # ---- début et fin de mouvement ----
    seuil_ms   = PAUSE_VIT_KMH * 1000 / 3600
    idxs_mouv  = [i for i, (km, sec) in enumerate(zip(distances, durees))
                  if sec > 0 and (km * 1000 / sec) >= seuil_ms]
    if idxs_mouv:
        idx_deb = idxs_mouv[0]
        heure_debut_mouvement = points[idx_deb].datetime.isoformat()
        idx_fin = idxs_mouv[-1] + 1
        heure_fin_mouvement = (points[idx_fin].datetime.isoformat()
                               if idx_fin < len(points) else points[-1].datetime.isoformat())
    else:
        heure_debut_mouvement = None
        heure_fin_mouvement   = None

    # ---- détection des arrêts ----
    arrets, pause_deb = [], None
    for idx, ((km, sec), p0, p1) in enumerate(zip(zip(distances, durees), points, points[1:])):
        vitesse = (km * 1000) / sec if sec > 0 else 0
        if vitesse < seuil_ms:
            if pause_deb is None:
                pause_deb = idx
            pause_fin = idx
        else:
            if pause_deb is not None:
                # si durée pause suffisante
                dur = sum(durees[pause_deb:pause_fin+1])
                if dur >= PAUSE_MIN_SEC:
                    # heure début : point p0 du début de pause
                    h_deb = points[pause_deb].datetime.isoformat()
                    # heure fin : point p1 du dernier intervalle pause
                    h_fin = points[pause_fin+1].datetime.isoformat()
                    loc   = points[pause_deb]
                    arrets.append({
                        "position":    {"lat": loc.lat, "lng": loc.lng},
                        "heure_debut": h_deb,
                        "heure_fin":   h_fin,
                        "duree_sec":   int(dur)
                    })
                pause_deb = None
    # dernier arrêt éventuel
    if pause_deb is not None:
        dur = sum(durees[pause_deb:pause_fin+1])
        if dur >= PAUSE_MIN_SEC:
            h_deb = points[pause_deb].datetime.isoformat()
            h_fin = points[pause_fin+1].datetime.isoformat() \
                    if pause_fin+1 < len(points) else points[-1].datetime.isoformat()
            loc   = points[pause_deb]
            arrets.append({
                "position":    {"lat": loc.lat, "lng": loc.lng},
                "heure_debut": h_deb,
                "heure_fin":   h_fin,
                "duree_sec":   int(dur)
            })

    # ---- construire le JSON ----
    bilan = {
        "numero_vehicule":         numero,
        "date":                    jour.isoformat(),
        "km_total":                round(km_total, 2),
        "temps_total_sec":         int(tps_total),
        "arrets":                  arrets,
        "heure_debut_mouvement":   heure_debut_mouvement,
        "heure_fin_mouvement":     heure_fin_mouvement
    }
    return json.dumps(bilan, ensure_ascii=False, indent=2)


if __name__ == "__main__":
    print(generer_bilan(veh_index=2, date_bilan="2025-06-23"))
