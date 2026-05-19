from flask import Flask, request, jsonify, send_from_directory
import os
import json
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

app = Flask(__name__, static_folder=os.path.join(os.path.dirname(__file__), '..', 'web'), static_url_path='')

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_PATH = os.path.join(BASE_DIR, 'data', 'qa.json')

def load_qa(path):
    with open(path, 'r', encoding='utf-8') as f:
        return json.load(f)

qa_pairs = load_qa(DATA_PATH)
questions = [item['q'] for item in qa_pairs]
answers = [item['a'] for item in qa_pairs]

vectorizer = TfidfVectorizer().fit(questions)
q_vectors = vectorizer.transform(questions)

@app.route('/')
def index():
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/ask', methods=['POST'])
def ask():
    data = request.get_json(force=True)
    q = data.get('question', '')
    if not q:
        return jsonify({'error': 'No question provided'}), 400

    q_vec = vectorizer.transform([q])
    sims = cosine_similarity(q_vec, q_vectors)[0]
    best_idx = int(sims.argmax())
    score = float(sims[best_idx])

    threshold = 0.1
    if score < threshold:
        return jsonify({'answer': 'Maaf, saya tidak menemukan jawaban yang sesuai.', 'score': score})

    return jsonify({'answer': answers[best_idx], 'score': score})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
