from flask import Flask, request, jsonify
import traceback
from generer_bilan import generer_bilan  # ou approp.

app = Flask(__name__)
API_TOKEN = "VOTRE_TOKEN"

@app.route('/bilan', methods=['GET'])
def bilan():
    try:
        token = request.args.get('token')
        if token != API_TOKEN:
            return jsonify({"error":"Unauthorized"}), 401

        veh = int(request.args.get('veh_index', 0))
        date_str = request.args.get('date')
        result = generer_bilan(veh, date_str)
        return app.response_class(result, mimetype='application/json')

    except Exception as e:
        # on capture la stack entière
        tb = traceback.format_exc()
        return jsonify({
            "error": "Exception levée pendant le traitement",
            "traceback": tb
        }), 500
