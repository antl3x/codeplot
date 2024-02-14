# ---------------------------------------------------------------------------- #
#                                   YKeyValue                                  #
# ---------------------------------------------------------------------------- #
class YKeyValue:
    def __init__(self, doc, yarray):
        self.yarray = yarray
        self.doc = doc
        self.map = {}

        # Initialize the map and cleanup duplicate items
        with self.doc.begin_transaction() as txn:
            items_to_remove = []
            for i in range(len(self.yarray) - 1, -1, -1):
                item = self.yarray[i]
                key = item.get('key')
                if key in self.map:
                    items_to_remove.append(i)
                else:
                    self.map[key] = item
            # Remove duplicate items
            for i in items_to_remove:
                self.yarray.delete(txn, i)


    def set(self, key, val):
        with self.doc.begin_transaction() as txn:
            # Find if the key already exists and remove the old item
            for i, item in enumerate(self.yarray):
                if item and 'key' in item and item['key'] == key:
                    self.yarray.delete(txn, i)
                    break
            # Append the new item
            self.yarray.append(txn, {'key': key, 'val': val})
            self.map[key] = {'key': key, 'val': val}

    def delete(self, key):
        with self.doc.begin_transaction() as txn:
            for i, item in enumerate(self.yarray):
                if item and 'key' in item and item['key'] == key:
                    self.yarray.delete(txn, i)
                    break
            self.map.pop(key, None)

    def get(self, key):
        item = self.map.get(key)
        return item['val'] if item else None

    def has(self, key):
        return key in self.map

