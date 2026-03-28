🚀 **Live demo available here:** https://faraknights.github.io/malmo_builder_mimic/

# COCOBOTS 3D Simulator & Visualizer

This repository contains a 3D interactive simulator and visualization tool developed in a research context for the **COCOBOTS project**.

The goal of this tool is to facilitate the **creation, manipulation, and visualization of experimental data** in a controlled virtual environment. It is designed to support both data generation workflows and model interaction, particularly for structured environments and multimodal research.

![Environment](/public/assets/images/example_ENVIRONMENT.png)

---

## Overview

The simulator provides a flexible 3D environment where users can:

- Create synthetic datasets through structured simulations  
- Visualize and replay previously generated data  
- Interact with AI models in a spatial context  
- Generate multimodal data for future research use cases  

The system is built as a **React / Next.js application**, with additional backend components for handling simulation data.

---

## Simulation Environments

### 1. Minecraft Mode

This mode is based on a **block-world environment**, inspired by Minecraft-like structures.

- Forms the foundation of the **Nebula model development**
- Allows grid-based spatial reasoning
- Ideal for structured and discrete environment experiments

---

### 2. COCOBOTS Mechanical Environment

This environment eatures 9 basic objects: nuts (3 types),
washers, screws, bridges (2 types), bolts, and gas-
kets.

It is designed for more **realistic and applied scenarios**, especially for robotics and manipulation tasks.

---

## Core Functionalities

### Simulation Mode

Allows users to:

- Freely place objects in the environment  
- Construct custom scenes  
- Export simulation data for later reuse  

This mode is primarily used for **dataset creation**.

---

### Visualization Mode

This mode enables:

- Importing simulation data  
- Loading external data formats compatible with model outputs  
- Replaying and analyzing previously generated environments  

It is particularly useful for **evaluation and debugging**.

---

### Nebula Interaction Mode

This mode enables interaction with the **Nebula model**.

- Requires Nebula to be running separately  
- Users interact via a **chat interface**  
- The model generates actions and places objects in the environment  

This provides a **human-in-the-loop interface** for testing model behavior in a spatial context.

---

### COCOBOTS-Specific Modes

#### Direct Instruction Mode

Allows explicit programmatic control of the environment.

Example:

```javascript
place("nut", "red", 1, 1, 1);
place("nut", "red", 1, 2, 1);
place("nut", "red", 1, 3, 1);
place("nut", "red", 1, 4, 1);
```

This will place a vertical row of red nuts in the environment.

This mode is useful for:

- Deterministic scene generation  
- Debugging  
- Controlled experiments  

---

#### Multimodal Mode

Designed for **data generation for multimodal models**.

- Captures images of the environment  
- Produces datasets combining spatial and visual information  
- Intended for future multimodal learning pipelines  

---

## Project Structure

```
.
├── node-backend/     # Backend services for simulation and data handling
├── pages/            # Next.js pages
├── public/           # Static assets
├── src/              # Core application logic
├── build/            # Build artifacts
├── out/              # Exported output
└── electron.mjs      # Electron entry point (desktop integration)
```

---

## Usage

The environment is fully accessible through the live demo hosted on GitHub Pages:

https://faraknights.github.io/malmo_builder_mimic/

---

## Research Context

This tool was developed as part of the **COCOBOTS research initiative**, with a focus on:

- Structured environment simulation  
- Human-AI interaction  
- Multimodal data generation  
- Robotics-inspired virtual environments  

It is intended as a **research platform**, not a production-ready system.

---

## Future Work

- Integration with multimodal learning pipelines  
- Improved model-environment interaction  
- Enhanced dataset export formats  
- Real-time collaboration features  

---

## Repository

https://github.com/ccbts/