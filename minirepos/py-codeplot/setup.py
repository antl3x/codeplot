from setuptools import setup, find_packages

setup(
    name='codeplot',
    version='0.1.0',
    packages=find_packages(),
    install_requires=[
        # e.g., 'requests >= 2.25.1',
        'watchdog >= 3.0.0',
        'pandas >= 2.2.0',
        'typeid-python >= 0.2.2',
        'plotly >= 5.18.0',
        'python-socketio >= 5.11.0',
    ],
    # Additional metadata about your package
    author='Antonio Moura (@antl3x)',
    author_email='antonio@codeplot.co',
    description='codeplot is a canvas designed for code-driven data exploration where you can plot graphs, data frames, markdown and much more using plain Python',
    long_description=open('README.md').read(),
    long_description_content_type='text/markdown',  # This is important for rendering Markdown in PyPI
    url='https://github.com/codeplot-co/codeplot',
    license='Apache License 2.0',
    classifiers=[
        'Programming Language :: Python :: 3',
        'License :: OSI Approved :: Apache Software License',
        'Operating System :: OS Independent',
    ],
    python_requires='>=3.6',
)
