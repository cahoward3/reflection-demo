# Aurora Genesis Engine - Frontend Interface

An elegant web interface for the Aurora Genesis Engine, providing comprehensive management and interaction capabilities for multi-agent AI systems.

## Features

### 🤖 Persona Management
- **Autonomous Instantiation Service (AIS)**: Activate persona blueprints into live instances
- **Real-time Status Monitoring**: Track active personas and their states
- **Dynamic State Visualization**: View persona state vectors and session context

### 💬 Supernova Orchestrator
- **Interactive Chat Interface**: Communicate directly with active persona instances
- **Multi-persona Support**: Manage conversations across multiple AI agents
- **Real-time Response Generation**: Seamless integration with the backend orchestrator

### 🔥 Aurora Reflection Engine (A.R.E.)
- **Controlled Burn Testing**: Run validation and stress tests on persona instances
- **Comprehensive Reporting**: Generate detailed analysis reports (MRJ and Markdown formats)
- **Emergent Behavior Analysis**: Monitor and analyze AI agent behaviors

### 📊 System Monitoring
- **Health Checks**: Real-time API connectivity monitoring
- **Performance Metrics**: Track system status and active instances
- **Error Handling**: Graceful degradation and error reporting

## Technology Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS with custom Aurora/Genesis color schemes
- **Animations**: Framer Motion for smooth interactions
- **API Integration**: Axios with comprehensive error handling
- **Icons**: Lucide React for consistent iconography

## Setup Instructions

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Configure Environment**:
   ```bash
   cp .env.example .env
   # Update VITE_API_URL to match your backend deployment
   ```

3. **Start Development Server**:
   ```bash
   npm run dev
   ```

## API Integration

The frontend connects to the Aurora Genesis Engine backend API with the following endpoints:

- `POST /api/v1/personas/{persona_id}/rehydrate` - Activate persona instances
- `POST /api/v1/orchestrator/chat` - Send messages to active personas
- `POST /api/v1/are/run_burn/{instance_id}` - Execute Controlled Burn tests
- `GET /` - Health check endpoint

## Usage Guide

1. **Activate a Persona**: Enter a persona blueprint ID and click "Activate Persona"
2. **Start Chatting**: Use the chat interface to interact with your active persona
3. **Run Tests**: Use the A.R.E. panel to run Controlled Burn validation tests
4. **Monitor System**: Check the system status panel for health and performance metrics

## Design Philosophy

The interface embodies the Aurora Genesis aesthetic with:
- **Glass morphism effects** for modern, ethereal appearance
- **Aurora/Genesis color gradients** reflecting the dual nature of the system
- **Smooth animations** providing feedback and enhancing user experience
- **Responsive design** ensuring optimal experience across all devices

## Production Deployment

Update the `VITE_API_URL` environment variable to point to your deployed backend service before building for production.

```bash
npm run build
```