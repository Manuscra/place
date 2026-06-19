"""Authentication routes."""

from functools import wraps

from flask import Blueprint, current_app, flash, redirect, render_template, request, session, url_for
from pydantic import ValidationError

from ..database import db
from ..models import User
from ..schemas.user import UserLogin, UserRegister

auth_bp = Blueprint("auth", __name__)


def login_required(f):
    """Decorator to require login for a route."""

    @wraps(f)
    def decorated_function(*args, **kwargs):
        if "user_id" not in session:
            flash("Veuillez vous connecter.", "warning")
            return redirect(url_for("auth.login"))
        return f(*args, **kwargs)

    return decorated_function


@auth_bp.route("/login", methods=["GET", "POST"])
def login():
    """Handle user login."""
    if request.method == "POST":
        try:
            data = UserLogin(
                username=request.form.get("username", ""),
                password=request.form.get("password", ""),
            )
        except ValidationError as e:
            flash("Identifiants invalides.", "danger")
            return render_template("auth/login.html", errors=e.errors()), 400

        user = User.query.filter_by(username=data.username).first()
        if user and user.check_password(data.password):
            if not user.is_active:
                flash("Compte désactivé.", "warning")
                return render_template("auth/login.html"), 401

            session["user_id"] = user.id
            session["username"] = user.username
            flash(f"Bienvenue {user.username}!", "success")
            return redirect(url_for("index"))

        flash("Identifiants incorrects.", "danger")

    return render_template("auth/login.html")


@auth_bp.route("/register", methods=["GET", "POST"])
def register():
    """Handle user registration."""
    if not current_app.config.get("REGISTRATION_ENABLED", True):
        flash("L'inscription est actuellement désactivée.", "warning")
        return redirect(url_for("auth.login"))

    if request.method == "POST":
        try:
            data = UserRegister(
                username=request.form.get("username", ""),
                email=request.form.get("email", ""),
                password=request.form.get("password", ""),
                password_confirm=request.form.get("password_confirm", ""),
            )
        except ValidationError as e:
            flash("Données invalides.", "danger")
            return render_template("auth/register.html", errors=e.errors()), 400

        if data.password != data.password_confirm:
            flash("Les mots de passe ne correspondent pas.", "danger")
            return render_template("auth/register.html"), 400

        if User.query.filter_by(username=data.username).first():
            flash("Cet identifiant est déjà utilisé.", "danger")
            return render_template("auth/register.html"), 400

        if User.query.filter_by(email=data.email).first():
            flash("Cet email est déjà utilisé.", "danger")
            return render_template("auth/register.html"), 400

        user = User(username=data.username, email=data.email)
        user.set_password(data.password)
        db.session.add(user)
        db.session.commit()

        flash("Compte créé avec succès! Veuillez vous connecter.", "success")
        return redirect(url_for("auth.login"))

    return render_template("auth/register.html")


@auth_bp.route("/logout", methods=["POST"])
def logout():
    """Handle user logout."""
    session.clear()
    flash("Vous avez été déconnecté.", "info")
    return redirect(url_for("auth.login"))
