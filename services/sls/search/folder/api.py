from flask import Flask, jsonify
import logging

from search.opensearch import index, client, search


app = Flask(__name__)

app.logger.setLevel(logging.INFO)

# include /admin and /findtalent, /company routes
from routes import admin, admin_v3, findtalent, company


@app.after_request
def apply_nocache(resp):
    resp.headers["Cache-Control"] = "no-store"
    return resp


@app.get('/api/v2search/health')
def test_health():
    query = {
        'size': 0,
        'query': {
            'multi_match': {
                'query': "Bolster",
                'fields': ['FullName']
            }
        }
    }

    response, status_code, err = search(
        body=query,
        index=index,
    )

    if err is not None:
        return jsonify(err="health check query failed"), status_code

    health = client.cluster.health()

    return jsonify(cluster_health=health.get("status"), index=index, query_results=response)
