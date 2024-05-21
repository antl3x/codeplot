![codeplot-readme](https://github.com/codeplot-co/codeplot/assets/26308297/e1212d25-a731-4755-875d-e988848f6d87)
<div align="center">
<a href="https://codeplot.co">Demo</a> 
<span> · </span>
<a href="https://codeplot.co/discord">Discord</a>
</div>

---

codeplot is a dynamic spatial canvas for data exploration, offering an interactive environment for graphing and visualizing data with Python. 

Created by [@antl3x](https://github.com/antl3x), [read more](https://antl3x.co/posts/2024-01-25-today-i-decided-to-create-a-tool-that-i-always-wanted/) about its inception.

# Video Demo
[![Watch the video](https://img.youtube.com/vi/x7QLEu5t17g/maxresdefault.jpg)](https://youtu.be/x7QLEu5t17g)

**Why Choose codeplot?**

- **Dynamic Visualization**: Break free from static images and rigid layouts. codeplot brings your data to life on an interactive canvas.
  
- **Easy Integration**: Directly plot from your Python code or REPL into your canvas at [codeplot.co](https://codeplot.co).
  
- **Varied Visualizations**: From basic charts to advanced widgets, codeplot supports a wide range of data representations.
  
- **Flexible Layouts**: Arrange your visualizations to suit your workflow, with draggable and movable plots.
  
- **Open to Everyone**: Designed for data scientists and enthusiasts alike, codeplot aims to enhance your data exploration experience.

# Getting Started (IPython Extension)
To use codeplot in a IPython Notebook like Jupyter, Google Colab, etc, you can install the IPython Extension using pip:

```bash
pip install codeplot-ipython
```

After install you can load the extension and connect to a new room:

```python
%load_ext codeplot-ipython
%cP_connect ws://your-ws-url/your-room-id
```

Now the output of your cells will be automatically plotted in the codeplot canvas! So you don't need to use the `cP.plot` function.

Thats all!

# Getting Started (Python SDK)

If you want to use codeplot in a Python script, and have a more "fine-grained" control over the plots, you can use the Python SDK.

To get started with codeplot, you can install the package using pip:

```bash
pip install codeplot
```

Once installed, you can start using codeplot by importing the package and connectig to a new room:

```python
import asyncio
import codeplot

async def main():
    cP = await codeplot.connect("ws://your-ws-url/your-room-id")

    # Now you can start plotting
    await cP.plot(df.describe())
    await cP.plot(df.head(10))
    await cP.plot(df)

asyncio.run(main())
```

You can use the public codeplot client & server to start plotting right away:

1. Join the codeplot room at [codeplot.co](https://codeplot.co)
2. Use the room id to connect to the room using the code above


If you want to use codeplot in a Jupyter Notebook, you can use the following code:

```python
import codeplot
cP = await codeplot.connect("ws://your-ws-url/your-room-id")

# Now you can start plotting
await cP.plot(df.describe())
await cP.plot(df.head(10))
await cP.plot(df)
```

# Run Codeplot on Docker

Instead of using the public codeplot server, you can self-host and run codeplot on your local machine using Docker. To do so, you can use the following command:

```bash
curl -s https://raw.githubusercontent.com/codeplot-co/codeplot/master/minirepos/@codeplot-docker/docker-compose.yaml | docker-compose -f - up
```

Or if you are using docker-compose v2, you can use the following command instead

```bash
curl -s https://raw.githubusercontent.com/codeplot-co/codeplot/master/minirepos/@codeplot-docker/docker-compose.yaml | docker compose -f - up
```

This will start a codeplot server and a client on your local machine, and you can access it at:

- Client: [http://localhost:9107](http://localhost:9107)
- Server: [ws://localhost:9108](ws://localhost:9108)

**Join the codeplot Community**

Become part of a forward-thinking community dedicated to advancing data visualization. Connect, engage, and grow with peers on **[Discord](https://codeplot.co/discord)**. With codeplot, data visualization is a shared journey. Let's explore new insights together!

# License and Pricing

Codeplot is crafted to support a wide range of users, from individuals exploring their personal projects to enterprises seeking to enhance their business processes. To accommodate this diversity, Codeplot adopts a dual-license approach.

Codeplot is free to use for personal and non-commercial purposes.

Only pay if you use Codeplot commercially.

Read more about [License and Pricing here](LICENSE.md).

# Sponsor

This project is sponsored by [LearnPolars.co](https://learnpolars.co). LearnPolars is a platform to learn data manipulation and analysis using Polars, a blazingly fast DataFrame library in Python (Rust).