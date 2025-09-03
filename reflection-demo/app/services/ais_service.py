# [cite_start]We are adapting the workflow from your original script [cite: 1]
from ..core_ai_logic.ais_v1_1 import AutonomousInstantiationService as CoreAIS
from ..schemas.persona_schemas import PersonaInstance
from .supernova_service import api_supernova_service

class ApiAisService:
    def __init__(self):
        # The service creates its own instance of the core AI engine
        self._core_ais = CoreAIS()

    def rehydrate(self, persona_id: str) -> PersonaInstance:
        """
        Takes a simple persona_id from the API, runs the full, complex
        core AI rehydration process, and formats the result back into a
        clean data schema for the API to return.
        """
        # 1. Define any parameters needed for instantiation
        parameters = {"initial_directive": "Establish initial state for web session."}
        
        # 2. Call the powerful, internal AI logic
        # [cite_start]This executes the multi-step process from your AIS script [cite: 1]
        new_instance_from_core = self._core_ais.rehydrate(persona_id, parameters)

        # 3. Translate the result into a clean API response model
        # The API doesn't need to know about the internal complexity.
        api_response = PersonaInstance(
            instance_id=f"active_{new_instance_from_core.id}_{hash(id(new_instance_from_core))}",
            blueprint_id=new_instance_from_core.id,
            current_state_vector=new_instance_from_core.state_vector,
            session_context={"status": "Rehydrated successfully"}
        )
        
        # *** NEW STEP: Register the new instance with the orchestrator ***
        api_supernova_service.register_instance(api_response)
        
        return api_response

# Create a single, reusable instance of our service for the API to use
api_ais_service = ApiAisService()