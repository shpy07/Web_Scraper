from flask import Flask, jsonify
import json
import os

app = Flask(__name__)

file_path = os.path.join(os.path.dirname(__file__), '../scraper/data/scraped_data.json')

@app.route('/')
def serve_data():
    try:
        with open(file_path, 'r', encoding='utf-8') as file:
            data = json.load(file)
        return jsonify(data)
    except FileNotFoundError:
        return jsonify({"error": "Scraped data not found"}), 404

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
