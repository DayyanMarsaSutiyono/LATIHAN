from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import os
from datetime import datetime
try:
    from PIL import Image
    import pytesseract
    OCR_AVAILABLE = True
except Exception:
    OCR_AVAILABLE = False

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), 'uploads')
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

DEMO_USERS = {
    'sopir': {'password': 'sopir123', 'role': 'sopir', 'displayName': 'Sopir'},
    'user': {'password': 'user123', 'role': 'user', 'displayName': 'User'}
}

COORDS = {
    'pusat': (-6.2088, 106.8456),
    'pelabuhan': (-6.1256, 106.9613),
    'industri': (-6.2450, 106.9000),
    'airport': (-6.1256, 106.6590),
    'mall': (-6.2200, 106.8400),
    'luar': (-6.5000, 106.9000)
}


@app.route('/api/login', methods=['POST'])
def api_login():
    data = request.get_json() or {}
    username = data.get('username')
    password = data.get('password')
    user = DEMO_USERS.get(username)
    if user and user.get('password') == password:
        return jsonify({'ok': True, 'user': {'username': username, 'role': user['role'], 'displayName': user['displayName']}})
    return jsonify({'ok': False, 'error': 'Invalid credentials'}), 401


@app.route('/api/upload', methods=['POST'])
def api_upload():
    if 'file' not in request.files:
        return jsonify({'ok': False, 'error': 'no file part'}), 400

    f = request.files['file']
    if f.filename == '':
        return jsonify({'ok': False, 'error': 'empty filename'}), 400

    timestamp = datetime.utcnow().strftime('%Y%m%d%H%M%S')
    safe_name = f"{timestamp}_{f.filename}"
    path = os.path.join(UPLOAD_FOLDER, safe_name)
    f.save(path)

    return jsonify({'ok': True, 'filename': safe_name, 'url': f'/api/uploads/{safe_name}'})


@app.route('/api/uploads/<path:filename>')
def serve_upload(filename):
    return send_from_directory(UPLOAD_FOLDER, filename)


@app.route('/api/detect', methods=['POST'])
def api_detect():
    if 'file' not in request.files:
        return jsonify({'ok': False, 'error': 'no file part'}), 400

    f = request.files['file']
    try:
        if OCR_AVAILABLE:
            img = Image.open(f.stream)
            text = pytesseract.image_to_string(img, lang='eng+ind')
            text = text.strip()
        else:
            text = ''
        return jsonify({'ok': True, 'text': text})
    except Exception as e:
        return jsonify({'ok': False, 'error': str(e)}), 500


@app.route('/api/recommend-route', methods=['POST'])
def recommend_route():
    data = request.get_json() or {}
    origin = data.get('origin') or 'pusat'
    destination = data.get('destination') or 'pelabuhan'
    weight = data.get('weightCategory') or '10-20'
    truck_type = data.get('truckType') or 'box'

    o_coords = COORDS.get(origin, COORDS['pusat'])
    d_coords = COORDS.get(destination, COORDS['pelabuhan'])

    # Simple heuristic: heavier loads reduce safety score on fast routes
    weight_score = {'5-10': 1.0, '10-20': 0.9, '20-30': 0.7, '30+': 0.4}
    wfactor = weight_score.get(weight, 0.8)

    # Create two candidate routes: safe (detour) and fast (direct)
    mid_safe = ((o_coords[0] + d_coords[0]) / 2 + 0.02, (o_coords[1] + d_coords[1]) / 2 - 0.02)
    direct = [o_coords, d_coords]
    safe = [o_coords, mid_safe, d_coords]

    # Score calculation: safe route benefits heavy trucks
    direct_length = ((o_coords[0]-d_coords[0])**2 + (o_coords[1]-d_coords[1])**2)**0.5
    safe_length = ((o_coords[0]-mid_safe[0])**2 + (o_coords[1]-mid_safe[1])**2)**0.5 + ((mid_safe[0]-d_coords[0])**2 + (mid_safe[1]-d_coords[1])**2)**0.5

    # Safety score between 0 and 1
    direct_score = max(0.1, min(1.0, 0.8 * wfactor - 0.2 * (direct_length / (safe_length + 0.0001))))
    safe_score = max(0.1, min(1.0, 0.9 * (1.0 - (1.0 - wfactor) * 0.5)))

    routes = [
        {'name': 'Rute Langsung (Cepat)', 'coords': [{'lat': p[0], 'lng': p[1]} for p in direct], 'score': round(direct_score, 2), 'advice': 'Cepat tetapi mungkin kurang aman untuk muatan berat.'},
        {'name': 'Rute Aman (Direkomendasikan)', 'coords': [{'lat': p[0], 'lng': p[1]} for p in safe], 'score': round(safe_score, 2), 'advice': 'Lebih aman untuk truk berat, menghindari zona sempit dan tanjakan.'}
    ]

    # Choose recommended index by comparing scores (prefer higher score)
    recommended_idx = 0 if routes[0]['score'] >= routes[1]['score'] else 1

    return jsonify({'ok': True, 'recommended': recommended_idx, 'routes': routes})


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
