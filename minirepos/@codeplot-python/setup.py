from setuptools import setup, find_packages

setup(
    name='codeplot',
    version='0.1.0',
    packages=find_packages(),
    install_requires=[
        'watchdog >= 3.0.0',
        'typeid-python >= 0.2.2',
        'ypy-websocket >= 0.12.4',
        'asyncio >= 3.4.3',
        'websockets >= 12.0',
        'y-py >= 0.6.2',
    ],
    author='Antonio Moura (@antl3x)',
    author_email='antonio@codeplot.co',
    description='codeplot is a canvas designed for code-driven data exploration where you can plot graphs, data frames, markdown and much more using plain Python',
    long_description=open('README.md').read(),
    long_description_content_type='text/markdown',  # This is important for rendering Markdown in PyPI
    url='https://github.com/codeplot-co/codeplot',
    license='AGPL-3.0-or-later',
    classifiers=[
        'Programming Language :: Python :: 3',
    ],
    python_requires='>=3.6',
)
