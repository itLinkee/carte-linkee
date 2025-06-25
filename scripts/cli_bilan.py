#!/usr/bin/env python3
# cli_bilan.py

import sys
import argparse
from generer_bilan import generer_bilan

def main():
    parser = argparse.ArgumentParser(description="Génère le bilan GPS et imprime le JSON")
    parser.add_argument("--veh_index", type=int, required=True, help="Index du véhicule")
    parser.add_argument("--date",      type=str, required=True, help="Date au format YYYY-MM-DD")
    args = parser.parse_args()

    # Appelle ta fonction et récupère le JSON
    bilan_json = generer_bilan(args.veh_index, args.date)
    # Imprime-le à stdout
    sys.stdout.write(bilan_json)

if __name__ == "__main__":
    main()
