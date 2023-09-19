import logging
import os
from functools import wraps

from auth.handlers import (exchange_auth_code_for_tokens_handler,
                           reset_cognito_password, send_forgot_password,
                           set_refresh_cookie, sign_up, signout,
                           token_refresh_handler)
from exceptions.exceptions import (InvalidUsage,
                                   MissingEnvironmentVariableException)
from filters.jwt import jwt_auth
from flask import Flask, abort, jsonify, request
from validate_auth_migrate import validate_one_time_migration
from validate_reset_password import validate_reset_password
from validate_signup import validate_signup
from validation.validation import password_validation

app = Flask(__name__)

app.logger.setLevel(logging.INFO)

for key in [
    "AUTH_CLIENTID",
    "AUTH_SERVICE",
    "VUE_APP_BOLSTER_DOMAIN",
    "VUE_APP_BOLSTER_AUTH_DOMAIN"
]:
    if key not in os.environ:
        raise MissingEnvironmentVariableException(key)


######
# Auth
######
def auth():
    def decorated(f):
        @wraps(f)
        def wrapper(*args, **kwargs):

            if not jwt_auth():
                abort(401)

            return f(*args, **kwargs)
        return wrapper
    return decorated


#############
# Middleware
#############


@app.after_request
def apply_nocache(resp):
    resp.headers['Cache-Control'] = 'no-store'
    return resp

################
# Error Handlers
################


@app.errorhandler(InvalidUsage)
def handle_invalid_usage(error):
    response = jsonify(error.to_dict())
    response.status_code = error.status_code
    return response

#########
# Routes
#########


@app.route("/api/auth/code", methods=["POST"])
def auth_code_exchange():
    return exchange_auth_code_for_tokens_handler()


@app.route("/api/auth/token/refresh", methods=["POST"])
def token_refresh():
    return token_refresh_handler()


@app.route("/api/auth/token/storage", methods=["POST"])
@auth()
def token_storage():
    return set_refresh_cookie()


@app.route("/api/auth/token/invalidate", methods=["POST"])
def token_invalidate():
    return signout()


@app.route("/api/auth/forgot-password", methods=["POST"])
def forgot_password():
    return send_forgot_password(email=request.json.get('email'))


@app.route("/api/auth/signup", methods=["PUT"])
def signup():
    errors = validate_signup(request=request)

    if not request.json or errors is not None:
        raise InvalidUsage(errors)

    password = request.json.get('password', '')

    error = password_validation(password=password)

    if error:
        return jsonify(error=error), 400

    return sign_up(email=request.json.get('email', ''), password=password)


@app.route("/api/auth/reset-password", methods=["POST"])
def reset_password():
    errors = validate_reset_password(request=request)

    if not request.json or errors is not None:
        raise InvalidUsage(errors)

    password = request.json.get('password', '')

    error = password_validation(password=password)

    if error:
        return jsonify(error=error), 400

    return reset_cognito_password(
        email=request.json.get('email', ''),
        password=password,
        confirmation_code=request.json.get('code', ''),
    )
