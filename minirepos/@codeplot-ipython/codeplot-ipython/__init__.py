import asyncio
from IPython.core.magic import Magics, magics_class, line_magic
from IPython.core.magic_arguments import (argument, magic_arguments, parse_argstring)
import threading
import codeplot


class AsyncLoopThread:
    """A class that manages an asyncio loop in a separate thread."""
    def __init__(self):
        self.loop = asyncio.new_event_loop()
        self.thread = threading.Thread(target=self.run_loop)
        self.thread.start()

    def run_loop(self):
        """Run the loop until it is stopped."""
        asyncio.set_event_loop(self.loop)
        self.loop.run_forever()

    def stop(self):
        """Stop the loop and wait for the thread to finish."""
        self.loop.call_soon_threadsafe(self.loop.stop)
        self.thread.join()

    def run_coroutine(self, coro):
        """Thread-safe way to schedule a coroutine in the loop."""
        return asyncio.run_coroutine_threadsafe(coro, self.loop)

async_loop_thread = AsyncLoopThread()  # Initialize this somewhere suitable


@magics_class
class CodeplotMagics(Magics):
    @line_magic
    def cP_connect(self, line):
        """Establish a connection to Codeplot with the provided URL."""
        params = line.split()
        if params:
            url = params[0]
            async_loop_thread.run_coroutine(self.shell.user_ns['_cP_extension'].connect_to_codeplot(url))
        else:
            raise Exception("No URL provided.")

    @line_magic
    def cP_supress(self, boolean):
        """Toggle output suppression."""
        _cP_extension = self.shell.user_ns['_cP_extension']
        _cP_extension._suppress = boolean.lower() == 'true'
        print(f"Output suppression is now: {boolean}.")

    @magic_arguments()
    @argument('-id', '--id', help='ID of the plot to update.')
    @argument('-tl', '--title', help='Title of the plot.')
    @line_magic
    def cP_plot(self, line):
        """Parse arguments for plotting."""
        args = parse_argstring(self.cP_plot, line)
        _cP_extension = self.shell.user_ns['_cP_extension']
        _cP_extension._plot_magic_args.update(vars(args))


class IPythonExtension:
    def __init__(self, ipython):
        self.ipython = ipython
        self.cP = None
        self.connection_established = False
        self._suppress = True
        self._plot_magic_args = {}
        self.hook_into_ipython()

    def hook_into_ipython(self):
        """Modify IPython hooks and methods for custom behavior."""
        self.ipython.display_pub.publish = self.custom_display_pub_publish
        self.ipython.user_ns['_cP_extension'] = self
        self.ipython.events.register('pre_run_cell', self.pre_run_cell)

    async def connect_to_codeplot(self, url):
        """Connect to Codeplot asynchronously."""
        if not self.connection_established and url:
            self.cP = await codeplot.connect(url)
            self.connection_established = True
            print("Connected to Codeplot.")

    def _display_hook__call__(self, result=None):
        """Custom display hook."""
        if result is not None and self.cP:
            async_loop_thread.run_coroutine(self.cP.plot(result, **self._plot_magic_args))

        self._plot_magic_args = {}
        if not self._suppress:
            self.ipython.displayhook.__ocall__(result)


    def custom_display_pub_publish(self, *args, **kwargs):
        """Custom publishing method that integrates with Codeplot."""
        data = kwargs.get('data')
        if data and self.cP:
            async_loop_thread.run_coroutine(self.cP.plot(data, **self._plot_magic_args))

        if not self._suppress:
            self._original_display_pub_publish(*args, **kwargs)

    def pre_run_cell(self, info):
        """Prepare arguments before running a cell."""
        if hasattr(info, 'cell_id') and info.cell_id:
            self._plot_magic_args['id'] = info.cell_id
            self._plot_magic_args['ipythonCellId'] = info.cell_id

        if hasattr(info, 'raw_cell'):
            self._plot_magic_args['ipythonRawCell'] = info.raw_cell


def load_ipython_extension(ipython):
    """Load the IPython extension."""
    magics = CodeplotMagics(ipython)
    ipython.register_magics(magics)
    ext = IPythonExtension(ipython)

    # Save the original display_pub.publish method
    # and replace it with the custom method.
    ipython.displayhook_class.__ocall__ = ipython.displayhook_class.__call__
    ipython.displayhook_class.__call__ = ext._display_hook__call__
