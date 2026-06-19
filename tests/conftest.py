import sys
from pathlib import Path

import pytest

from src.app import create_app
from src.database import db
from src.models import User

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))


@pytest.fixture(scope="function")
def app():
    """Create application for tests."""
    app = create_app(testing=True)
    with app.app_context():
        db.create_all()
        # Create a test user
        test_user = User(username="testuser", email="test@example.com")
        test_user.set_password("testpassword123")
        db.session.add(test_user)
        db.session.commit()
    yield app
    with app.app_context():
        db.drop_all()


@pytest.fixture
def client(app):
    """Create test client with authenticated session."""
    test_client = app.test_client()
    # Login the test user
    with test_client:
        test_client.post(
            "/login",
            data={
                "username": "testuser",
                "password": "testpassword123",
            },
            follow_redirects=False,
        )
    return test_client

