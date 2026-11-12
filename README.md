# TaskFlow – Role-Based Task & Workflow Management System

A full-stack role-based task and workflow management application built with **FastAPI**, **React (Vite)**, **MySQL**, and **Docker Compose**.

## Tech Stack
* **Backend:** Python, FastAPI, SQLAlchemy ORM, PyMySQL, JWT Authentication (`python-jose`, `passlib`/`bcrypt`)
* **Frontend:** React.js (Vite), JavaScript, CSS
* **Database:** MySQL 8.0
* **DevOps & Containerization:** Docker, Docker Compose

## Role-Based Access Control (RBAC)
* **Admin:** Full system access—create, assign, update, and delete tasks across all users.
* **Manager:** Create and assign tasks to team members and monitor workflow progress.
* **Developer:** View assigned tasks and update task execution status (`pending` → `in_progress` → `completed`).

## Quick Start with Docker Compose

### Prerequisites
* [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running
* Git

### 1. Clone the repository
```bash
git clone <your-github-repo-url>
cd task-flow-app