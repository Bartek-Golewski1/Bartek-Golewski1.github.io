import sys
import platform

imie = "Bartek"
album = "57779"

python_version = platform.python_version()
python_location = sys.executable

print(f"Hello {imie} ({album}). This environment is using Python version {python_version} at location {python_location}.")