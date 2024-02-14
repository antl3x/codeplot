![codeplot-readme](https://github.com/codeplot-co/codeplot/assets/26308297/e1212d25-a731-4755-875d-e988848f6d87)
<div align="center">
<a href="https://codeplot.co">Docs</a> 
<span> · </span><a href="https://codeplot.co/getting-started">Getting Started</a> 
<span> · </span>
<a href="https://discord.gg/fYTsNp5Wvt">Discord</a>
</div>

---

codeplot is a dynamic spatial canvas for data exploration, offering an interactive environment for graphing and visualizing data with Python. 

Created by [@antl3x](https://github.com/antl3x), [read more](https://antl3x.co/posts/2024-01-25-today-i-decided-to-create-a-tool-that-i-always-wanted/) about its inception.

**Why Choose codeplot?**

- **Dynamic Visualization**: Break free from static images and rigid layouts. codeplot brings your data to life on an interactive canvas.
  
- **Easy Integration**: Directly plot from your Python code or REPL into your canvas at [codeplot.co](https://codeplot.co).
  
- **Varied Visualizations**: From basic charts to advanced widgets, codeplot supports a wide range of data representations.
  
- **Flexible Layouts**: Arrange your visualizations to suit your workflow, with draggable and movable plots.
  
- **Open to Everyone**: Designed for data scientists and enthusiasts alike, codeplot aims to enhance your data exploration experience.


# Getting Started (Python SDK)

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
docker run -p 9107:9107 -p 9108:9108 codeplot/codeplot
```

This will start a codeplot server and a client on your local machine, and you can access it at:

- Client: [http://localhost:9107](http://localhost:9107)
- Server: [ws://localhost:9108](ws://localhost:9108)

**Join the codeplot Community**

Become part of a forward-thinking community dedicated to advancing data visualization. Connect, engage, and grow with peers on **[Discord](https://discord.gg/fYTsNp5Wvt)**. With codeplot, data visualization is a shared journey. Let's explore new insights together!
