
from .commands import plot
import os
import time
import json
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler
import threading
import logging

from .PatchManager import PatchManager
from .commands import plot
from .NEW_FILE_CONTENT import NEW_FILE_CONTENT

CURRENT_CODEPLOT_FILE_PATH = None
CURRENT_CODEPLOT_FILE_JSON = None


class MyHandler(FileSystemEventHandler):
    def on_modified(self, event):
        global CURRENT_CODEPLOT_FILE_PATH
        global CURRENT_CODEPLOT_FILE_JSON

        if event.src_path == CURRENT_CODEPLOT_FILE_PATH:
            try:
                new_contents = _readFile(CURRENT_CODEPLOT_FILE_PATH)
                if new_contents:
                    # Validate JSON structure
                    json.loads(new_contents)  # This line acts as a validation step
                    CURRENT_CODEPLOT_FILE_JSON = json.loads(new_contents)
            except json.JSONDecodeError as e:
                logging.warning(f"JSON decoding failed during file modification: {e}")
            except Exception as e:
                logging.error(f"Unexpected error during file modification: {e}")# Handle other unexpected errors

def _readFile(filepath):
    """
    Read the file content and return it as a string.
    """
    with open(filepath, 'r') as file:
        contents = file.read()
        return contents




def start_monitoring(path):
    event_handler = MyHandler()
    observer = Observer()
    observer.schedule(event_handler, path=os.path.dirname(path), recursive=False)
    observer.start()

    def monitor():
        try:
            while True:
                time.sleep(1)
        except KeyboardInterrupt:
            observer.stop()
        observer.join()

    # Run the monitoring in a separate thread
        thread = threading.Thread(target=monitor)
        thread.daemon = True  # Set the thread as a daemon thread
        thread.start()
    
def init(filepath=None):
    global CURRENT_CODEPLOT_FILE_PATH

    default_filename = "Untitled.codeplot"
    
    if filepath:
        # Check if the provided filepath is absolute, if not, consider it relative to the current directory
        if not os.path.isabs(filepath):
            final_path = os.path.join(os.getcwd(), filepath)
        else:
            final_path = filepath
    else:
        # If no filepath is provided, use the default filename in the current directory
        final_path = os.path.join(os.getcwd(), default_filename)

    CURRENT_CODEPLOT_FILE_PATH = final_path
    _createOrOpenFile(final_path)

    # Set the current state in PatchManager
    PatchManager.set_current_state(CURRENT_CODEPLOT_FILE_PATH, CURRENT_CODEPLOT_FILE_JSON)

    # Start monitoring the file for changes
    start_monitoring(final_path)

def _createOrOpenFile(filepath):
    # Ensure the directory exists
    os.makedirs(os.path.dirname(filepath), exist_ok=True)
    
    with open(filepath, 'a+') as file:
        file.seek(0)
        contents = file.read()
        global CURRENT_CODEPLOT_FILE_JSON
        if contents:
            CURRENT_CODEPLOT_FILE_JSON = json.loads(contents)
        else:
            CURRENT_CODEPLOT_FILE_JSON = json.loads(json.dumps(NEW_FILE_CONTENT))
