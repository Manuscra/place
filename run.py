import os
from src.app import create_app

env = os.environ.get("FLASK_ENV", "development")
debug = env != "production"
app = create_app()

if __name__ == "__main__":
    app.run(debug=debug)
