"""CLI commands for the application."""

import click

from src.app import create_app
from src.database import db
from src.models import User


@click.group()
def cli():
    """Management commands."""
    pass


@cli.command()
@click.option("--username", prompt="Username", help="Username for the new user")
@click.option("--email", prompt="Email", help="Email for the new user")
@click.option(
    "--password",
    prompt=True,
    hide_input=True,
    confirmation_prompt=True,
    help="Password for the new user",
)
def create_user(username: str, email: str, password: str) -> None:
    """Create a new user."""
    app = create_app()

    with app.app_context():
        # Check if user already exists
        if User.query.filter_by(username=username).first():
            click.echo(f"❌ User '{username}' already exists.")
            return

        if User.query.filter_by(email=email).first():
            click.echo(f"❌ Email '{email}' is already registered.")
            return

        # Create user
        user = User(username=username, email=email)
        user.set_password(password)
        db.session.add(user)
        db.session.commit()

        click.echo(f"✅ User '{username}' created successfully!")


@cli.command()
def list_users() -> None:
    """List all users."""
    app = create_app()

    with app.app_context():
        users = User.query.all()

        if not users:
            click.echo("No users found.")
            return

        click.echo(f"\n{'ID':<5} {'Username':<20} {'Email':<30} {'Active':<10}")
        click.echo("=" * 65)
        for user in users:
            click.echo(
                f"{user.id:<5} {user.username:<20} {user.email:<30} "
                f"{'Yes' if user.is_active else 'No':<10}"
            )


@cli.command()
@click.option("--username", prompt="Username", help="Username to delete")
@click.confirmation_option(
    prompt="Are you sure you want to delete this user? This cannot be undone."
)
def delete_user(username: str) -> None:
    """Delete a user."""
    app = create_app()

    with app.app_context():
        user = User.query.filter_by(username=username).first()

        if not user:
            click.echo(f"❌ User '{username}' not found.")
            return

        db.session.delete(user)
        db.session.commit()

        click.echo(f"✅ User '{username}' deleted.")


@cli.command()
@click.option("--username", prompt="Username", help="Username to toggle")
def toggle_user(username: str) -> None:
    """Toggle user active status."""
    app = create_app()

    with app.app_context():
        user = User.query.filter_by(username=username).first()

        if not user:
            click.echo(f"❌ User '{username}' not found.")
            return

        user.is_active = not user.is_active
        db.session.commit()

        status = "activated" if user.is_active else "deactivated"
        click.echo(f"✅ User '{username}' {status}.")


if __name__ == "__main__":
    cli()
