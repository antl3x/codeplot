import asyncio
from IPython.core.magic import Magics, magics_class, line_magic
from IPython.core.magic_arguments import (argument, magic_arguments, parse_argstring)

import codeplot


@magics_class
class Magics(Magics):
    
    @line_magic
    def cP_connect(self, line):
        "A line magic to accept parameters and establish connection."
        # Process the line into parameters here
        params = line.split()
        # Establish connection using the first parameter as URL
        if params:
            url = params[0]
            asyncio.create_task(self.shell.user_ns['_cP_extension'].connect_to_codeplot(url))
        else:
            raise Exception("No URL provided.")
    @line_magic
    def cP_supress_output(self, boolean):
        "Toggle output suppression."
        _cP_extension = self.shell.user_ns.get('_cP_extension')
        _cP_extension._supress_output = boolean
        print(f"Output suppression is now: {boolean}.")

    @magic_arguments()
    @argument('-id', '--id', help='ID of the plot to update.')
    @argument('-tl', '--title', help='Title of the plot.')
    @line_magic
    def cP_plot(self, line):
        # Parse arguments
        _cP_extension = self.shell.user_ns.get('_cP_extension')
        _cP_extension._plot_magic_args = {
            **_cP_extension._plot_magic_args,
            **vars(parse_argstring(self.cP_plot, line))
        }

class IPythonExtension:
    def __init__(self, ipython):
        self.ipython = ipython
        self.captured_output = []
        self.cP = None
        self.connection_established = False
        self._supress_output = True
        self._plot_magic_args = {}
        self._original_display_pub_publish = self.ipython.display_pub.publish
        self.ipython.display_pub.publish = self.custom_display_pub_publish
        

    async def connect_to_codeplot(self, url):
        if not self.connection_established and url:
            self.cP = await codeplot.connect(url)
            self.connection_established = True
            print("Connected to Codeplot.")

    def custom_display_pub_publish(self, *args, **kwargs):
        data = kwargs.get('data', None)
        if data is not None:
            asyncio.create_task(self.cP.plot(data, **self._plot_magic_args))
            self._ploted_by_display_pub = True
        if self._supress_output is False:
            self._original_display_pub_publish(*args, **kwargs)
        

    def pre_run_cell(self, info):

        # Build args from the cell info
        if hasattr(info, 'cell_id'):
            if info.cell_id is not None:
                self._plot_magic_args['id'] = info.cell_id
                self._plot_magic_args['ipythonCellId'] = info.cell_id
        if hasattr(info, 'raw_cell'):
            self._plot_magic_args['ipythonRawCell'] = info.raw_cell


    def post_run_cell(self, result):
        if not self.connection_established:
            # The connection is now established using the %connect magic, so this may not be needed
            pass
        if result.result is not None and self.cP is not None:
            asyncio.create_task(self.cP.plot(result.result, **self._plot_magic_args))
        
        # Clean up the current cell id
        self._magic_current_cell_id = None
        self._plot_magic_args = {}
           

def load_ipython_extension(ipython):
    
        ipython.register_magics(Magics(ipython))
        _cP_extension = IPythonExtension(ipython)
        # Store the extension instance in the IPython user namespace for access from magics
        ipython.user_ns['_cP_extension'] = _cP_extension
        ipython.events.register('pre_run_cell', _cP_extension.pre_run_cell)
        ipython.events.register('post_run_cell', _cP_extension.post_run_cell)

