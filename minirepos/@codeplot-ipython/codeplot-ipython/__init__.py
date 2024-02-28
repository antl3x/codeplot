import asyncio
from IPython.core.magic import Magics, magics_class, line_magic
import codeplot


@magics_class
class Magics(Magics):
    
    @line_magic
    def cP_connect(self, line):
        "A line magic to accept parameters and establish connection."
        # Process the line into parameters here
        params = line.split()
        self.shell.user_ns['my_extension_params'] = params
        # Establish connection using the first parameter as URL
        if params:
            url = params[0]
            asyncio.create_task(self.shell.user_ns['ext'].connect_to_codeplot(url))
        else:
            print("No URL provided.")
    @line_magic
    def cP_supress_output(self, boolean):
        "Toggle output suppression."
        ext = self.shell.user_ns.get('ext')
        ext._supress_output = boolean
        print(f"Output suppression is now: {boolean}.")

class IPythonExtension:
    def __init__(self, ipython):
        self.ipython = ipython
        self.captured_output = []
        self.cP = None
        self.connection_established = False
        self._supress_output = True



    async def connect_to_codeplot(self, url):
        if not self.connection_established and url:
            self.cP = await codeplot.connect(url)
            self.connection_established = True
            print("Connected to Codeplot.")

    def custom_display_pub_publish(self, *args, **kwargs):
        data = kwargs.get('data', {})
        if self.cP is not None and data:
            asyncio.create_task(self.cP._plotIPythonCell(data))

    def post_run_cell(self, result):
        if not self.connection_established:
            # The connection is now established using the %connect magic, so this may not be needed
            pass
        if result.result is not None and self.cP is not None:
            # Now that connection is established, we can plot
            asyncio.create_task(self.cP.plot(result.result, id=result.info.cell_id, ipython_raw_cell=result.info.raw_cell, ipython_cell_id=result.info.cell_id))

        if self._supress_output and result.result is not None:
            self.ipython.display_pub.clear_output()
        
           

def load_ipython_extension(ipython):
    
        ipython.register_magics(Magics(ipython))
        ext = IPythonExtension(ipython)
        # Store the extension instance in the IPython user namespace for access from magics
        ipython.user_ns['ext'] = ext
        ipython.events.register('post_run_cell', ext.post_run_cell)
