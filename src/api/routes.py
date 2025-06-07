"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint, current_app 
from api.models import db, User
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity 
from datetime import timedelta 

api = Blueprint('api', __name__)


CORS(api)


@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200

@api.route('/signup', methods=['POST'])
def sign_up():
    try:
        name = request.json.get("name")
        last_name = request.json.get("last_name")
        direction = request.json.get("direction")
        email = request.json.get("email")
        password = request.json.get("password")

        if not name or not last_name or not direction or not email or not password:
            return jsonify({"msg": "Debes llenar todos los campos del formulario"}), 400

        user = User.query.filter_by(email=email).first()
        if user:
            return jsonify({"msg": "El correo utilizado ya existe"}), 400

        password_hash = current_app.BCRYPT.generate_password_hash(password).decode("utf-8")

        new_user = User(
            name=name,
            last_name=last_name,
            direction=direction,
            email=email,
            password=password_hash,
            is_active=True
        )

        db.session.add(new_user)
        db.session.commit()

        return jsonify({"msg": "Usuario creado exitosamente", "user": new_user.serialize()}), 201

    except Exception as e:
        print(f"Error during signup: {e}")
        return jsonify({"msg": f"Error interno del servidor: {str(e)}"}), 500

@api.route('/login', methods=['POST'])
def login():
    try:
        email = request.json.get("email")
        password = request.json.get("password")

        if not email or not password:
            return jsonify({"msg": "Debes ingresar todos los datos del formulario"}), 400

        user = User.query.filter_by(email=email).first()

        if not user or not current_app.BCRYPT.check_password_hash(user.password, password):
            return jsonify({"msg": "Email o contraseña incorrectos"}), 401

       
        access_token = create_access_token(identity=str(user.id), expires_delta=timedelta(hours=24))

        return jsonify({
            "msg": "Inicio de sesión exitoso",
            "access_token": access_token,
            "user": user.serialize()
        }), 200

    except Exception as e:
        print(f"Error durante el login: {e}")
        return jsonify({"msg": f"Error interno del servidor: {str(e)}"}), 500

@api.route('/dashboard', methods=['GET'])
@jwt_required()
def dashboard():
    try:
        current_user_id = get_jwt_identity()
       
        current_user_id = int(current_user_id)

        user = User.query.get(current_user_id)
        if not user:
            return jsonify({"msg": "Usuario no encontrado"}), 404

        response_body = {
            "message": f"Bienvenido a tu dashboard, {user.email}",
            "user_id": current_user_id,
            "user_email": user.email,
        }
        return jsonify(response_body), 200

    except Exception as e:
        print(f"Error al acceder al dashboard: {e}")
        return jsonify({"msg": f"Error interno del servidor al acceder al dashboard: {str(e)}"}), 500
