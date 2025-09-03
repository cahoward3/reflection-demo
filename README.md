# Aurora Genesis Engine - Backend API

This repository contains the backend API for the Aurora Genesis Engine, a cloud-based IDE for creating, testing, and deploying multi-agent AI systems.

## Core Features

* **Persona Management:** Create, store, and manage AI persona blueprints via a robust API.
* **Autonomous Instantiation Service (AIS):** Deploy persona blueprints into active, stateful instances for interaction.
* **Aurora Reflection Engine (ARE):** Run validation and stress tests on persona instances to analyze emergent behaviors.
* **Supernova Orchestrator:** Manage the interactions and shared context of multi-agent systems.

## Technology Stack

* **Framework:** FastAPI (Python 3.11+)
* **Database:** PostgreSQL
* **Containerization:** Docker
* **Deployment:** Google Cloud Run

## Local Setup

1.  **Clone the repository:**
    `git clone <repository_url>`
2.  **Install dependencies:**
    `pip install -r requirements.txt`
3.  **Run the development server:**
    `uvicorn app.main:app --reload`

The API will be available at `http://127.0.0.1:$PORT`.
