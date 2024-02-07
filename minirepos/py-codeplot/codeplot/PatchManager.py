import jsonpatch
import json
import os
import tempfile
import shutil

class PatchManager:
    filepath = None
    json_data = None

    @staticmethod
    def set_current_state(filepath, json_data):
        PatchManager.filepath = filepath
        PatchManager.json_data = json_data

    @staticmethod
    def emit_patch(patch):
        try:
            PatchManager.json_data = jsonpatch.apply_patch(PatchManager.json_data, patch)
            PatchManager._write_file()
        except jsonpatch.JsonPatchException as e:
            print(f"Error applying patch: {e}")

    @staticmethod
    def _write_file():
        if PatchManager.filepath is not None:
            atomic_write(PatchManager.filepath, PatchManager.json_data)

    @staticmethod
    def get_first_page():
        if PatchManager.json_data is not None and "store" in PatchManager.json_data:
            pages = [value for key, value in PatchManager.json_data["store"].items() if value.get("typeName") == "page"]
            if pages:
                # Assuming pages are ordered by their 'index' attribute or just taking the first one
                # This part might need adjustment based on how pages are ordered in your application
                first_page = sorted(pages, key=lambda x: x.get("index"))[0]
                return first_page
            else:
                print("No pages found in document.")
        else:
            print("Document structure does not contain 'store'.")
        return None

def atomic_write(filepath, data):
    dir_name = os.path.dirname(filepath)
    with tempfile.NamedTemporaryFile(mode='w', dir=dir_name, delete=False) as tmp_file:
        json.dump(data, tmp_file, indent=4)
        temp_name = tmp_file.name
    shutil.move(temp_name, filepath)
