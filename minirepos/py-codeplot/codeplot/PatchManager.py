import jsonpatch
import json
import os

class PatchManager:
    filepath = None
    json_data = None

    @staticmethod
    def set_current_state(filepath, json_data):
        PatchManager.filepath = filepath
        PatchManager.json_data = json_data

    @staticmethod
    def emit_patch(patch):
        """
        Apply a JSON Patch operation to the current JSON object
        and write the updated JSON to the file.
        """
        try:
            PatchManager.json_data = jsonpatch.apply_patch(PatchManager.json_data, patch)
            PatchManager._write_file()
        except jsonpatch.JsonPatchException as e:
            print(f"Error applying patch: {e}")

    @staticmethod
    def _write_file():
        """
        Write the updated JSON data to the file and ensure it's flushed to disk.
        """
        if PatchManager.filepath is not None:
            with open(PatchManager.filepath, 'w') as file:
                json.dump(PatchManager.json_data, file, indent=4)
                file.flush()  # Flush Python file buffers
                os.fsync(file.fileno())  # Ensure OS buffers are flushed to disk